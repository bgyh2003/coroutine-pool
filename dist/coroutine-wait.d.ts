import { Task, TaskQueue } from "./index";
import CoroutineAbstract from "./coroutine-abstract";
export declare class CoroutineWait<TParams extends any[] = any[], TResult = any> extends CoroutineAbstract<TParams, TResult> {
    constructor(concurrency?: number);
    wait(fn?: ((task: Task<TParams, TResult>) => void) | null): Promise<TaskQueue<TParams, TResult>>;
}
