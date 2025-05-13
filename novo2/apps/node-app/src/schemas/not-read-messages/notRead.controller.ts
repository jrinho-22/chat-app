import { Request, Response } from "express"
import instance from "../../server/server"
import http from 'http'
import * as core from "express-serve-static-core";
import { apiInterface } from "../../interfaces/api"
import { IMessages, mongooseId } from "@novo2/types-lib"
import { loadUnreadMessages } from "./notRead.action";

export const messageController: apiInterface[] = [
    // {
    //     mathod: "post",
    //     path: "/message",
    //     callback: (req: Request, res: Response) => {
    //         const bodyPayload: Omit<IMessages<string>, "_id"> = req.body;
    //         createMessageModel(bodyPayload).save()
    //         res.send(bodyPayload)
    //     }
    // },
    {
        mathod: "get",
        path: "/messages/unread/:userId",
        callback: async (req: Request<{userId: mongooseId}>, res: Response) => {
            const body: { userId: mongooseId } = req.params.userId && req.params
            try {
                const messages = await loadUnreadMessages(body.userId)
                res.send(messages)
            } catch (error) {
                res.status(500).json({
                    error: "An error occurred while retrieving the messages.",
                    message: error.message || "Unknown error"
                });
            }
        }
    }
]