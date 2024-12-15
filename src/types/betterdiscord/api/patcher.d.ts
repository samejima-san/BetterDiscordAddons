/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyFunc = (...args: any) => any;

export type BeforeCallback<T extends AnyFunc> = (thisObject: ThisParameterType<T>, methodArguments: Parameters<T>) => unknown;
export type AfterCallback<T extends AnyFunc> = (thisObject: ThisParameterType<T>, methodArguments: Parameters<T>, returnValue: ReturnType<T>) => unknown;
export type InsteadCallback<T extends AnyFunc> = (thisObject: ThisParameterType<T>, methodArguments: Parameters<T>, originalFunction: T) => unknown;

export interface Patcher {
    before<T, K extends keyof T>(caller: string, moduleToPatch: T, functionName: K, callback: BeforeCallback<T[K] | any>): void;
    after<T, K extends keyof T>(caller: string, moduleToPatch: T, functionName: K, callback: AfterCallback<T[K] | any>): void;
    instead<T, K extends keyof T>(caller: string, moduleToPatch: T, functionName: K, callback: InsteadCallback<T[K] | any>): void;
    unpatchAll(caller: string): void;
}