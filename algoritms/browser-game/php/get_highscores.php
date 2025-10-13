<?php
require_once __DIR__ . '/config.php';

try {
    $limit = 10;
    $pdo = db_get_pdo();
    $stmt = $pdo->prepare('SELECT name, score, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i") as created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT :limit');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    json_response(['success' => true, 'scores' => $rows]);
} catch (Throwable $e) {
    json_response(['success' => false, 'error' => 'Server error'], 500);
}


