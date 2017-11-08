var jsonObj = {};
var ajaxCallNum = 0;
var error = {};
var phpUrl = "http://localhost/hw8ng/php/multiAjax.php";
// var phpUrl = "php/multiAjax.php";
// set initial value to 0
function initStat() {
    jsonObj = {};
    ajaxCallNum = 0;
    error = {};
    return true;

}

// use save json in to jsonobj
function saveJson(item, JsonData) {
    jsonObj[item] = JsonData;
}

// use save ajax error massage
function saveError(item) {
    error[item] = "Error! Failed to get " + item + " data.";
}


// check if all jquery is done
function checkAllJqueryDone() {
    if (ajaxCallNum == 9) {
        $(".whole-json-data").html(
            "<br> whole-json-data" + JSON.stringify(jsonObj)
        );
    }

}

//use use jquery get data, functionName: "SMA"
function jqueryGetData(functionName, initData) {

    var data = {
        "action": "get" + functionName + "Data" // set "action" which will be tranfer to php
    };
    data = initData + "&" + $.param(data);
    //serialize every data with & eg: Favorite beverage=coke&favorite_restaurant=df&...&action=test
    $.ajax({
        type: "GET",
        dataType: "json", // dataType send back
        url: phpUrl,
        data: data,  // data send to server
        success: function (data) {
            saveJson(functionName, data);
            $("." + functionName + "-data").html(
                "<br />JSON: " + jsonObj[functionName]["json"] //data is a json object
            );
            ajaxCallNum++;
            checkAllJqueryDone();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(functionName + " data " + XMLHttpRequest.readyState + "\n" + XMLHttpRequest.status + "\n" + errorThrown);
            saveError(functionName);
            ajaxCallNum++;
            checkAllJqueryDone();
        }
    });

}


$("document").ready(function () {
    $(".stockForm").submit(function () {

        // set initial value to 0
        initStat();

        // use get basic data and daily data
        var data = {
            "action": "getStockData" // set "action" which will be tranfer to php
        };
        data = $(this).serialize() + "&" + $.param(data);
        //serialize every data with & eg: Favorite beverage=coke&favorite_restaurant=df&...&action=test
        $.ajax({
            type: "GET",
            dataType: "json", // dataType send back
            url: phpUrl,
            data: data,  // data send to server
            success: function (data) {
                saveJson("basic info", data);
                $(".the-return").html(
                    "<br />JSON: " + data["json"] //data is a json object
                );
                ajaxCallNum++;
                checkAllJqueryDone();

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("detail data " + XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
                saveError("Current stock");
                saveError("Price");
                ajaxCallNum++;
                checkAllJqueryDone();
            }
        });

        // use get SMA data
        jqueryGetData("SMA", $(this).serialize());

        // use get EMA data
        jqueryGetData("EMA", $(this).serialize());

        // use get RSI data
        jqueryGetData("RSI", $(this).serialize());

        // use get ADX data
        jqueryGetData("ADX", $(this).serialize());

        // use get CCI data
        jqueryGetData("CCI", $(this).serialize());

        // use get BBANDS data
        jqueryGetData("BBANDS", $(this).serialize());

        // use get MCAD data
        jqueryGetData("MACD", $(this).serialize());

        // use get STOCH data
        jqueryGetData("STOCH", $(this).serialize());


        return false;

    });
});