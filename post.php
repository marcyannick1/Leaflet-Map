<?php

try {
$db = new PDO('mysql:host=localhost;dbname=leaflet', 'root', '');
} catch (PDOException $e) {
    die("Erreur !: " . $e->getMessage());
}

function sendData($dataJson, $database){
    $data = json_decode($dataJson, true);
    var_dump($data);

    foreach ($data as $key => $value) {
        if($data[$key] == "undefined") 
            $data[$key] = null;
    }

    $numero = $data['numero'];
    $rue = $data['rue'];
    $ville = $data['ville'];
    $codePostal = $data['codePostal'];
    $latitude = $data['latitude'];
    $longitude = $data['longitude'];

    $check = $database->prepare("SELECT * FROM `adresses` WHERE `latitude` = '$latitude' and `longitude` = '$longitude'");
    $check->execute();

    if ($check->rowCount() == 0){
        $stmt = $database->prepare("INSERT INTO `adresses`(`numero`, `rue`, `ville`, `code postal`, `latitude`, `longitude`) VALUES ('$numero','$rue','$ville','$codePostal','$latitude','$longitude')");
        $stmt->execute();
    }
}

if(isset($_POST["locationData1"])){
    $dataJson = $_POST["locationData1"];
    sendData($dataJson, $db);
}

if(isset($_POST["locationData2"])){
    $dataJson = $_POST["locationData2"];
    sendData($dataJson, $db);
}