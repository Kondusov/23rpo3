<?php
require_once __DIR__ . '/config.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'error' => 'Method not allowed'], 405);
        exit;
    }

    $name = trim((string)($_POST['name'] ?? ''));
    $score = (int)($_POST['score'] ?? 0);
    if ($name === '') { $name = 'Игрок'; }
    if ($score < 0) { $score = 0; }
    if (mb_strlen($name) > 32) { $name = mb_substr($name, 0, 32); }

    $pdo = db_get_pdo();
    $stmt = $pdo->prepare('INSERT INTO scores (name, score) VALUES (:name, :score)');
    $stmt->execute([':name' => $name, ':score' => $score]);

    json_response(['success' => true]);
} catch (Throwable $e) {
    json_response(['success' => false, 'error' => 'Server error'], 500);
}


