export function binarySetInsert<T>(
  arr: T[],
  val: T,
  compFunc: (a: T, b: T) => boolean,
  eqFunc: (a: T, b: T) => boolean
) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (compFunc(arr[mid], val)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  if (arr.length === low || !eqFunc(arr[low], val)) {
    arr.splice(low, 0, val);
  }
  return arr;
}
