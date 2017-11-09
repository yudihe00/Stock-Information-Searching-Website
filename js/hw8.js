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


// check an object is empty
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


// check if all jquery is done
function checkAllJqueryDone() {
    if (ajaxCallNum == 9) {
        // var errorLength=error.toString()[length];
        if(isEmpty(error)) {
            //draw price chart
            priceAndVolume();

        } else {
            //show warning
        }
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
                $("#symbol").html(jsonObj["basic info"]["symbol"]);
                $("#timestamp").html(jsonObj["basic info"]["time stamp"]);
                $("#last-price").html(jsonObj["basic info"]["last price"]);

                if (jsonObj["basic info"]["change"]>0) {
                    $("#change-and-percent").html(
                        jsonObj["basic info"]["change"]+"("+jsonObj["basic info"]["change percent"]+")"+"&nbsp"+
                        '<img src="http://cs-server.usc.edu:45678/hw/hw8/images/Up.png"width=\"15px\" height=\"20px\">'
                    );
                    $("#change-and-percent").css({'color':'green'});
                } else {
                    $("#change-and-percent").html(
                        jsonObj["basic info"]["change"]+"("+jsonObj["basic info"]["change percent"]+")"+"&nbsp"+
                        '<img src="http://cs-server.usc.edu:45678/hw/hw8/images/Down.png" width="15px" height="20px">'
                    );
                    $("#change-and-percent").css({'color':'red'});

                }

                $("#open").html(jsonObj["basic info"]["open"]);
                $("#close").html(jsonObj["basic info"]["close"]);
                $("#volume").html(jsonObj["basic info"]["volume"]);
                $("#range").html(jsonObj["basic info"]["day's range"]);

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

        if(ajaxCallNum==9) {
            if(error=={}) { //no error show results
                $("#symbol").html("test");
                // jsonObj["basic info"]["symbol"]
            }
        }
        return false;

    });
});

// draw price and volume charts
function priceAndVolume()
{

    var arrayDate=[];
    var arrayClose=[];
    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }
    for(num in jsonObj["basic info"]["arrayPrice"]) {
        arrayClose.push(jsonObj["basic info"]["arrayPrice"][num]);
    }

    arrayClose = arrayClose.map(Number);
    var maxClose = Math.max.apply(null,arrayClose);
    var minClose = Math.min.apply(null,arrayClose);


    var arrayVolume =[];
    for(num in jsonObj["basic info"]["arrayVolume"]) {
        arrayVolume.push(jsonObj["basic info"]["arrayVolume"][num]);
    }

    arrayVolume = arrayVolume.map(Number);
    var maxVolume = Math.max.apply(null,arrayVolume);

    var symbol = jsonObj["basic info"]["symbol"];
    var timeStamp = jsonObj["basic info"]["time stamp"];

    var chart= new Highcharts.chart('indicator-chart', {
        chart: {
            zoomType: 'xy',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: symbol+" Stock Price and Volume"
        },
        subtitle: {
            text: '<a href="https://www.alphavantage.co/" >Source: Alpha Vantage </a>',
            useHTML: true

        },
        xAxis: [{

            categories: arrayDate,
            minTickInterval: 5

        }],
        yAxis: [{ // Primary yAxis
            labels: {

                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            min: minClose-2,
            max: maxClose+2,
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'Stock Price',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {

                text: 'Volume',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            max: maxVolume*5,
            // tickInterval: 2,
            labels: {

                formatter: function (){
                    return this.value/1000000 + 'M';
                },

                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },

            opposite: true
        }],

        legend: {
            //layout: 'vertical',
            align: 'center',
            //x: -5,
            verticalAlign: 'bottom',
            //y: 250,
            //reversed: true,
            //floating: false,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: symbol+' Volume',
            type: 'column',
            yAxis: 1,
            color: '#FFFFFF',
            zIndex: 2,
            data: arrayVolume,
            // pointWidth: 1


        }
            , {
                name: symbol+" ",
                type: 'area',

                color: '#D6391F',
                fillOpacity: 0.6,
                lineWidth: 1,
                data: arrayClose,
                zIndex: 1,
                tooltip: {
                    valueDecimals: 2
                }

            }]
    });
}







