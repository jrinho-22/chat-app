import { IMessages, IUser, IUserDTO, mongooseId } from "@novo2/types-lib";
import { createRoomModel, RoomModel } from "./roomSchema";
import { getUserIdsByNames } from "../user/user.action";
import mongoose, { Types } from "mongoose";
import { check_ids } from "../../helpers/checkValid_id";

export const getRoomByUsers = async (clients: string[] | mongooseId[]) => {
    let usersIds: mongooseId[] = clients as mongooseId[]
    if (!check_ids(clients)) {
        usersIds = await getUserIdsByNames(clients as string[])
    }
    const room = await RoomModel.findOne({ users: { $all: usersIds } })
    if (!room) return (await createRoomModel({ users: usersIds }).save())._id
    // if (!room) th    row Error(JSON.stringify({message: "Room not found", status: 404}))
    return room._id
}

export const getUsersByRoomId = async(roomId: string) => {
    const room = await RoomModel.findOne({ _id: roomId })
    return room.users
}
