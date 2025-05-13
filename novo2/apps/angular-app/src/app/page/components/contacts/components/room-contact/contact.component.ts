import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { IContactsWithUnreadMsg, IUser, liveConnections } from "@novo2/types-lib";
import { MenuComponent } from "apps/angular-app/src/app/components/menu/menu.component";

@Component({
    selector: 'app-single-contact-room',
    imports: [CommonModule, MenuComponent, MatMenuModule],
    providers: [],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.sass',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContactComponentRoom {
    @Input() user!: liveConnections<string>
    @Input() roomtType!: "room" | "contact"
    @Input() clickHandler!: (roomType: "room" | "contact", user: IUser<string>) => any
    protected previousUnreadCount!: number;
    private altered = false;
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes, "chengess")
        if ('user' in changes) {
            if (!changes["user"].firstChange) {
                this.altered = true;
            }
            const len = changes["user"].currentValue.newMessage?.length ?? 0;
            if (len > 0) {
                this.previousUnreadCount = len;
            }
        }
    }

    get shouldFade(): boolean {
        return this.user.newMessage?.length === 0 && this.altered;
    }

    get shouldHideInitially(): boolean {
        return this.user.newMessage?.length === 0 && !this.altered
    }
}