import mongoose, { Schema, Types } from "mongoose";
import { IRoom } from "@novo2/types-lib"

const roomSchema = new Schema<IRoom>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  users: { type: [mongoose.Schema.Types.ObjectId], required: true },
});

export const RoomModel = mongoose.model<IRoom>('Room', roomSchema)

export const createRoomModel = (data: Partial<IRoom>) => {
  const id = { _id: new Types.ObjectId() }
  return new RoomModel({ ...data, ...id })
}