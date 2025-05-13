import { Request, Response } from "express"
import { apiInterface } from "../../interfaces/api"
import { loadMessages } from "../messages/message.action"
import { customErro, defaultError } from "../../helpers/errorHandler"
import { mongooseId, roomRequest } from "@novo2/types-lib"
import { lookUpResult, UserModel } from "./userSchema"

export const userController: apiInterface[] = [
    {
        mathod: "put",
        path: "/user/add-contact/:userId",
        callback: async (req: Request<{ userId: string }, any, { newContact: string }>, res: Response) => {
            const body = req.body?.newContact && req.body
            const userId = req.params.userId && req.params
            try {
                const user = await UserModel.findById(userId.userId)
                const contact = await UserModel.findOne({ name: body.newContact })
                if (user && contact) {
                    const contactExists = user.contacts.includes(contact._id);

                    if (!contactExists) {
                        user.contacts.push(contact._id);
                        await user.save();
                    }
                }
                res.send(user)
            } catch (originalError) {
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
        path: "/user/name/:name",
        callback: async (req: Request<{ name: string }>, res: Response) => {
            const userName = req.params.name && req.params
            try {
                const user = await UserModel.findOne({ name: userName.name })
                res.send(user)
            } catch (originalError) {
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
        path: "/user/contact/:userId",
        callback: async (req: Request<{ userId: string }>, res: Response) => {
            const userId = req.params.userId && req.params
            try {
                const user = await UserModel.findById(userId.userId)
                const look = await lookUpResult(user.contacts, user._id)
                res.send(look)
            } catch (originalError) {
                try {
                    customErro(originalError, res)
                } catch (error) {
                    defaultError(res, originalError.message)
                }
            }
        }
    }
]