function zip(...arrays: any[][]) {
    const length = Math.min(...arrays.map((arr) => arr.length))
    return Array.from({ length }, (_, index) => arrays.map((arr) => arr[index]));
}