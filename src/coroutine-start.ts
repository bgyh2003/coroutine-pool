import { Task, TaskQueue, TaskRunner } from "./index"
import { ITaskData } from "./types"

import CoroutineAbstract from "./coroutine-abstract"


export class CoroutineWStart<
    TParams extends any[] = any[],
    TResult = any
> extends CoroutineAbstract<TParams, TResult> {

    status: "stop" | "running" = "stop"

    constructor(concurrency: number = 1) {
        super(concurrency)
    }

    append(
        taskFunction: ITaskData<TParams, TResult>["taskFunction"],
        params: ITaskData<TParams, TResult>["params"],
        tag: ITaskData<TParams, TResult>["tag"] = "default"
    ) {
        const task = this.add(taskFunction, params, tag)
        this.status === "running" && this.taskRunner.run()
        return task
    }

    start(fn: ((task: Task<TParams, TResult>) => void) | null = null) {
        this.status = "running"
        this.taskRunner.setTaskCompletedCallback((task) => typeof (fn) === "function" && fn(task))
        this.taskRunner.run()
    }

    stop(callback?: (tasks: Task<TParams, TResult>[]) => void) {
        this.status = "stop"
        return this.taskRunner.stop(callback)
    }

}