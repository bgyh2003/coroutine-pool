
import type { ITaskData, ITaskFunction } from "./types"

export class Task<
    TParams extends any[] = any[],
    TResult = any
> {

    id: number
    tag: string | null
    params: TParams
    taskFunction: ITaskFunction<TParams, TResult>

    result: TResult | null = null
    error: Error | null = null
    isCompleted: boolean = false
    isRunning: boolean = false
    time: number = 0

    completeCallback: (task: Task<TParams, TResult>) => void = () => { }

    constructor(taskData: ITaskData<TParams, TResult>) {
        this.id = taskData.id
        this.tag = taskData.tag
        this.params = taskData.params
        this.taskFunction = taskData.taskFunction
    }

    async run() {

        const start = Date.now()
        try {
            this.isRunning = true
            this.result = await this.taskFunction(...this.params)
        } catch (error) {
            this.error = error as Error
        } finally {
            this.isRunning = false
            this.isCompleted = true
            this.time = Date.now() - start
            this.completeCallback(this)
        }

    }

    onComplete(callback: (task: Task<TParams, TResult>) => void) {
        this.completeCallback = callback
    }
}


