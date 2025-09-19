import { TaskQueue } from "./task-queue";
import { Task } from "./task";
export declare class TaskRunner<TParams extends any[] = any[], TResult = any> {
    taskQueue: TaskQueue<TParams, TResult>;
    concurrency: number;
    isStopped: boolean;
    stopReslove: (() => void) | null;
    pool: Task<TParams, TResult>[];
    taskCompletedCallback: (task: Task<TParams, TResult>) => void;
    allCompletedCallback: () => void;
    constructor(taskQueue?: TaskQueue<TParams, TResult>, concurrency?: number);
    setConcurrency(concurrency: number): void;
    setTaskCompletedCallback(callback: (task: Task<TParams, TResult>) => void): void;
    setAllCompletedCallback(callback: () => void): void;
    run(): void;
    stop(callback?: (tasks: Task<TParams, TResult>[]) => void): Promise<void>;
}
