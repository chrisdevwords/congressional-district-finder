
export default function isValidGeoCoordinates(arr) {
    return Array.isArray(arr) &&
        arr.length === 2 &&
        !isNaN(arr[0]) &&
        !isNaN(arr[1]) &&
        arr[0] !== null &&
        arr[1] !== null;
}
