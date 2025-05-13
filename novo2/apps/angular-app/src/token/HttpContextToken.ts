import { HttpContextToken } from "@angular/common/http";

export type configType = {elId: string, loadingType: "wave" | "spinner", waveItems: number }
const loadingConfigObj: configType = {elId: '', loadingType: "spinner" , waveItems: 0 }

export const loadingConfig = new HttpContextToken<configType[]>(() => [loadingConfigObj]);
export const loading = new HttpContextToken<boolean>(() => false);