import { Request, Response } from "express"

export const defaultError = (res: Response, message?: string) => {
    res.status(500).json({
        error: "An error occurred while retrieving the room.",
        message: message || "Unknown error"
    });
}

export const customErro = (error: any, res: Response) => {
    const errorObj: { message: string, status: number } = JSON.parse(error.message)
    if (typeof errorObj == 'object') {
        res.status(errorObj.status).json({
            error: "An error occurred while retrieving the room.",
            message: errorObj.message || "Unknown error"
        });
    }
}