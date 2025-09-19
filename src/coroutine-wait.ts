import { Task, TaskQueue, TaskRunner } from "./index"
import CoroutineAbstract from "./coroutine-abstract"


export class CoroutineWait<
    TParams extends any[] = any[],
    TResult = any
> extends CoroutineAbstract<TParams, TResult> {

    constructor(concurrency: number = 1) {
        super(concurrency)
    }

    wait(fn: ((task: Task<TParams, TResult>) => void) | null = null) {
        return new Promise<TaskQueue<TParams, TResult>>((resolve) => {
            this.taskRunner.setTaskCompletedCallback((task) => typeof (fn) === "function" && fn(task))
            this.taskRunner.setAllCompletedCallback(() => resolve(this.taskQueue))
            this.taskRunner.run()
        })
    }
}