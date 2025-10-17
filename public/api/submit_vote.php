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
$voteData = json_decode($input, true);

if (!$voteData) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Create votes directory if it doesn't exist
$votesDir = '../votes';
if (!file_exists($votesDir)) {
    mkdir($votesDir, 0755, true);
}

// Generate filename with timestamp and user ID
$timestamp = date('Y-m-d_H-i-s');
$userId = isset($voteData['user_id']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $voteData['user_id']) : 'unknown';
$filename = "vote_{$timestamp}_{$userId}.json";
$filepath = $votesDir . '/' . $filename;

// Save the vote data
if (file_put_contents($filepath, json_encode($voteData, JSON_PRETTY_PRINT))) {
    
    // Update community_ratings.json
    updateCommunityRatings($voteData);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Vote enregistré avec succès',
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save vote']);
}

function updateCommunityRatings($voteData) {
    $ratingsFile = '../community_ratings.json';
    
    // Load existing ratings
    if (file_exists($ratingsFile)) {
        $ratingsData = json_decode(file_get_contents($ratingsFile), true);
    } else {
        $ratingsData = ['votes' => []];
    }
    
    // Update averages for each question
    foreach ($voteData['votes'] as $vote) {
        $questionId = $vote['question_id'];
        
        // Find existing question data
        $existingIndex = -1;
        foreach ($ratingsData['votes'] as $index => $existing) {
            if ($existing['question_id'] === $questionId) {
                $existingIndex = $index;
                break;
            }
        }
        
        if ($existingIndex >= 0) {
            // Update existing averages
            $existing = &$ratingsData['votes'][$existingIndex];
            $count = $existing['count'];
            $newCount = $count + 1;
            
            foreach (['cringe', 'toxic', 'pervers', 'nerd'] as $category) {
                $currentAvg = $existing['average'][$category];
                $newValue = $vote[$category];
                $existing['average'][$category] = (($currentAvg * $count) + $newValue) / $newCount;
            }
            
            $existing['count'] = $newCount;
        } else {
            // Add new question
            $ratingsData['votes'][] = [
                'question_id' => $questionId,
                'average' => [
                    'cringe' => $vote['cringe'],
                    'toxic' => $vote['toxic'],
                    'pervers' => $vote['pervers'],
                    'nerd' => $vote['nerd']
                ],
                'count' => 1
            ];
        }
    }
    
    // Save updated ratings
    file_put_contents($ratingsFile, json_encode($ratingsData, JSON_PRETTY_PRINT));
}
?>
