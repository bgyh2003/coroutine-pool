import { Task } from "../src"
import type { ITaskData } from "../src"

const taskDataList: ITaskData<any, any>[] = [
    {
        id: 0,
        taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a + b), 1000)),
        params: [1, 2] as [number, number],
        tag: 'add'
    },
    {
        id: 1,
        taskFunction: (): Promise<string> => new Promise((resolve, reject) => setTimeout(() => reject(new Error("测试异常")), 1000)),
        params: [],
        tag: 'error'
    }
]


test('Task.success', (done) => {

    const task = new Task(taskDataList[0] as any)

    task.onComplete((_task) => {
        expect(_task).toBe(task)
        expect(_task.isCompleted).toBe(true)
        expect(_task.result).toBe(3)
        expect(_task.error).toBe(null)
        expect(_task.time).toBeGreaterThanOrEqual(1000)
        expect(_task.isRunning).toBe(false)
        done()
    })

    expect(task.isCompleted).toBe(false)
    expect(task.isRunning).toBe(false)

    task.run()

    expect(task.isRunning).toBe(true)

})


test('Task.error', (done) => {

    const task = new Task(taskDataList[1] as any)

    task.onComplete((_task) => {
        expect(_task).toBe(task)
        expect(_task.isCompleted).toBe(true)
        expect(_task.result).toBe(null)
        expect(_task.error).not.toBe(null)
        expect(_task.error?.message).toBe("测试异常")
        expect(_task.time).toBeGreaterThanOrEqual(1000)
        expect(_task.isRunning).toBe(false)
        done()
    })

    expect(task.isCompleted).toBe(false)
    expect(task.isRunning).toBe(false)

    task.run()

    expect(task.isRunning).toBe(true)

}, 1000 * 10)


test('Task.types', async () => {

    const task = new Task<[number, number], number>({
        id: 201,
        tag: 'power',
        params: [2, 10],
        taskFunction: async (a: number, b: number): Promise<number> => {
            return a ** b
        }
    })

    await task.run()
    expect(task.id).toBe(201)
    expect(task.tag).toBe('power')
    expect(task.result).toBe(1024)
    expect(task.time).toBeGreaterThanOrEqual(0)
    expect(task.isCompleted).toBe(true)
    expect(task.error).toBe(null)

})
