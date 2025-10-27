// Данные для обучения (рост, вес) и метки (спортсмен/не спортсмен)
const trainingData = [
  [180, 80],   // спортсмен
  [170, 70],   // спортсмен
  [160, 60],   // не спортсмен
  [155, 55],   // не спортсмен
  [190, 90],   // спортсмен
  [165, 65]    // не спортсмен
];

const labels = ['спортсмен', 'спортсмен', 'не спортсмен', 'не спортсмен', 'спортсмен', 'не спортсмен'];

// Функция для вычисления расстояния между двумя точками
function euclideanDistance(point1, point2) {
  let sum = 0;
  for (let i = 0; i < point1.length; i++) {
    sum += Math.pow(point1[i] - point2[i], 2);
  }
  return Math.sqrt(sum);
}

// Основная функция KNN
function knn(trainingData, labels, newPoint, k = 3) {
  // 1. Вычисляем расстояния до всех точек обучения
  const distances = [];
  for (let i = 0; i < trainingData.length; i++) {
    const distance = euclideanDistance(trainingData[i], newPoint);
    distances.push({ index: i, distance: distance, label: labels[i] });
  }
  
  // 2. Сортируем по расстоянию (от ближайшего к дальнему)
  distances.sort((a, b) => a.distance - b.distance);
  
  // 3. Берем K ближайших соседей
  const nearestNeighbors = distances.slice(0, k);
  
  // 4. Подсчитываем голоса (какой класс встречается чаще)
  const voteCount = {};
  for (let neighbor of nearestNeighbors) {
    const label = neighbor.label;
    voteCount[label] = (voteCount[label] || 0) + 1;
  }
  
  // 5. Находим класс с наибольшим количеством голосов
  let maxVotes = 0;
  let predictedClass = '';
  
  for (let label in voteCount) {
    if (voteCount[label] > maxVotes) {
      maxVotes = voteCount[label];
      predictedClass = label;
    }
  }
  
  return predictedClass;
}

// Тестируем алгоритм
const newPerson = [175, 75];  // новый человек (рост 175, вес 75)
const result = knn(trainingData, labels, newPerson, 3);

console.log(`Человек с ростом ${newPerson[0]}см и весом ${newPerson[1]}кг: ${result}`);

// Как это работает:

// Данные: У нас есть данные о людях (рост, вес) и мы знаем, кто спортсмен, а кто нет

// Расстояние: Для нового человека вычисляем расстояние до всех известных людей

// Соседи: Выбираем K ближайших соседей (в примере K=3)

// Голосование: Смотрим, к какому классу относятся большинство соседей

// Результат: Присваиваем новый объект к тому классу, который преобладает среди соседей