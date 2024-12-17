// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function suppressErrors<T extends (...args: any[]) => any>(method: T, description: string): (...p: Parameters<T>) => ReturnType<T> {
    return (...params: Parameters<T>) => {
        try {return method(...params);}
        catch (e) {BdApi.Logger.error("Suppression", "Error occurred in " + description, e);}
    };
}