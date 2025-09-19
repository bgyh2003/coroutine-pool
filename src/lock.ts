
export class Lock {

    private promiseList: Promise<any>[] = []

    private resolveList: ((value: unknown) => void)[] = []

    constructor(
        private concurrency: number = 1
    ) { }

    setConcurrency(concurrency: number) {
        this.concurrency = concurrency
    }

    getConcurrency() {
        return this.concurrency
    }

    createPromiseAndResolve() {
        let promise = new Promise((resolve) => this.resolveList.push(resolve))
        this.promiseList.push(promise)
    }

    getPromise() {
        if (this.promiseList.length >= this.concurrency)
            return this.promiseList.shift()
    }

    getResolve() {
        return this.resolveList.shift()
    }

    async acquire() {
        const promise = this.getPromise()
        this.createPromiseAndResolve()
        if (promise) await promise
    }

    release() {
        const resolve = this.getResolve()
        if (resolve) resolve(true)
        else throw new Error('Lock: release error')
    }


}