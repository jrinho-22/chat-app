import mongoose from "mongoose"
import { Request, Response } from "express"

export interface IRoom {
    _id: mongoose.Schema.Types.ObjectId
    users: Array<mongoose.Schema.Types.ObjectId>
}

export interface IMessages<T extends string | mongooseId> {
    _id: T
    userId: T
    roomId: T
    created: Date
    content: string
}

export type IMessagesReceived = IMessages<string> & { msgId?: string, roomType: 'room' | 'contact' }

export interface IUnreadMessages<T extends string | mongooseId> {
    _id: T
    userId: T
    // roomId: T
    senderId: T 
    messageId: T
    read: boolean
    //userId, senderId and read used to calculate unreadmessages on aggregate
}

export interface IUser<T extends string | mongooseId> {
    _id: T
    avatar: string
    contacts: T[]
    name: string
}

export interface IUserWithContacts<T extends string | mongooseId> {
    _id: T
    contacts: IUser<string>[]
    name: string
}

export type IContactsWithUnreadMsg<T extends string | mongooseId> =
    IUser<T> & {
        unreadmessages: ((IUnreadMessages<string> & {message?: IMessages<string>} | IMessages<string>))[]  //used only for the length  
    };

export type IUserDTO = {
    name: string
    avatar: string
}

export type mongooseId = mongoose.Schema.Types.ObjectId

export type liveConnections<T extends string | mongooseId> = {
    socketId: string,
    user: IUser<T>,
    newMessage?: any[]
}

export interface roomRequest<T extends string | mongooseId> {
    requestPayload: { users: string[] | T[] }
    requestResponse: { roomId: T }
}