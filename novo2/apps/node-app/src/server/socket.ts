import http from 'http';
import { Server } from 'socket.io';
import serverIntance from "./server"
import { checkRoomType, loginUser } from '../schemas/user/user.action';
import { IMessages, liveConnections, mongooseId } from '@novo2/types-lib';
import { getUsersByRoomId } from '../schemas/room/room.action';
import { saveMessage } from '../schemas/messages/message.action';
import { readAllMessage, readMessage, saveNotReadMessage } from '../schemas/not-read-messages/notRead.action';

class Socket {
    static _instance: Socket | null = null;
    private _io: Server
    private liveClients: liveConnections<mongooseId>[] = []

    constructor() {
        if (!Socket._instance) {
            Socket._instance = this;
        }
        return Socket._instance;
    }

    init(server: http.Server) {
        this._io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.registerEvents()
    }

    registerEvents() {
        this._io.on('connection', (socket) => {

            socket.on("login-user", async (userData: { userName: string, avatar: string }) => {
                const user = await loginUser(userData.userName, userData.avatar)
                this.liveClients.push({ socketId: socket.id, user: user })
                socket.emit("user-registered", user)
                this._io.emit("liveConnections", this.liveClients)
            })

            socket.on("read-message", async (msgId: string) => {
                await readMessage(msgId)
            })

            socket.on("read-all-messages", async (ids: { userId: string, senderId: string }) => {
                await readAllMessage(ids)
            })

            socket.on("message-sent", async (messageDto: Omit<IMessages<string>, "_id">) => {
                const messageSaved = await saveMessage(messageDto)
                const users = await getUsersByRoomId(messageDto.roomId)
                const [senderId, receivedUser] = String(users[0]) == messageDto.userId ?
                users : [users[1], users[0]];
                const roomType = await checkRoomType(senderId, receivedUser)
                let msgId: mongooseId | undefined
                if (roomType == "contact") {
                    const notReadId = await saveNotReadMessage(messageDto.roomId, messageDto.userId, String(messageSaved._id), String(receivedUser))
                    msgId = notReadId._id
                }
                users.forEach(userId => {
                    const userConnection = this.liveClients.find(client => client.user._id.toString() === userId.toString());
                    if (userConnection) {
                        this._io.to(userConnection.socketId).emit("new-message", { ...messageDto, msgId: msgId, roomType: roomType });
                    }
                });
            })

            socket.on('disconnect', () => {
                this.liveClients = this.liveClients.filter(client => client.socketId !== socket.id);
                this._io.emit('liveConnections', this.liveClients);
            })
        });
    }
}

const instance = new Socket()

instance.init(serverIntance.httpServer)

export default instance