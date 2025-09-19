import { TaskQueue } from "./task-queue"
import { Task } from "./task"

export class TaskRunner<
    TParams extends any[] = any[],
    TResult = any
> {

    isStopped: boolean = false
    stopReslove: (() => void) | null = null

    pool: Task<TParams, TResult>[] = []

    taskCompletedCallback: (task: Task<TParams, TResult>) => void = () => { }

    allCompletedCallback: () => void = () => { }

    constructor(
        public taskQueue: TaskQueue<TParams, TResult> = new TaskQueue<TParams, TResult>(),
        public concurrency: number = 1
    ) { }

    setConcurrency(concurrency: number) {
        this.concurrency = concurrency
        this.run()
    }

    setTaskCompletedCallback(callback: (task: Task<TParams, TResult>) => void) {
        this.taskCompletedCallback = callback
    }

    setAllCompletedCallback(callback: () => void) {
        this.allCompletedCallback = callback
    }

    run() {

        this.isStopped = false

        while (this.pool.length < this.concurrency) {

            // 提取任务
            const task = this.taskQueue.pop()

            // 没有任务则结束
            if (!task) break

            // 放入任务运行池
            this.pool.push(task)

            // 监听任务完成
            task.onComplete((_task) => {

                // 当前任务完成回调
                this.taskCompletedCallback(_task)

                // 清除当前完成的任务
                this.pool = this.pool.filter(t => t !== _task)

                // 如果任务已停止，则结束
                if (this.isStopped) {

                    if (this.pool.length === 0) {
                        this.stopReslove && this.stopReslove()
                        this.stopReslove = null
                    }

                    return
                }

                // 如果任务队列还有任务，继续执行
                if (this.taskQueue.tasks.length > 0) this.run()

                // 如果任务队列没有任务，且运行池也没有任务了，说明所有任务都完成了
                else if (this.pool.length === 0) this.allCompletedCallback()

            })

            // 执行任务
            task.run()

        }
    }

    stop(callback?: (tasks: Task<TParams, TResult>[]) => void) {
        this.isStopped = true

        if (callback) callback(this.pool)

        return new Promise<void>(resolve => this.stopReslove = resolve)
    }

}
