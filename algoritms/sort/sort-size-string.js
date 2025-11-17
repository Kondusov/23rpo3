function sortByLength(arr){
    var tmp;
    for(var i = 0; i < arr.length - 1; i++){
        if(arr[i + 1].length < arr[i].length){
            tmp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = tmp;
        }
    }
    return arr;
}

let arr1 = ["banana", "kivi", "apple"]
sortByLength(arr1);
console.log(arr1); 



//еще одна вариация сортировки (используя количество символов для индекса
// при добавлении в новый массив)
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