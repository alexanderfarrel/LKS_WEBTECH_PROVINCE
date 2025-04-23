<?php
$factor = isset($_GET['factor']) ? intval($_GET['factor']) : "";
$array = range(1, 40);

if($factor != "") {
    foreach ($array as $index => $value) {
        if ($value % $factor == 0) {
            $array[$index] = "$value is a multiple of $factor**";
        }
    }
}
echo "<pre style='border: 2px solid black; width: 300px;'> Modified ";
print_r($array);
echo "</pre>";
?>