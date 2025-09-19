export declare class Lock {
    private concurrency;
    private promiseList;
    private resolveList;
    constructor(concurrency?: number);
    setConcurrency(concurrency: number): void;
    getConcurrency(): number;
    createPromiseAndResolve(): void;
    getPromise(): Promise<any> | undefined;
    getResolve(): ((value: unknown) => void) | undefined;
    acquire(): Promise<void>;
    release(): void;
}
