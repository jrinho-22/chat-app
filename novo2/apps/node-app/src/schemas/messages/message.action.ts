import { IMessages } from "@novo2/types-lib";
import { createMessageModel, MessagesModel } from "./messagesSchema";

export const saveMessage = async(message: Partial<IMessages<string>>) => {
    return createMessageModel(message).save()
}

export const loadMessages = async(roomId: any) => {
    const messages = await MessagesModel.find({roomId: roomId})
    return messages
}