<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the JSON data from the request
$input = file_get_contents('php://input');
$feedbackData = json_decode($input, true);

if (!$feedbackData || !isset($feedbackData['category']) || !isset($feedbackData['vote'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit();
}

$category = $feedbackData['category'];
$vote = $feedbackData['vote']; // true for yes, false for no

// Validate category
$validCategories = ['cringe', 'toxic', 'pervers', 'nerd'];
if (!in_array($category, $validCategories)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid category']);
    exit();
}

// Load existing feedback
$feedbackFile = '../category_feedback.json';
if (file_exists($feedbackFile)) {
    $data = json_decode(file_get_contents($feedbackFile), true);
} else {
    $data = [
        'categories' => [
            'cringe' => ['yes' => 0, 'no' => 0],
            'toxic' => ['yes' => 0, 'no' => 0],
            'pervers' => ['yes' => 0, 'no' => 0],
            'nerd' => ['yes' => 0, 'no' => 0]
        ]
    ];
}

// Update the count
if ($vote) {
    $data['categories'][$category]['yes']++;
} else {
    $data['categories'][$category]['no']++;
}

// Save updated feedback
if (file_put_contents($feedbackFile, json_encode($data, JSON_PRETTY_PRINT))) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Feedback enregistré'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save feedback']);
}
?>
