import { Request, Response } from "express"
import instance from "../../server/server"
import http from 'http'
import * as core from "express-serve-static-core";
import { apiInterface } from "../../interfaces/api"
import { loadMessages } from "./message.action"
import { IMessages, mongooseId } from "@novo2/types-lib"
import { createMessageModel } from "./messagesSchema"

export const messageController: apiInterface[] = [
    {
        mathod: "post",
        path: "/message",
        callback: (req: Request, res: Response) => {
            const bodyPayload: Omit<IMessages<string>, "_id"> = req.body;
            createMessageModel(bodyPayload).save()
            res.send(bodyPayload)
        }
    },
    {
        mathod: "get",
        path: "/messages/:roomId",
        callback: async (req: Request<{roomId: mongooseId}>, res: Response) => {
            const body: { roomId: mongooseId } = req.params.roomId && req.params
            try {
                const messages = await loadMessages(body.roomId)
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