import mongoose, { Schema, Types } from "mongoose";
import { IMessages, IUnreadMessages, mongooseId } from "@novo2/types-lib"

const notReadSchema = new Schema<IUnreadMessages<mongooseId>>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  messageId: { type: mongoose.Schema.Types.ObjectId,  ref: 'Message' },
  read: { type: Boolean, required: true, default: true }
});

export const NotReadModel = mongoose.model<IUnreadMessages<mongooseId>>('UnreadMessage', notReadSchema)

export const createNotReadModel = (data: Partial<IUnreadMessages<string>>) => {
  const id = { _id: new Types.ObjectId() }
  return new NotReadModel({ ...data, ...id })
}