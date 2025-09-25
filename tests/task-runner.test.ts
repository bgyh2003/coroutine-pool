import { TaskQueue, TaskRunner, Task } from "../src"
import type { ITaskData } from "../src"

describe('TaskRunner', () => {
    
    test('all', (done) => {

        const taskDataList: ITaskData<any, any>[] = [
            {
                id: 0,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a + b), 1000)),
                params: [1, 2] as [number, number],
                tag: 'add'
            },
            {
                id: 1,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a - b), 1000)),
                params: [3, 4] as [number, number],
                tag: 'sub'
            },
            {
                id: 2,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a * b), 1000)),
                params: [5, 6] as [number, number],
                tag: 'mul'
            },
            {
                id: 3,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a / b), 2000)),
                params: [7, 8] as [number, number],
                tag: 'div'
            },
            {
                id: 4,
                taskFunction: (a: string, b: string): Promise<string> => new Promise(resolve => setTimeout(() => resolve(a + b), 2000)),
                params: ["hello", "world"] as [string, string],
                tag: 'concat'
            },
            {
                id: 5,
                taskFunction: (): Promise<string> => new Promise((resolve, reject) => setTimeout(() => reject(new Error("测试异常")), 2000)),
                params: [],
                tag: 'error'
            }
        ]

        const taskQueue = new TaskQueue()
        for (const taskData of taskDataList as ITaskData[]) taskQueue.add(new Task(taskData))

        const taskRunner = new TaskRunner(taskQueue, 3)

        const startTime = Date.now()
        taskRunner.setAllCompletedCallback(() => {
            const endTime = Date.now()

            console.log('任务完成，耗时：', endTime - startTime)
            expect(endTime - startTime).toBeGreaterThanOrEqual(3000)
            expect(endTime - startTime).toBeLessThan(4000)

            done()
        })

        taskRunner.run()

    }, 1000 * 5)


    test('every', (done) => {

        const taskDataList: ITaskData<any, any>[] = [
            {
                id: 0,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a + b), 1000)),
                params: [1, 2] as [number, number],
                tag: 'add'
            },
            {
                id: 1,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a - b), 5000)),
                params: [3, 4] as [number, number],
                tag: 'sub'
            },
            {
                id: 2,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a * b), 2000)),
                params: [5, 6] as [number, number],
                tag: 'mul'
            },
            {
                id: 3,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a / b), 3000)),
                params: [7, 8] as [number, number],
                tag: 'div'
            },
            {
                id: 4,
                taskFunction: (): Promise<string> => new Promise((resolve, reject) => setTimeout(() => reject(new Error("测试异常")), 4000)),
                params: [],
                tag: 'error'
            }
        ]

        const taskQueue = new TaskQueue()
        for (const taskData of taskDataList as ITaskData[]) taskQueue.add(new Task(taskData))

        const taskRunner = new TaskRunner(taskQueue, 2)

        const startTime = Date.now()

        let i = 0
        const idMap = [
            { id: 0, time: 1000 },
            { id: 2, time: 3000 },
            { id: 1, time: 5000 },
            { id: 3, time: 6000 },
            { id: 4, time: 9000 },
        ]

        taskRunner.setTaskCompletedCallback((task) => {
            const endTime = Date.now() - startTime
            expect(task.id).toBe(idMap[i].id)
            expect(endTime).toBeGreaterThanOrEqual(idMap[i].time)
            expect(endTime).toBeLessThan(idMap[i].time + 200)
            i++
        })

        taskRunner.setAllCompletedCallback(() => {
            const endTime = Date.now()

            console.log('任务完成，耗时：', endTime - startTime)
            expect(endTime - startTime).toBeGreaterThanOrEqual(9000)
            expect(endTime - startTime).toBeLessThan(10000)

            done()
        })

        taskRunner.run()

    }, 1000 * 15)


    test('stop', (done) => {

        const taskDataList: ITaskData<any, any>[] = [
            {
                id: 0,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a + b), 1000)),
                params: [1, 2] as [number, number],
                tag: 'add'
            },
            {
                id: 1,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a - b), 5000)),
                params: [3, 4] as [number, number],
                tag: 'sub'
            },
            {
                id: 2,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a * b), 2000)),
                params: [5, 6] as [number, number],
                tag: 'mul'
            },
            {
                id: 3,
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a / b), 3000)),
                params: [7, 8] as [number, number],
                tag: 'div'
            },
            {
                id: 4,
                taskFunction: (): Promise<string> => new Promise((resolve, reject) => setTimeout(() => reject(new Error("测试异常")), 4000)),
                params: [],
                tag: 'error'
            }
        ]

        const taskQueue = new TaskQueue()
        for (const taskData of taskDataList as ITaskData[]) taskQueue.add(new Task(taskData))

        const taskRunner = new TaskRunner(taskQueue, 2)

        const startTime = Date.now()

        const res: number[] = []

        taskRunner.setTaskCompletedCallback((task) => res.push(task.id))

        taskRunner.setAllCompletedCallback(() => { throw new Error("测试异常") })

        taskRunner.run()

        setTimeout(() => {
            taskRunner.stop((tasks) => {
                expect(tasks.length).toBe(2)
            }).then(() => {

                expect(res).toEqual([0, 2, 1])

                const endTime = Date.now()

                console.log('手动结束，耗时：', endTime - startTime)
                expect(endTime - startTime).toBeGreaterThanOrEqual(5000)
                expect(endTime - startTime).toBeLessThan(5200)

                done()
            })
        }, 1500)

    }, 1000 * 15)

});

