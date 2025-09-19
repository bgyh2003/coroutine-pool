export type ITaskFunction<
    TParams extends any[] = any[], TResult = any
> = (...args: TParams) => Promise<TResult>

export interface ITaskData<
    TParams extends any[] = any[],
    TResult = any
> {
    id: number
    tag: string | null
    params: TParams
    taskFunction: ITaskFunction<TParams, TResult>
}

