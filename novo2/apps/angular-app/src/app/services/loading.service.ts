import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { configType } from "../../token/HttpContextToken";

@Injectable({
    providedIn: "root",
})
export class LoadingService {
    private _displayValue = ""

    loadingOn(loadingConfigContext: configType[]) {
        loadingConfigContext.map(v => {
            const element = document.getElementById(v.elId);
            if (element) {
                this.modifyElementStyle(element)
                const container = this.createLoaderWrapper(element.parentNode!, element)
                for (let index = 0; index < v.waveItems; index++) {
                    this.addLoaderItems(container)
                }
            }
        })
    }

    modifyElementStyle(el: HTMLElement) {
        this._displayValue = el.style.display
        el.style.display = "none"
    }

    createLoaderWrapper(parentNode: ParentNode, sibling: HTMLElement) {
        const loader = document.createElement('div');
        loader.classList.add("wave-container")
        parentNode.insertBefore(loader, sibling)

        return loader
    }

    addLoaderItems(loader: HTMLElement) {
        const loaderItem = document.createElement('div');
        loaderItem.classList.add('wave');
        loader.appendChild(loaderItem)
    }

    loadingOff(loadingConfigContext: configType[]) {
        document.querySelectorAll('.wave-container').forEach(el => el.remove());
        loadingConfigContext.map(v => {
            const element = document.getElementById(v.elId);
            if (element) {
                element.style.display = this._displayValue
            }
        })
    }
}