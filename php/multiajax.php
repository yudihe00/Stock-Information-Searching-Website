<?php
header('Access-Control-Allow-Origin: *');
date_default_timezone_set('America/New_York');

$dataReadError = "Get Data Error";

// get data for current stock tab
if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
    $action = $_GET["action"];
    // console.log($action);
    switch($action) { //Switch case for value of action
        case "getStockData": getStockData(); break;
        case "getSMAData": getOneVariableIndicatorData("SMA"); break;
        case "getEMAData": getOneVariableIndicatorData("EMA"); break;
        case "getRSIData": getOneVariableIndicatorData("RSI"); break;
        case "getADXData": getOneVariableIndicatorData("ADX"); break;
        case "getCCIData": getOneVariableIndicatorData("CCI"); break;
        case "getBBANDSData": getThreeVariableIndicatorData("BBANDS","Real Middle Band","Real Lower Band","Real Upper Band"); break;

        case "getMACDData": getThreeVariableIndicatorData("MACD","MACD_Signal","MACD_Hist","MACD"); break;

        case "getSTOCHData": getTwoVariableIndicatorData("STOCH","SlowD","SlowK"); break;
    }
}


//Function to check if the request is an AJAX request
function is_ajax() {
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function isJSON($string){
   return is_string($string) && is_array(json_decode($string, true)) ? true : false;
}

// use: get indicators Json object from url
function getIndicatorsJson($functionName, $symbol){
    $url = "https://www.alphavantage.co/query?function=".$functionName."&symbol=".$symbol."&interval=daily&time_period=10&series_type=open&apikey=932OED6JIOLP723M";
    $contents = file_get_contents($url);

    if (isJSON($contents)) {
        $initJson = json_decode($contents,true);
        if ($initJson==null) {
            return $dataReadError;
        }
        else return $initJson;
    } else return $dataReadError;
}

// use function get 1 variable indicator data
function getOneVariableDataArray($function,$symbol) {
    $arraySMA = array();
    $smaJson = getIndicatorsJson($function,$symbol);
    foreach ($smaJson["Technical Analysis: ".$function] as $date => $value) {
        foreach ($value as $key => $value2) {
            if ($key == $function) {
                array_push($arraySMA,$value2);
            }

        }
    }

    $arraySMA = array_slice($arraySMA, 0, 128);
    $arraySMA = array_reverse($arraySMA);
    return $arraySMA;
}

// use return json form of one variable indicator back to client
function getOneVariableIndicatorData($functionName){
    $return = $_GET; // $return is an object
    $symbol = $return["symbol"];
    $symbol = strtoupper($symbol); //change to uppercase
    $dataJson[$functionName] = getOneVariableDataArray($functionName,$symbol);
    // use: print string of return json
    $dataJson["json"] = json_encode($dataJson); //return the string of json, saved as a string value in $return object
    if ($dataJson[$functionName]==$dataReadError) {
        echo $dataReadError;
    }
    else echo json_encode($dataJson);

}


// use function get 1 specific variable data back for multi value indicator use
function getSpecificOneVariableDataArray($function,$symbol,$thekey,$iniWholeJson) {
    $arraySMA = array();
    $smaJson = $iniWholeJson;
    foreach ($smaJson["Technical Analysis: ".$function] as $date => $value) {
        foreach ($value as $key => $value2) {
            if ($key == $thekey) {
                array_push($arraySMA,$value2);
            }

        }
    }

    $arraySMA = array_slice($arraySMA, 0, 128);
    $arraySMA = array_reverse($arraySMA);
    return $arraySMA;
}

// use return json form of three variable indicator back to client
function getThreeVariableIndicatorData($functionName,$term1,$term2,$term3){
    $return = $_GET; // $return is an object
    $symbol = $return["symbol"];
    $symbol = strtoupper($symbol); //change to uppercase
    $iniWholeJson = getIndicatorsJson($functionName,$symbol);
    if($iniWholeJson == $dataReadError) {
        echo $dataReadError;
    } else {
        $dataJson[$functionName][$term1]=getSpecificOneVariableDataArray($functionName,$symbol,$term1,$iniWholeJson);
        $dataJson[$functionName][$term2]=getSpecificOneVariableDataArray($functionName,$symbol,$term2,$iniWholeJson);
        $dataJson[$functionName][$term3]=getSpecificOneVariableDataArray($functionName,$symbol,$term3,$iniWholeJson);

        // use: print string of return json
        $dataJson["json"] = json_encode($dataJson); //return the string of json, saved as a string value in $return object
        echo json_encode($dataJson);
    }
    

}

// use return json form of two variable indicator back to client
function getTwoVariableIndicatorData($functionName,$term1,$term2){
    $return = $_GET; // $return is an object
    $symbol = $return["symbol"];
    $symbol = strtoupper($symbol); //change to uppercase
    $iniWholeJson = getIndicatorsJson($functionName,$symbol);
    if($iniWholeJson == $dataReadError) {
        echo $dataReadError;
    } else {
        $dataJson[$functionName][$term1]=getSpecificOneVariableDataArray($functionName,$symbol,$term1,$iniWholeJson);
        $dataJson[$functionName][$term2]=getSpecificOneVariableDataArray($functionName,$symbol,$term2,$iniWholeJson);

        // use: print string of return json
        $dataJson["json"] = json_encode($dataJson); //return the string of json, saved as a string value in $return object
        echo json_encode($dataJson);
    }
    
}


// get stock details data for detail table and price charts
function getStockData(){
    $return = $_GET; // $return is an object
    $symbol = $return["symbol"];
    $symbol = strtoupper($symbol); //change to uppercase

    $jsonUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=".$symbol."&apikey=932OED6JIOLP723M";


    $contents = file_get_contents($jsonUrl);

    // if isjson() contents, need to add
    $initJson = json_decode($contents,true);
    if ($initJson != null) {
        $dataJson["symbol"] = $symbol;

    //get timeStamp
    $timeStamp = $initJson["Meta Data"]["3. Last Refreshed"]; //on market has time, otherwise only have date
    $onMarket = false; // check if on market

    if(strlen($timeStamp) > 12) {
        $timeStampFormat = date_create_from_format("Y-m-d H:i:s",$timeStamp); // $timeStampFormat is an date object
        $time = $timeStampFormat->format("H:i:s");
        // echo "time ".$time."<br>";
        $timeStampFormat = $timeStampFormat->format("Y-m-d H:i:s"); // change it into string
        $timeStampFormat = $timeStampFormat." EDT";
        $onMarket = true;
        if($time == "16:00:00") { //if today is market day, stamp will show time
            $onMarket = false;
        }
    } else {
        $timeStampFormat = date_create_from_format("Y-m-d",$timeStamp); // $timeStampFormat is an date object
        $timeStampFormat = $timeStampFormat->format("Y-m-d"); // change it into string
        $timeStampFormat = $timeStampFormat." 16:00:00 EDT"; //after market or market close

    }
    $dataJson["time stamp"] = $timeStampFormat;

    // use: get last price
    if($onMarket || $time == "16:00:00") {
        $date = date_create_from_format("Y-m-d H:i:s",$timeStamp);
        $date = $date->format("Y-m-d");
    } else {
        $date = date_create_from_format("Y-m-d",$timeStamp);
        $date = $date->format("Y-m-d");
    }
    $firstClose = $initJson["Time Series (Daily)"][$date]["4. close"]; //today or previous business day close
    $dataJson["last price"]=number_format($firstClose,2);

    //use: get change and change percent
    foreach ($initJson["Time Series (Daily)"] as $key => $value) {
        if($i==0) {
            $firstDate = $key;
        }
        if ($i==1) {
            $secondDate = $key;
            $secondClose = $initJson["Time Series (Daily)"][$secondDate]["4. close"];
            break;
        }
        $i++;
    }
    $change = $firstClose - $secondClose;
    $changePercent = $change / $secondClose * 100;
    $change = number_format($change,2);
    $changePercent = number_format($changePercent,2)."%";
    $dataJson["change"] = $change;
    $dataJson["change percent"] = $changePercent;

    // use: get open, close, Day's Range, Volume
    if($onMarket) {
        // if on market, last day session is previous market day
        $lastDaySessionDate = $secondDate;
    } else {
        $lastDaySessionDate = $firstDate;
    }
    $dataJson["open"] = number_format($initJson["Time Series (Daily)"][$lastDaySessionDate]["1. open"],2);
    $dataJson["close"] = number_format($initJson["Time Series (Daily)"][$lastDaySessionDate]["4. close"],2);
    $dataJson["volume"] = number_format($initJson["Time Series (Daily)"][$lastDaySessionDate]["5. volume"]);
    $high = number_format($initJson["Time Series (Daily)"][$lastDaySessionDate]["2. high"],2);
    $low = number_format($initJson["Time Series (Daily)"][$lastDaySessionDate]["3. low"],2);
    $dataJson["day's range"] = $low." - ".$high;

    // use: get price chart values: date, price, volume
    $arrayClose = array();
    $arrayVolume = array();
    $arrayDate = array();
    foreach ($initJson["Time Series (Daily)"] as $date => $value) {
        foreach ($value as $key => $value2) {
            if ($key == '4. close') {
                array_push($arrayClose, $value2);
            }
            if ($key == '5. volume') {
                array_push($arrayVolume, $value2);
                $date = date_create_from_format('Y-m-d', $date);
                $date =  date_format($date, 'm/d');
                array_push($arrayDate, $date);
            }

        }

    }
    $arrayDate = array_slice($arrayDate, 0, 128);
    $arrayDate = array_reverse($arrayDate);
    $arrayClose = array_slice($arrayClose, 0, 128);
    $arrayClose = array_reverse($arrayClose);
    $arrayVolume = array_slice($arrayVolume, 0, 128);
    $arrayVolume = array_reverse($arrayVolume);

    $dataJson["arrayDate"] = $arrayDate;
    $dataJson["arrayPrice"] = $arrayClose;
    $dataJson["arrayVolume"] = $arrayVolume;



    // use: print string of return json
    $dataJson["json"] = json_encode($dataJson); //return the string of json, saved as a string value in $return object
    echo json_encode($dataJson);
    }
    else echo $dataReadError;
}

// get data for draw history charts
    if(isset($_GET["input"]) && !empty($_GET["input"])) {
           $input = $_GET["input"];
           $input = strtoupper($input);
           // echo $symbol."</b>";
           return getHisData($input);
    }
    // getHisData();

    function getHisData($symbol){
        // $return = $_GET; // $return is an object
        // $symbol = $return["symbol"];
        // $symbol="AAPL";
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



        echo json_encode($dataJson);
    }

// get data for auto-complete
    if(isset($_GET["name"]) && !empty($_GET["name"])) {
        $input = $_GET["name"];
        $input = strtoupper($input);
        returnStockNameJson($input);
    }

    // returnStockNameJson("A");

    // function check string begin with
    function begins_with($haystack, $needle) {
    return strpos($haystack, $needle) === 0;
    }

    // return the stock name json
    function returnStockNameJson($input){
        $url = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$input;
        $resultJson = array();
        $resultJson["records"] = array(); 
        $formatResultJson = array();
        $index = 0;
        $contents = file_get_contents($url);
        $initJson = json_decode($contents,true);
        // echo json_encode($initJson)."<br>";
        foreach ($initJson as $key => $value) {
            foreach ($value as $key2 => $value2) {
                if($key2 == "Symbol" && begins_with($value["Symbol"],$input)) {
                    $resultJson["records"][$index]["value"] = $value["Symbol"];
                    $resultJson["records"][$index]["display"]=$value["Symbol"]." - ".$value["Name"]."(".$value["Exchange"].")";
                    $index++;

                }           
            }
        }

        echo json_encode($resultJson);

    }

// get data for news
    if(isset($_GET["newssymbol"]) && !empty($_GET["newssymbol"])) {
        $input = $_GET["newssymbol"];
        $input = strtoupper($input);
        return getNewsData($input);
    }

    function getNewsData($symbol){
        //$symbol="AAPL";
        // getNewsData($symbol);

        $xmlURL = "https://seekingalpha.com/api/sa/combined/".$symbol.".xml";

        $xml = simplexml_load_file($xmlURL);
        $jsonObj=json_encode($xml);
        $array=json_decode($jsonObj,true);
        //print_r($jsonObj).'</br>';
        $number=0;
        foreach ($xml->channel->item as $item) {
          $ns_sa = $item->children('https://seekingalpha.com/api/1.0');
          $ns_sa = $ns_sa->author_name;
          $array["channel"]["item"][$number]["author_name"]=(string)$ns_sa;
          $number=$number+1;
          //echo $ns_sa.'</br>';
        }
        //echo json_encode($array) .'</br>';
        $keyNum = 0;
        function endswith($string, $test) {
            $strlen = strlen($string);
            $testlen = strlen($test);
            if ($testlen > $strlen) return false;
            return substr_compare($string, $test, $strlen - $testlen, $testlen) === 0;
        }
        foreach ($array["channel"]["item"] as $key => $value) {
            $valueBackUp = $value;
            foreach ($value as $key2 => $value2) {
                if($key2 == "link" && !endswith($value2,'news?source=feed_symbol_'.strtoupper($symbol))) {
                    foreach ($valueBackUp as $key3 => $value3) {
                        if($key3 == "title" || $key3 == "link" || $key3 == "pubDate"|| $key3=="author_name") {
                            if($key3 == "pubDate") {
                                $value3 = substr($value3, 0, -5);
                            }
                            $arrayNews[$keyNum][$key3]=$value3;
                            

                        }
                    }
                    $keyNum++;
                    
                }
            }
            if($keyNum == 5) {  // need to change if not 5, test branch
                break;
            }
        }

        echo json_encode($arrayNews);
    }
?>