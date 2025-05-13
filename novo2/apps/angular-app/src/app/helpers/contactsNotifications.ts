import { IContactsWithUnreadMsg, IMessagesReceived, liveConnections } from "@novo2/types-lib";
import { getAppInjector } from "../app-injector";
import { SubjectService } from "../services/subjects.service";

export const changeNotification = (senderId: string, roomType: "room" | "contact", actionType: "add" | "erase", messageReceived?: IMessagesReceived) => {
    const appInjector = getAppInjector()
    const subjectService = appInjector.get(SubjectService);

    let currentContacts = roomType == "contact"
        ? subjectService.UserContactValueCopy
        : subjectService.roomContactsValueCopy

    if (currentContacts) {
        currentContacts.forEach(contact => {
            const contactId = "user" in contact
                ? contact.user._id
                : contact._id

            if (contactId == senderId) {
                if (roomType == "contact") {
                    let contactRetyped = contact as IContactsWithUnreadMsg<string>
                    if (actionType == "add") contactRetyped.unreadmessages.push(messageReceived!)
                    if (actionType == "erase") contactRetyped.unreadmessages = []
                    subjectService.userContactsSubject.next(currentContacts as IContactsWithUnreadMsg<string>[])
                } else {
                    let contactRetyped = contact as liveConnections<string>
                    if (actionType == "add") {
                        contactRetyped.newMessage?.push("message")
                    }
                    if (actionType == "erase") contactRetyped.newMessage = []
                    subjectService.roomContactsSubject.next(currentContacts as liveConnections<string>[])
                }
            }
        })
    }
}