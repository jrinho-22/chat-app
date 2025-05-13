import mongoose, { Schema, Types } from "mongoose";
import { IUser, IUserDTO, mongooseId } from "@novo2/types-lib"

const userSchema = new Schema<IUser<mongooseId>>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  contacts: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true },
  avatar: { type: String, required: true },
  name: { type: String, required: true },
});

export const UserModel = mongoose.model<IUser<mongooseId>>('User', userSchema)

export const createUserModel = (data: IUserDTO) => {
  const id = { _id: new Types.ObjectId() }
  return new UserModel({ ...data, ...id })
}
export const lookUpResult = async (contactIds: mongooseId[], currentUserId: mongooseId) => {
  return await UserModel.aggregate([
    {
      $match: {
        _id: { $in: contactIds }
      }
    },
    {
      $lookup: {
        from: 'unreadmessages',
        let: { contactId: '$_id' }, // this is the senderId in unreadmessages
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$senderId', '$$contactId'] },
                  { $eq: ['$userId', currentUserId] },
                  { $eq: ['$read', false] }
                ]
              }
            }
          },
          {
            $lookup: {
              from: 'messages',
              localField: 'messageId',
              foreignField: '_id',
              as: 'message'
            }
          },
          {
            $unwind: {
              path: '$message',
              preserveNullAndEmptyArrays: true
            }
          }
        ],
        as: 'unreadmessages'
      },
    },
    // {
    //   $lookup: {
    //     from: 'users',
    //     localField: 'contacts',
    //     foreignField: '_id',
    //     as: 'contacts'
    //   }
    // }
  ]);
};