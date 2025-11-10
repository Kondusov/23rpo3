// Динамическое программирование с мемоизацией
function fibonacciMemo(n, memo = {}) {
    // Базовые случаи
    if (n <= 1) {
        return n;
    }
    
    // Если результат уже вычислен, возвращаем его из кэша
    if (memo[n] !== undefined) {
        console.log(memo[n] +' из мемо');
        return memo[n];
        
    }
    
    // Вычисляем результат и сохраняем в кэш
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    
    console.log(memo[n] +' результат');
    return memo[n];
}
fibonacciMemo(5);
//fibonacciMemo(15);
//fibonacciMemo(5);