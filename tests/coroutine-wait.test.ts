import { CoroutineWait, CoroutineWStart } from "../src"
import type { ITaskData } from "../src"


describe('CoroutineWait', () => {

    test('wait', async () => {

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

        const pool = new CoroutineWait(2)
        for (const taskData of taskDataList as ITaskData[]) pool.add(taskData.taskFunction, taskData.params, taskData.tag)

        const startTime = Date.now()

        let i = 0

        const idMap = [
            { id: 0, time: 1000 },
            { id: 2, time: 3000 },
            { id: 1, time: 5000 },
            { id: 3, time: 6000 },
            { id: 4, time: 9000 },
        ]

        await pool.wait((task) => {
            const endTime = Date.now() - startTime
            expect(task.id).toBe(idMap[i].id)
            expect(endTime).toBeGreaterThanOrEqual(idMap[i].time)
            expect(endTime).toBeLessThan(idMap[i].time + 200)
            i++
        })

        const endTime = Date.now()

        console.log('任务完成，耗时：', endTime - startTime)
        expect(endTime - startTime).toBeGreaterThanOrEqual(9000)
        expect(endTime - startTime).toBeLessThan(10000)

    }, 1000 * 15)

});

