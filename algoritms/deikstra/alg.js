class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }

    dequeue() {
        return this.values.shift();
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

function dijkstra(graph, start) {
    // Создаем объект для хранения кратчайших расстояний
    const distances = {};
    // Создаем объект для отслеживания предыдущих вершин
    const previous = {};
    // Создаем очередь с приоритетом
    const queue = new PriorityQueue();

    // Инициализация начальных значений
    for (let vertex in graph) {
        if (vertex === start) {
            distances[vertex] = 0;
            queue.enqueue(vertex, 0);
        } else {
            distances[vertex] = Infinity;
            queue.enqueue(vertex, Infinity);
        }
        previous[vertex] = null;
    }

    // Основной цикл алгоритма
    while (!queue.isEmpty()) {
        // Извлекаем вершину с наименьшим расстоянием
        const smallest = queue.dequeue().val;

        // Если расстояние до вершины равно Infinity, значит оставшиеся вершины недостижимы
        if (distances[smallest] === Infinity) continue;

        // Перебираем всех соседей текущей вершины
        for (let neighbor in graph[smallest]) {
            // Вычисляем новое расстояние до соседа через текущую вершину
            const candidate = distances[smallest] + graph[smallest][neighbor];
            
            // Если найден более короткий путь
            if (candidate < distances[neighbor]) {
                // Обновляем расстояние
                distances[neighbor] = candidate;
                // Обновляем предыдущую вершину
                previous[neighbor] = smallest;
                // Добавляем соседа в очередь с новым приоритетом
                queue.enqueue(neighbor, candidate);
            }
        }
    }

    return { distances, previous };
}

// Функция для восстановления кратчайшего пути
function getPath(previous, end) {
    const path = [];
    let current = end;

    // Восстанавливаем путь от конечной вершины к начальной
    while (current !== null) {
        path.push(current);
        current = previous[current];
    }

    return path.reverse();
}

// Пример использования

// Граф в виде списка смежности с весами
const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 1, 'D': 5 },
    'C': { 'A': 2, 'B': 1, 'D': 8, 'E': 10 },
    'D': { 'B': 5, 'C': 8, 'E': 2 },
    'E': { 'C': 10, 'D': 2 }
};

// Запускаем алгоритм Дейкстры из вершины 'A'
const result = dijkstra(graph, 'A');

console.log('Кратчайшие расстояния:', result.distances);
console.log('Предыдущие вершины:', result.previous);

// Получаем путь до вершины 'E'
const pathToE = getPath(result.previous, 'E');
console.log('Кратчайший путь от A до E:', pathToE);
console.log('Расстояние до E:', result.distances['E']);


// Пояснение алгоритма:

// Инициализация: Устанавливаем расстояние до стартовой вершины 0, до всех остальных - бесконечность.

// Очередь с приоритетом: Используем для выбора следующей вершины с наименьшим известным расстоянием.

// Релаксация ребер: Для каждой вершины проверяем всех ее соседей. Если найден более короткий путь через текущую вершину, обновляем расстояние.

// Восстановление пути: Используя информацию о предыдущих вершинах, восстанавливаем кратчайший путь от старта до любой вершины.

// Алгоритм Дейкстры работает для графов с неотрицательными весами и находит кратчайшие пути от стартовой вершины до всех остальных.