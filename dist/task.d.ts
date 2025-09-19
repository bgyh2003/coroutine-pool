import type { ITaskData, ITaskFunction } from "./types";
export declare class Task<TParams extends any[] = any[], TResult = any> {
    id: number;
    tag: string | null;
    params: TParams;
    taskFunction: ITaskFunction<TParams, TResult>;
    result: TResult | null;
    error: Error | null;
    isCompleted: boolean;
    isRunning: boolean;
    time: number;
    completeCallback: (task: Task<TParams, TResult>) => void;
    constructor(taskData: ITaskData<TParams, TResult>);
    run(): Promise<void>;
    onComplete(callback: (task: Task<TParams, TResult>) => void): void;
}
