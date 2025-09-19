import { Task, TaskQueue, TaskRunner } from "./index"
import { ITaskData } from "./types"

export default abstract class CoroutineAbstract<
    TParams extends any[] = any[],
    TResult = any
> {

    taskQueue: TaskQueue<TParams, TResult>
    taskRunner: TaskRunner<TParams, TResult>
    taskId: number = 0

    constructor(
        public concurrency: number = 1
    ) {
        this.taskQueue = new TaskQueue()
        this.taskRunner = new TaskRunner(this.taskQueue, this.concurrency)
    }

    setConcurrency(concurrency: number) {
        this.concurrency = concurrency
        this.taskRunner.setConcurrency(concurrency)
    }

    add(
        taskFunction: ITaskData<TParams, TResult>["taskFunction"],
        params: ITaskData<TParams, TResult>["params"],
        tag: ITaskData<TParams, TResult>["tag"] = "default",

    ) {
        const task = new Task<TParams, TResult>({ id: this.taskId++, tag, params, taskFunction })
        this.taskQueue.add(task)
        return task
    }

}