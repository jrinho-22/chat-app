import { Request, Response } from "express"

export interface apiInterface<> {
    mathod: "get" | "post" | "put",
    path: string
    callback: (req: Request<any, any, any>, res: Response) => any
}