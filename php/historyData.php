<?php
header("Access-Control-Allow-Origin: *");

if(isset($_GET["symbol"]) && !empty($_GET["symbol"])) {
        $input = $_GET["symbol"];
        $input = strtoupper($input);
        return getHisData();
}


function getHisData(){
    // $return = $_GET; // $return is an object
    // $symbol = $return["symbol"];
    $symbol="AAPL";
    $symbol = strtoupper($symbol); //change to uppercase

    $jsonUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=".$symbol."&apikey=932OED6JIOLP723M";
    $contents = file_get_contents($jsonUrl);

    // if isjson() contents, need to add
    $initJson = json_decode($contents,true);
    $dataJson["symbol"] = $symbol;

    // use: get price chart values: date, price, volume
    $arrayClose = array();
    $arrayVolume = array();
    $arrayDate = array();
    foreach ($initJson["Time Series (Daily)"] as $date => $value) {
        foreach ($value as $key => $value2) {
            if ($key == '4. close') {
                array_push($arrayClose, $value2);
                $date = date_create_from_format('Y-m-d', $date);
                $date =  date_format($date, 'Y/m/d');
                $date = strtotime($date);
                array_push($arrayDate, $date);
            }
        }

    }
    $arrayDate = array_slice($arrayDate, 0, 1000);
    $arrayDate = array_reverse($arrayDate);
    $arrayClose = array_slice($arrayClose, 0, 1000);
    $arrayClose = array_reverse($arrayClose);

    $dataJson["arrayDate"] = $arrayDate;
    $dataJson["arrayPrice"] = $arrayClose;




    // use: print string of return json
    // $dataJson["json"] = json_encode($dataJson); //return the string of json, saved as a string value in $return object
    echo json_encode($dataJson);
}


?>