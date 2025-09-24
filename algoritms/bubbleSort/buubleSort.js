function bubbleSort(arr) {
    for (let j = arr.length - 1; j > 0; j--) {
      for (let i = 0; i < j; i++) {
        if (arr[i] > arr[i + 1]) {
          let temp = arr[i]; // объявляем переменную
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
        }
      }
    }
    return arr; // Возврат значения из функции
  }
arr1 = [5,8,2,4,1,9,3,7];
console.log(bubbleSort(arr1)); // console.log 
// - это метод вывода в консоль