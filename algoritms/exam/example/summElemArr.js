function summ(arr, counter=0, result = 0){
    if(counter == arr.length){
        return result;
    }else{
        result += arr[counter];
        counter++;
        return summ(arr, counter, result);
    }
}
arr1= [2,3,5,1];
console.log(summ(arr1));