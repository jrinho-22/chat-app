import { IMessages, IUser, IUserDTO, mongooseId } from "@novo2/types-lib";
import { createUserModel, UserModel } from "./userSchema";

export const saveUser = (user: IUserDTO) => {
    return createUserModel(user).save()
}

export const getUser = (userName: string) => {
    return UserModel.find({name: userName})
}

export const getUserIdsByNames = async(names: string[]): Promise<mongooseId[]> => {
        const users = await UserModel.find({name: names})
        return users.map(user => user._id)
}

export const loginUser = async(userName: string, avatar: string) => {
    const user = await UserModel.findOne({name: userName})
    if (user) return user
    return saveUser({name: userName, avatar: avatar})
}

export const checkRoomType = async(senderId: mongooseId, receiverId: mongooseId) => {
    let roomType = ""
    const receiverUser = await UserModel.findById(receiverId)
    if (receiverUser) {
        const conatctfound = receiverUser.contacts.find(id => String(id) == String(senderId))
        if (conatctfound) {
            roomType = "contact"
        } else {
            roomType = "room"
        }
    } 
    return roomType
}

