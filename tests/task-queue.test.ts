import { TaskQueue, Task } from "../src"
import { ITaskData } from "../src/types"

const taskDataList: ITaskData<any, any>[] = [
    {
        id: 0,
        taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a + b), 1000)),
        params: [1, 2] as [number, number],
        tag: 'add'
    },
    {
        id: 1,
        taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a - b), 1500)),
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
        taskFunction: (a: number, b: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(a / b), 2500)),
        params: [7, 8] as [number, number],
        tag: 'div'
    },
    {
        id: 4,
        taskFunction: (a: string, b: string): Promise<string> => new Promise(resolve => setTimeout(() => resolve(a + b), 3000)),
        params: ["hello", "world"] as [string, string],
        tag: 'concat'
    },
    {
        id: 5,
        taskFunction: (): Promise<string> => new Promise((resolve, reject) => setTimeout(() => reject(new Error("测试异常")), 3500)),
        params: [],
        tag: 'error'
    }
]


describe('TaskQueue', () => {
    test('create', () => {

        const taskPool = new TaskQueue()
        const task = taskPool.create(taskDataList[0])

        expect(task.id).toBe(0)
        expect(task.tag).toBe(taskDataList[0].tag)
        expect(task.params).toEqual(taskDataList[0].params)
        expect(task.taskFunction).toEqual(taskDataList[0].taskFunction)
        expect(taskPool.tasks.length).toBe(1)
        expect(taskPool.tasks[0]).toEqual(task)

        taskPool.remove(task)
        expect(taskPool.tasks.length).toBe(0)

    })

    test('add', () => {

        const taskPool = new TaskQueue()
        for (const taskData of taskDataList as ITaskData[]) taskPool.add(new Task(taskData))

        expect(taskPool.tasks.length).toBe(taskDataList.length)

        for (let i = 0; i < taskPool.tasks.length; i++) {
            const task = taskPool.tasks[i]
            expect(task.id).toBe(i)
            expect(task.tag).toBe(taskDataList[i].tag)
            expect(task.params).toEqual(taskDataList[i].params)
            expect(task.taskFunction).toEqual(taskDataList[i].taskFunction)
        }

    })

    test('pop', () => {

        const taskPool = new TaskQueue()
        for (const taskData of taskDataList as ITaskData[]) taskPool.add(new Task(taskData))

        taskPool.pop()
        expect(taskPool.tasks.length).toBe(taskDataList.length - 1)

        for (let i = 0; i < taskPool.tasks.length; i++) {
            const task = taskPool.tasks[i]
            expect(task.id).toBe(i + 1)
            expect(task.tag).toBe(taskDataList[i + 1].tag)
            expect(task.params).toEqual(taskDataList[i + 1].params)
            expect(task.taskFunction).toEqual(taskDataList[i + 1].taskFunction)
        }

        taskPool.clear()
        expect(taskPool.pop()).toBeNull()

        expect(taskPool.tasks.length).toBe(0)

    })

    test('remove', () => {

        const taskPool = new TaskQueue()
        for (const taskData of taskDataList as ITaskData[]) taskPool.add(new Task(taskData))
        expect(taskPool.tasks.length).toBe(taskDataList.length)

        taskPool.remove(taskPool.tasks[0])
        expect(taskPool.tasks.length).toBe(taskDataList.length - 1)
        expect(taskPool.tasks.find(t => t.id === 0)).toBeUndefined()

        taskPool.removeById(1)
        expect(taskPool.tasks.length).toBe(taskDataList.length - 2)
        expect(taskPool.tasks.find(t => t.id === 1)).toBeUndefined()

        taskPool.removeByTag('concat')
        expect(taskPool.tasks.length).toBe(taskDataList.length - 3)
        expect(taskPool.tasks.find(t => t.tag === 'concat')).toBeUndefined()

        taskPool.clear()
        expect(taskPool.tasks.length).toBe(0)

    })

});



