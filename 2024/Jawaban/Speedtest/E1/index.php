<?php
$actualAnswers = file("actualAnswers.csv", FILE_IGNORE_NEW_LINES);
$submittedAnswers = file("submittedAnswers.csv", FILE_IGNORE_NEW_LINES);

$totalQuestions = min(count($actualAnswers), count($submittedAnswers));

$score = 0;

echo "<table border='1'>";
echo "<tr><th>Question</th><th>Actual Answer</th><th>Submitted Answer</th></tr>";

for ($i = 0; $i < $totalQuestions; $i++) {
    $actual = trim($actualAnswers[$i]);
    $submitted = trim($submittedAnswers[$i]);

    if ($actual === $submitted) {
        $score++;
    }

    echo "<tr>
            <td>" . ($i + 1) . "</td>
            <td>$actual</td>
            <td>$submitted</td>
          </tr>";
}

echo "</table>";

echo "<p>Score: $score/$totalQuestions</p>";
?>
