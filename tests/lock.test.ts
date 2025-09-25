import { Lock } from "../src"


describe('Lock', () => {
    test('lock', (done) => {

        const startTime = Date.now()

        const lock = new Lock()

        async function sleep(t: number = 1000) {
            await new Promise(resolve => setTimeout(resolve, t));
        }

        async function task(i: number, t: number = 1000) {

            await lock.acquire()
            await sleep(t)
            lock.release()
            const endTime = Date.now() - startTime
            expect(endTime).toBeGreaterThanOrEqual(1000 * i)
            return i
        }

        const tasks: Promise<number>[] = []
        for (let i = 1; i <= 10; i++) tasks.push(task(i))


        Promise.all(tasks).then(results => {

            const endTime = Date.now() - startTime

            console.log('用时:', endTime)

            expect(endTime).toBeGreaterThanOrEqual(1000 * 10)
            expect(endTime).toBeLessThan(1000 * 11)
            expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

            done()
        })


    }, 1000 * 15)


    test('lock-concurrency', (done) => {

        const startTime = Date.now()

        const lock = new Lock(3)

        const idMap = [
            1000,
            2000,
            3000,
            5000,
            7000,
            9000,
            12000,
            15000,
        ]

        async function sleep(t: number = 1000) {
            await new Promise(resolve => setTimeout(resolve, t));
        }

        async function task(i: number, t: number = 1000) {

            await lock.acquire()
            await sleep(i * 1000)
            lock.release()

            const endTime = Date.now() - startTime

            expect(endTime).toBeGreaterThanOrEqual(idMap[i - 1])
            expect(endTime).toBeLessThan(idMap[i - 1] + 100)
            return i
        }

        const tasks: Promise<number>[] = []
        for (let i = 1; i <= 8; i++) tasks.push(task(i))


        Promise.all(tasks).then(results => {

            const endTime = Date.now() - startTime

            console.log('用时:', endTime)

            expect(endTime).toBeGreaterThanOrEqual(1000 * 15)
            expect(endTime).toBeLessThan(1000 * 15 + 100)
            expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8])

            done()
        })


    }, 1000 * 20)

});

