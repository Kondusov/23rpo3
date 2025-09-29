/**
 * Поиск в ширину (BFS) - алгоритм обхода графа, который посещает все вершины
 * на текущем уровне перед переходом на следующий уровень
 */

// Граф в виде списка смежности
const graph = {
    'A': ['B', 'C'],     // A соединен с B и C
    'B': ['A', 'D', 'E'], // B соединен с A, D и E
    'C': ['A', 'F'],     // C соединен с A и F
    'D': ['B'],          // D соединен только с B
    'E': ['B', 'F'],     // E соединен с B и F
    'F': ['C', 'E']      // F соединен с C и E
};

/**
 * Функция BFS для обхода графа
 * @param {Object} graph - граф в виде списка смежности
 * @param {string} start - начальная вершина
 * @returns {Array} - массив вершин в порядке их посещения
 */
function breadthFirstSearch(graph, start) {
    // Очередь для хранения вершин, которые нужно посетить
    // BFS использует очередь (FIFO - First In First Out)
    const queue = [start];
    
    // Множество для отслеживания посещенных вершин
    // Это предотвращает бесконечные циклы в циклических графах
    const visited = new Set([start]);
    
    // Массив для хранения результата - порядка обхода вершин
    const result = [];
    
    console.log(`Начинаем BFS с вершины: ${start}`);
    console.log(`Очередь: [${queue}]`);
    console.log(`Посещенные: {${Array.from(visited)}}`);
    console.log('---');
    
    // Пока в очереди есть вершины для обработки
    while (queue.length > 0) {
        // Извлекаем первую вершину из очереди (FIFO)
        const currentVertex = queue.shift();
        
        // Добавляем текущую вершину в результат
        result.push(currentVertex);
        
        console.log(`Обрабатываем вершину: ${currentVertex}`);
        console.log(`Результат: [${result}]`);
        
        // Получаем всех соседей текущей вершины
        const neighbors = graph[currentVertex];
        console.log(`Соседи ${currentVertex}: [${neighbors}]`);
        
        // Проходим по всем соседям
        for (const neighbor of neighbors) {
            // Если сосед еще не был посещен
            if (!visited.has(neighbor)) {
                console.log(`  Нашли непосещенного соседа: ${neighbor}`);
                
                // Добавляем соседа в множество посещенных
                visited.add(neighbor);
                
                // Добавляем соседа в конец очереди для последующей обработки
                queue.push(neighbor);
                
                console.log(`  Добавили ${neighbor} в очередь и отметили как посещенный`);
            } else {
                console.log(`  Сосед ${neighbor} уже посещен, пропускаем`);
            }
        }
        
        console.log(`Текущее состояние очереди: [${queue}]`);
        console.log(`Текущие посещенные: {${Array.from(visited)}}`);
        console.log('---');
    }
    
    console.log('BFS завершен!');
    return result;
}

// Пример использования
console.log('=== ПРИМЕР BFS ===');
const traversalOrder = breadthFirstSearch(graph, 'A');
console.log('\nФИНАЛЬНЫЙ РЕЗУЛЬТАТ:');
console.log(`Порядок обхода вершин: [${traversalOrder}]`);

/**
 * BFS для поиска кратчайшего пути между двумя вершинами
 * @param {Object} graph - граф в виде списка смежности
 * @param {string} start - начальная вершина
 * @param {string} target - целевая вершина
 * @returns {Array|null} - кратчайший путь или null, если путь не найден
 */
function bfsShortestPath(graph, start, target) {
    // Если начальная и целевая вершины совпадают
    if (start === target) {
        return [start];
    }
    
    // Очередь содержит пути (массивы вершин)
    const queue = [[start]];
    const visited = new Set([start]);
    
    console.log(`\n=== ПОИСК КРАТЧАЙШЕГО ПУТИ ОТ ${start} ДО ${target} ===`);
    
    while (queue.length > 0) {
        // Извлекаем первый путь из очереди
        const path = queue.shift();
        const currentVertex = path[path.length - 1];
        
        console.log(`Текущий путь: [${path}]`);
        
        // Получаем всех соседей текущей вершины
        const neighbors = graph[currentVertex];
        
        for (const neighbor of neighbors) {
            // Если нашли целевую вершину
            if (neighbor === target) {
                const shortestPath = [...path, neighbor];
                console.log(`🎉 НАЙДЕН ПУТЬ: [${shortestPath}]`);
                return shortestPath;
            }
            
            // Если сосед еще не посещен
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                // Создаем новый путь, добавляя соседа к текущему пути
                const newPath = [...path, neighbor];
                queue.push(newPath);
                console.log(`  Добавили в очередь путь: [${newPath}]`);
            }
        }
    }
    
    console.log(`❌ Путь от ${start} до ${target} не найден`);
    return null;
}

// Пример поиска кратчайшего пути
console.log('\n=== ПРИМЕР ПОИСКА КРАТЧАЙШЕГО ПУТИ ===');
const shortestPath = bfsShortestPath(graph, 'A', 'F');
console.log(`Кратчайший путь: [${shortestPath}]`);

// Дополнительный пример: BFS для подсчета компонентов связности
console.log('\n=== ПОДСЧЕТ КОМПОНЕНТОВ СВЯЗНОСТИ ===');

/**
 * Функция для подсчета компонентов связности в графе
 * @param {Object} graph - граф в виде списка смежности
 * @returns {number} - количество компонентов связности
 */
function countConnectedComponents(graph) {
    const visited = new Set();
    let componentCount = 0;
    
    // Проходим по всем вершинам графа
    for (const vertex in graph) {
        // Если вершина еще не посещена, это новый компонент
        if (!visited.has(vertex)) {
            componentCount++;
            console.log(`Найден новый компонент связности #${componentCount}`);
            
            // Запускаем BFS для этого компонента
            const queue = [vertex];
            visited.add(vertex);
            
            while (queue.length > 0) {
                const currentVertex = queue.shift();
                const neighbors = graph[currentVertex];
                
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
            
            console.log(`  Вершины в компоненте: {${Array.from(visited).filter(v => !visited.has(v) === false)}}`);
        }
    }
    
    return componentCount;
}

// Пример с несвязным графом
const disconnectedGraph = {
    'A': ['B'],
    'B': ['A'],
    'C': ['D'],
    'D': ['C'],
    'E': ['F'],
    'F': ['E']
};

console.log('Количество компонентов связности:', countConnectedComponents(disconnectedGraph));