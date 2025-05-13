import { mongooseId } from "@novo2/types-lib"
import { ObjectId } from "mongodb"

export const check_ids = (ids: any[]) => {
    return ids.every(id => new ObjectId(id) == id
    )
}