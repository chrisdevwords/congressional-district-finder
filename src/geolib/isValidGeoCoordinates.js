
export default function isValidGeoCoordinates(arr) {
    return typeof arr === 'object' &&
        arr.length === 2 &&
        !isNaN(arr[0]) &&
        !isNaN(arr[1]);
}
