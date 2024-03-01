export type FilterFunction<T> = (option: T, text: string) => boolean 
export type FormatFunction<T> = (option: T) => string
export type FilterBuilder<T> = (filterValue: string) => FilterFunction<T>