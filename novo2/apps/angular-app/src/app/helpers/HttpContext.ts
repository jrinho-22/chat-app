import { HttpContext, HttpContextToken } from "@angular/common/http"
import { loading, loadingConfig } from "../../token/HttpContextToken"

export const loadingHttpContext = (ids: string[], type: "wave" | 'spinner', waveItems?: number) => {
    const loadingCongfigArg = () => {
        return ids.map(id => {
            return { elId: id, loadingType: type, waveItems: waveItems}
        })
    }
    
    return new HttpContext()
        .set(loading, true)
        .set(loadingConfig, loadingCongfigArg()
        )
}