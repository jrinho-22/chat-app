import { IMessages, IUnreadMessages, mongooseId } from "@novo2/types-lib";
import { createNotReadModel, NotReadModel } from "./notReadSchema";

export const saveNotReadMessage = async (roomId: string, senderId: string, messageId: string, userId: string) => {
    return createNotReadModel({ userId, messageId, senderId, read: false }).save()
}

export const loadUnreadMessages = async (userId: any) => {
    const messages = await NotReadModel.find({ userId: userId })
    return messages
}

export const readMessage = async (msgId: any) => {
    const message = await NotReadModel.findByIdAndUpdate(msgId, { read: true })
    return message
}

export const readAllMessage = async (ids: { userId: string, senderId: string }) => {
    await NotReadModel.updateMany(
        {
            userId: ids.userId, senderId: ids.senderId, read: false
        },
        {
            $set: { read: true }
        }
    );
}