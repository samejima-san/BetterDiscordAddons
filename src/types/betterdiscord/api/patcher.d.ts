/* eslint-disable @typescript-eslint/no-explicit-any */

import {Cancel} from "./common";

type AnyFunc = (...args: any) => any;

export type BeforeCallback<T extends AnyFunc> = (thisObject: ThisParameterType<T>, methodArguments: Parameters<T>) => unknown;
export type AfterCallback<T extends AnyFunc> = (thisObject: ThisParameterType<T>, methodArguments: Parameters<T>, returnValue: ReturnType<T>) => unknown;
export type InsteadCallback<T extends AnyFunc> = (thisObject: ThisParameterType<T>, methodArguments: Parameters<T>, originalFunction: T) => unknown;

export interface Patcher {
    before<T, K extends keyof T>(caller: string, moduleToPatch: T, functionName: K, callback: BeforeCallback<T[K] | any>): Cancel;
    after<T, K extends keyof T>(caller: string, moduleToPatch: T, functionName: K, callback: AfterCallback<T[K] | any>): Cancel;
    instead<T, K extends keyof T>(caller: string, moduleToPatch: T, functionName: K, callback: InsteadCallback<T[K] | any>): Cancel;
    unpatchAll(caller: string): void;
}