import { messageController } from "./schemas/messages/messages.controller"
import { roomController } from "./schemas/room/room.controller"
import { userController } from "./schemas/user/user.controller"

export default [
    ...messageController,
    ...roomController,
    ...userController
]