<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $data = $_POST['data'];
    $data_hash = hash('md5', $data);
    
    $filename = "./maps/". $data_hash. ".json";
    $json_file = fopen($filename, 'w') or die('An error has occured.');
    fwrite($json_file, $data);
    fclose($json_file);
    header("Location: " . "./index.html?code=". $data_hash);
}

?>