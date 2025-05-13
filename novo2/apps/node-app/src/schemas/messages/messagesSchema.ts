import mongoose, { Schema, Types } from "mongoose";
import { IMessages, mongooseId } from "@novo2/types-lib"

const messagesSchema = new Schema<IMessages<mongooseId>>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId },
  created: { type: Date, required: true },
  content: { type: String, required: true },
});

export const MessagesModel = mongoose.model<IMessages<mongooseId>>('Message', messagesSchema)

export const createMessageModel = (data: Partial<IMessages<string>>) => {
  const id = { _id: new Types.ObjectId() }
  return new MessagesModel({ ...data, ...id })
}