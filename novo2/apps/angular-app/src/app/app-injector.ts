// app-injector.ts
import { Injector } from '@angular/core';

let appInjectorRef: Injector;

export function setAppInjector(injector: Injector) {
  appInjectorRef = injector;
}

export function getAppInjector(): Injector {
  return appInjectorRef;
}