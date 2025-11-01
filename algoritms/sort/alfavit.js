function sortAlf(arr){
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let arrCompl = {};
    for(let i = 0; i <= arr.length - 1; i++){
        let firstChar = arr[i][0];
        for(var j = 0; j <= alphabet.length - 1; j++){
            if(alphabet[j] == firstChar){
                arrCompl[j] = arr[i];
            }
        }
    }
    return arrCompl;
    //return arrCompl = Object.values(arrCompl);
}

let arr = ["apple", "kivi", "banana"]
console.log(sortAlf(arr))