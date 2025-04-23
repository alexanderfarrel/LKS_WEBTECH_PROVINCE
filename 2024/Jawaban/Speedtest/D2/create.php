<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<?php
include 'test_php_doc.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);

    if (empty($title) || empty($description)) {
        die("Title dan description harus diisi.");
    }

    // make title into italic text
    $htmlContent = "
    <h1 style='font-family: Tahoma; font-size: 24px; font-weight: normal; font-style: italic; '>$title</h1>
    <p style='font-family: Times New Roman; font-size: 12px; font-weight: bold; text-decoration: underline;'>$description</p>";

    $fileName = "$title.doc";

    $htd = new HTML_TO_DOC();
    $htd->createDoc($htmlContent, $fileName, true);
}
?>

</body>
</html>