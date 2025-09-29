function queue(arr, getElem, addElem ){
    if(getElem == true) arr.shift();
    else{arr.push(addElem);}
    return arr;
}
let arr1 = [];
console.log(queue(arr1, false, 10));
console.log(queue(arr1,true, 20));
console.log(queue(arr1,false, 30));