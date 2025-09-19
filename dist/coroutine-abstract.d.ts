import { Task, TaskQueue, TaskRunner } from "./index";
import { ITaskData } from "./types";
export default abstract class CoroutineAbstract<TParams extends any[] = any[], TResult = any> {
    concurrency: number;
    taskQueue: TaskQueue<TParams, TResult>;
    taskRunner: TaskRunner<TParams, TResult>;
    taskId: number;
    constructor(concurrency?: number);
    setConcurrency(concurrency: number): void;
    add(taskFunction: ITaskData<TParams, TResult>["taskFunction"], params: ITaskData<TParams, TResult>["params"], tag?: ITaskData<TParams, TResult>["tag"]): Task<TParams, TResult>;
}
