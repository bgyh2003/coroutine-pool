import type { ITaskData } from "./types"
import { Task } from "./task"


export class TaskQueue<
    TParams extends any[] = any[],
    TResult = any
> {
    constructor(
        public tasks: Task<TParams, TResult>[] = []
    ) { }

    create(taskData: ITaskData<TParams, TResult>) {
        const task = new Task(taskData)
        this.tasks.push(task)
        return task
    }

    add(task: Task<TParams, TResult>) { 
        this.tasks.push(task)
    }

    pop() {
        return this.tasks.shift() || null
    }

    removeById(id: number) {
        this.tasks = this.tasks.filter(task => task.id !== id)
    }

    removeByTag(tag: string) {
        this.tasks = this.tasks.filter(task => task.tag !== tag)
    }

    remove(task: Task<TParams, TResult>) {
        this.tasks = this.tasks.filter(t => t !== task)
    }

    clear() {
        this.tasks = []
    }

}