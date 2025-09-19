import type { ITaskData } from "./types";
import { Task } from "./task";
export declare class TaskQueue<TParams extends any[] = any[], TResult = any> {
    tasks: Task<TParams, TResult>[];
    constructor(tasks?: Task<TParams, TResult>[]);
    create(taskData: ITaskData<TParams, TResult>): Task<TParams, TResult>;
    add(task: Task<TParams, TResult>): void;
    pop(): Task<TParams, TResult> | null;
    removeById(id: number): void;
    removeByTag(tag: string): void;
    remove(task: Task<TParams, TResult>): void;
    clear(): void;
}
