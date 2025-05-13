import { Request, Response } from "express"
import { apiInterface } from "../../interfaces/api"
import { loadMessages } from "../messages/message.action"
import { customErro, defaultError } from "../../helpers/errorHandler"
import { getRoomByUsers } from "./room.action"
import { mongooseId, roomRequest } from "@novo2/types-lib"

export const roomController: apiInterface[] = [
    {
        mathod: "post",
        path: "/room",
        callback: async (req: Request, res: Response) => {
            const body: roomRequest<string>["requestPayload"] = req.body?.users && req.body || ['']
            try {
                const roomId = await getRoomByUsers(body.users)
                res.send({ roomId })
            } catch (originalError) {
                console.log(originalError)
                try {
                    customErro(originalError, res)
                } catch (error) {
                    defaultError(res, originalError.message)
                }

            }
        }
    },
    {
        mathod: "get",
        path: "/messages",
        callback: async (req: Request, res: Response) => {
            const body: { users: string[] } = req.body?.users && req.body || ['']
            try {
                const roomId = await getRoomByUsers(body.users)
                const messages = await loadMessages(roomId)
                res.send(messages)
            } catch (error) {
                const errorObj: { message: string, status: number } = JSON.parse(error.message)
                if (typeof errorObj == 'object') {
                    res.status(errorObj.status).json({
                        error: "An error occurred while retrieving the room.",
                        message: errorObj.message || "Unknown error"
                    });
                } else {
                    defaultError(res, error.message)
                }
            }

        }
    }]