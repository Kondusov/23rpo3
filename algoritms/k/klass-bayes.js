// Простой пример: классификация текстов как "спам" или "не спам"
const trainingData = [
  { text: "купите дешевые часы", category: "спам" },
  { text: "ваш выигрыш миллион", category: "спам" },
  { text: "встреча в офисе", category: "не спам" },
  { text: "отчет по проекту", category: "не спам" },
  { text: "бесплатный айфон", category: "спам" },
  { text: "совещание в 15:00", category: "не спам" }
];

// Функция для разбивки текста на слова
function tokenize(text) {
  return text.toLowerCase().split(' ');
}

// Функция для обучения классификатора
function trainNaiveBayes(data) {
  const vocabulary = new Set(); // Все уникальные слова
  const classCounts = {}; // Количество документов в каждом классе
  const wordCounts = {}; // Количество слов в каждом классе
  const classWordFreq = {}; // Частота слов по классам
  
  // Инициализация структур данных
  for (let item of data) {
    const category = item.category;
    if (!classCounts[category]) {
      classCounts[category] = 0;
      wordCounts[category] = 0;
      classWordFreq[category] = {};
    }
    classCounts[category]++;
  }
  
  // Собираем словарь и подсчитываем частоты
  for (let item of data) {
    const category = item.category;
    const words = tokenize(item.text);
    
    for (let word of words) {
      vocabulary.add(word);
      wordCounts[category]++;
      
      if (!classWordFreq[category][word]) {
        classWordFreq[category][word] = 0;
      }
      classWordFreq[category][word]++;
    }
  }
  
  return {
    vocabulary: Array.from(vocabulary),
    classCounts,
    wordCounts,
    classWordFreq,
    totalDocuments: data.length
  };
}

// Функция для классификации нового текста
function classify(text, model) {
  const words = tokenize(text);
  const classes = Object.keys(model.classCounts);
  let bestClass = '';
  let bestScore = -Infinity;
  
  // Для каждого класса вычисляем "скор"
  for (let className of classes) {
    // Априорная вероятность P(класс)
    const classPrior = Math.log(model.classCounts[className] / model.totalDocuments);
    
    // Вероятность слов P(слова|класс)
    let wordLikelihood = 0;
    
    for (let word of words) {
      // Количество вхождений слова в классе (с добавлением 1 для сглаживания)
      const wordCount = (model.classWordFreq[className][word] || 0) + 1;
      // Общее количество слов в классе (с учетом размера словаря)
      const totalWordsInClass = model.wordCounts[className] + model.vocabulary.length;
      // Вероятность слова в классе
      const wordProbability = wordCount / totalWordsInClass;
      
      wordLikelihood += Math.log(wordProbability);
    }
    
    // Общий скор = log(P(класс)) + sum(log(P(слово|класс)))
    const totalScore = classPrior + wordLikelihood;
    
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestClass = className;
    }
  }
  
  return bestClass;
}

// Обучаем модель
const model = trainNaiveBayes(trainingData);

// Тестируем классификатор
const testTexts = [
  "купите бесплатный подарок",
  "совещание завтра утром",
  "выиграйте деньги сейчас"
];

console.log("Результаты классификации:");
testTexts.forEach(text => {
  const category = classify(text, model);
  console.log(`"${text}" -> ${category}`);
});