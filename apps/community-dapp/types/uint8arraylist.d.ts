declare module 'uint8arraylist' {
  export type Appendable = Uint8ArrayList | Uint8Array
  export declare class Uint8ArrayList implements Iterable<Uint8Array> {
    length: number
    readonly byteLength: number
    constructor(...data: Appendable[])
    [Symbol.iterator](): Iterator<Uint8Array>
    append(...bufs: Appendable[]): void
    prepend(...bufs: Appendable[]): void
    appendAll(bufs: Appendable[]): void
    prependAll(bufs: Appendable[]): void
    slice(start?: number, end?: number): Uint8Array
    subarray(start?: number, end?: number): Uint8Array
    get(index: number): number
    set(index: number, value: number): void
  }
  export declare function isUint8ArrayList(value: any): value is Uint8ArrayList
}
