// Наивная рекурсивная реализация - НЕ рекомендуется для больших n
function fibonacciRecursive(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// Динамическое программирование с мемоизацией
function fibonacciMemo(n, memo = {}) {
    // Базовые случаи
    if (n <= 1) {
        return n;
    }
    
    // Если результат уже вычислен, возвращаем его из кэша
    if (memo[n] !== undefined) {
        return memo[n];
    }
    
    // Вычисляем результат и сохраняем в кэш
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    
    return memo[n];
}
// Динамическое программирование с мемоизацией
function fibonacciMemo(n, memo = {}) {
    // Базовые случаи
    if (n <= 1) {
        return n;
    }
    
    // Если результат уже вычислен, возвращаем его из кэша
    if (memo[n] !== undefined) {
        return memo[n];
    }
    
    // Вычисляем результат и сохраняем в кэш
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    
    return memo[n];
}
// Динамическое программирование с табуляцией
function fibonacciTabulation(n) {
    // Базовые случаи
    if (n <= 1) {
        return n;
    }
    
    // Создаем массив для хранения промежуточных результатов
    const dp = new Array(n + 1);
    
    // Инициализируем базовые значения
    dp[0] = 0;
    dp[1] = 1;
    
    // Заполняем массив снизу вверх
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}
// Оптимизированная версия с O(1) памятью
function fibonacciOptimized(n) {
    if (n <= 1) {
        return n;
    }
    
    let prev1 = 0;  // F(n-2)
    let prev2 = 1;  // F(n-1)
    let current = 0;
    
    for (let i = 2; i <= n; i++) {
        current = prev1 + prev2;  // F(n) = F(n-1) + F(n-2)
        prev1 = prev2;            // Сдвигаем значения
        prev2 = current;
    }
    
    return current;
}
// Тестируем все реализации
function testFibonacci() {
    const n = 10;
    
    console.log(`Числа Фибоначчи до F(${n}):`);
    
    for (let i = 0; i <= n; i++) {
        console.log(`F(${i}) = ${fibonacciOptimized(i)}`);
    }
    
    // Сравнение производительности
    console.log('\nСравнение производительности для n = 35:');
    
    console.time('Оптимизированная версия');
    console.log(`Результат: ${fibonacciOptimized(35)}`);
    console.timeEnd('Оптимизированная версия');
    
    console.time('С табуляцией');
    console.log(`Результат: ${fibonacciTabulation(35)}`);
    console.timeEnd('С табуляцией');
    
    console.time('С мемоизацией');
    console.log(`Результат: ${fibonacciMemo(35)}`);
    console.timeEnd('С мемоизацией');
    
    // Рекурсивная версия будет очень медленной для n = 35
    // console.time('Рекурсивная');
    // console.log(`Результат: ${fibonacciRecursive(35)}`);
    // console.timeEnd('Рекурсивная');
}

testFibonacci();
// Задача о рюкзаке 0/1
function knapsack(weights, values, capacity) {
    const n = weights.length;
    
    // Создаем таблицу DP размером (n+1) x (capacity+1)
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    // Заполняем таблицу
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            // Если текущий предмет не помещается в рюкзак
            if (weights[i - 1] > w) {
                dp[i][w] = dp[i - 1][w];
            } else {
                // Выбираем максимум между:
                // 1. Не брать текущий предмет
                // 2. Взять текущий предмет + максимальную стоимость для оставшегося места
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]
                );
            }
        }
    }
    
    return dp[n][capacity];
}

// Пример использования задачи о рюкзаке
const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 5;

console.log(`Максимальная стоимость: ${knapsack(weights, values, capacity)}`);

// Ключевые принципы динамического программирования:
// Разбиение на подзадачи - большая задача разбивается на меньшие

// Перекрывающиеся подзадачи - одни и те же подзадачи решаются многократно

// Оптимальная подструктура - оптимальное решение содержит оптимальные решения подзадач

// Мемоизация/табуляция - сохранение результатов подзадач для повторного использования

// Эти примеры демонстрируют основные подходы динамического программирования и их эффективную реализацию на JavaScript