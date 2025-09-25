import { CoroutineWait, CoroutineWStart } from "../src"
import type { ITaskData, Task } from "../src"

describe('CoroutineWStart', () => {

    test('start', (done) => {

        const taskDataList: Pick<ITaskData<any, any>, "taskFunction" | "params" | "tag">[] = [
            {
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a + b), 1000)),
                params: [1, 2] as [number, number],
                tag: 'add'
            },
            {
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a - b), 5000)),
                params: [3, 4] as [number, number],
                tag: 'sub'
            },
            {
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a * b), 2000)),
                params: [5, 6] as [number, number],
                tag: 'mul'
            },
            {
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a / b), 3000)),
                params: [7, 8] as [number, number],
                tag: 'div'
            },
            {
                taskFunction: (): Promise<string> => new Promise((resolve, reject) => setTimeout(() => reject(new Error("测试异常")), 4000)),
                params: [],
                tag: 'error'
            }
        ]

        const startTime = Date.now()

        let i = 0

        const idMap = [
            { id: 0, time: 1000 },
            { id: 2, time: 3000 },
            { id: 1, time: 5000 },
            { id: 3, time: 6000 },
            { id: 4, time: 9000 },
        ]

        const pool = new CoroutineWStart(2)
        pool.start((task) => {
            const endTime = Date.now() - startTime
            expect(task.id).toBe(idMap[i].id)
            expect(endTime).toBeGreaterThanOrEqual(idMap[i].time)
            expect(endTime).toBeLessThan(idMap[i].time + 200)
            i++

            if (i === taskDataList.length) {
                const endTime = Date.now() - startTime
                console.log('任务完成，耗时：', endTime)
                expect(endTime).toBeGreaterThanOrEqual(9000)
                expect(endTime).toBeLessThan(10000)
                done()
            }
        })


        for (const taskData of taskDataList as ITaskData[]) pool.append(taskData.taskFunction, taskData.params, taskData.tag)



    }, 1000 * 15)


    test('stop', (done) => {

        const taskDataList: Pick<ITaskData<any, any>, "taskFunction" | "params" | "tag">[] = []

        for (let i = 0; i < 6; i++) {
            taskDataList.push({
                taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a + b), 1000)),
                params: [i, i] as [number, number],
                tag: 'add'
            })
        }


        let i = 0
        const callback = (task: Task<any, any>) => {
            const endTime = Date.now() - startTime
            expect(task.id).toBe(i)
            i++
            if (i === taskDataList.length) {
                console.log('任务完成，耗时：', endTime)
                expect(endTime).toBeGreaterThanOrEqual(5000)
                expect(endTime).toBeLessThan(5200)
                done()
            }
        }

        const startTime = Date.now()

        const pool = new CoroutineWStart(2)
        for (const taskData of taskDataList as ITaskData[]) pool.append(taskData.taskFunction, taskData.params, taskData.tag)


        pool.start(callback)

        setTimeout(() => {
            pool.stop((tasks) => {
                expect(tasks.length).toBe(2)
                expect(tasks[0].id).toBe(2)
                expect(tasks[1].id).toBe(3)
            })
        }, 1500)

        setTimeout(() => {
            pool.start(callback)
        }, 4000)



    }, 1000 * 15)

});

