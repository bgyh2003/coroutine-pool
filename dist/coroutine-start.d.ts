import { Task } from "./index";
import { ITaskData } from "./types";
import CoroutineAbstract from "./coroutine-abstract";
export declare class CoroutineWStart<TParams extends any[] = any[], TResult = any> extends CoroutineAbstract<TParams, TResult> {
    status: "stop" | "running";
    constructor(concurrency?: number);
    append(taskFunction: ITaskData<TParams, TResult>["taskFunction"], params: ITaskData<TParams, TResult>["params"], tag?: ITaskData<TParams, TResult>["tag"]): Task<TParams, TResult>;
    start(fn?: ((task: Task<TParams, TResult>) => void) | null): void;
    stop(callback?: (tasks: Task<TParams, TResult>[]) => void): Promise<void>;
}
