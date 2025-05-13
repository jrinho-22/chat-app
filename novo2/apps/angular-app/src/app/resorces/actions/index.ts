import { IContactsWithUnreadMsg, IUserWithContacts, liveConnections } from "@novo2/types-lib";
import { combineLatestWith, exhaustMap, first, Observable, OperatorFunction, pipe, switchMap, tap, UnaryFunction } from "rxjs"
import { getAppInjector } from "../../app-injector";
import { UserModel } from "../../page/model/user.service";
import { WebsocketService } from "../../services/websocket/websocket.service";
import { loadingHttpContext } from "../../helpers/HttpContext";
import { ChatModel } from "../../page/model/chat.service";

export type OperatorOutput<T> = T extends () => OperatorFunction<any, infer R> ? R : never;
export type actionsType = {
    // OperatorFunction<Obs of type T, into Obs type R>
    chatReload: {
        label: "CHAT_RELOAD",
        opt: () => OperatorFunction<void, [IContactsWithUnreadMsg<string>[], liveConnections<string>[]]>
    },
    // chatReload2: {
    //     label: "CHAT_RELOAD2",
    //     opt: () => OperatorFunction<void, [IUserWithContacts<string>, liveConnections<string>[]]>
    // }
}

const chatReloadOpt = (): ReturnType<actionsType["chatReload"]["opt"]> => {
    const appInjector = getAppInjector()
    const wsService = appInjector.get(WebsocketService);
    const UserModelService = appInjector.get(UserModel);
    const MeassageModelService = appInjector.get(ChatModel);

    return pipe(
        exhaustMap(() =>
            wsService.user$.pipe(first(Boolean))
        ),
        switchMap((user) =>
            UserModelService.getItem<IContactsWithUnreadMsg<string>[]>(`contact/${user?._id}`, {
                context: loadingHttpContext(
                    ["contact-group-loader", "room-group-loader"], "wave", 3
                )
            })
        ),
        combineLatestWith(wsService.listenLiveConnections())
    );
}

const actions: actionsType = {
    chatReload: { label: "CHAT_RELOAD", opt: chatReloadOpt },
    // chatReload2: { label: "CHAT_RELOAD2", opt: chatReloadOpt }
}

export { actions } 