//несколько примеров ненаправленных графов:
//Пример 1: Простой граф друзей

// Ненаправленный граф - друзья в социальной сети
const friendsGraph = {
    'Alice': ['Bob', 'Charlie', 'Diana'],
    'Bob': ['Alice', 'Charlie', 'Eve'],
    'Charlie': ['Alice', 'Bob', 'Diana', 'Frank'],
    'Diana': ['Alice', 'Charlie', 'Grace'],
    'Eve': ['Bob', 'Frank'],
    'Frank': ['Charlie', 'Eve', 'Grace'],
    'Grace': ['Diana', 'Frank']
};

// Визуализация:
// Alice ─── Bob ─── Eve
//   │    ╱   │       │
//   │  ╱     │       │
// Charlie ── Diana   │
//   │         │      │
// Frank ──── Grace   │
//   └────────┘
//Пример 2: Города и дороги
// Граф городов, соединенных дорогами (дороги двусторонние)
const citiesGraph = {
    'Москва': ['Санкт-Петербург', 'Казань', 'Нижний Новгород'],
    'Санкт-Петербург': ['Москва', 'Псков'],
    'Казань': ['Москва', 'Самара', 'Уфа'],
    'Нижний Новгород': ['Москва', 'Казань', 'Иваново'],
    'Псков': ['Санкт-Петербург'],
    'Самара': ['Казань', 'Уфа'],
    'Уфа': ['Казань', 'Самара'],
    'Иваново': ['Нижний Новгород']
};

// Визуализация:
// СПб ─── Москва ─── Казань ─── Самара
//  │                 │    ╲      │
// Псков       Нижний Новгород   Уфа
//              │
//           Иваново

//Пример 3: Более сложный граф
const complexGraph = {
    'A': ['B', 'C', 'D'],
    'B': ['A', 'C', 'E'],
    'C': ['A', 'B', 'D', 'E', 'F'],
    'D': ['A', 'C', 'G'],
    'E': ['B', 'C', 'F', 'H'],
    'F': ['C', 'E', 'G', 'H'],
    'G': ['D', 'F', 'I'],
    'H': ['E', 'F', 'I'],
    'I': ['G', 'H']
};

// Визуализация:
//     A
//    /|\
//   B-C-D
//   |\|/|
//   E-F-G
//   |\| |
//   H─I

//Проверка на ненаправленность
// Функция для проверки, что граф действительно ненаправленный
function isUndirected(graph) {
    for (const node in graph) {
        for (const neighbor of graph[node]) {
            // Проверяем, что если A связан с B, то B тоже связан с A
            if (!graph[neighbor] || !graph[neighbor].includes(node)) {
                return false;
            }
        }
    }
    return true;
}

// Проверяем наши графы
console.log('Граф друзей ненаправленный:', isUndirected(friendsGraph));
console.log('Граф городов ненаправленный:', isUndirected(citiesGraph));
console.log('Сложный граф ненаправленный:', isUndirected(complexGraph));

//Поиск в ширину на ненаправленном графе
function bfsUndirected(graph, start) {
    const queue = [start];
    const visited = new Set([start]);
    const result = [];
    
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        
        for (const neighbor of graph[current]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

// Пример использования
console.log('Обход графа друзей:', bfsUndirected(friendsGraph, 'Alice'));
console.log('Обход графа городов:', bfsUndirected(citiesGraph, 'Москва'));

// Ключевые особенности ненаправленных графов:

// Если вершина A соединена с вершиной B, то и B соединена с A

// Ребра не имеют направления

// Хорошо подходят для моделирования симметричных отношений (дружба, дороги, соединения)