function sortAlf(arr){
    let arrResult = {};
    for(var i = 0; i <= arr.length - 1; i++){
        arrResult[arr[i].length] = arr[i];
//        console.log(arr[i].length)
    }
    return arrResult = Object.values(arrResult);
}

let arr = ["apple", "kivi", "banana"]
console.log(sortAlf(arr));