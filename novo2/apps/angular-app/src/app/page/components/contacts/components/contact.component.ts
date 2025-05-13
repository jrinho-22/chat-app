import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { MenuComponent } from "../../../../components/menu/menu.component";
import { MatMenuModule } from "@angular/material/menu";
import { IContactsWithUnreadMsg, IUser } from "@novo2/types-lib";

@Component({
    selector: 'app-single-contact',
    imports: [CommonModule, MenuComponent, MatMenuModule],
    providers: [],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.sass',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContactComponent {
    @Input() user!: IContactsWithUnreadMsg<string>
    @Input() roomtType!: "room" | "contact"
    @Input() clickHandler!: (roomType: "room" | "contact", user: IUser<string>) => any
    protected previousUnreadCount!: number;
    private altered = false;
    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if ('user' in changes) {
            if (!changes["user"].firstChange) {
                this.altered = true;
            }
            const len = changes["user"].currentValue.unreadmessages?.length ?? 0;
            if (len > 0) {
                this.previousUnreadCount = len;
            }
        }
    }

    get shouldFade(): boolean {
        return this.user.unreadmessages.length === 0 && this.altered;
    }

    get shouldHideInitially(): boolean {
        return this.user.unreadmessages.length === 0 && !this.altered
    }
}