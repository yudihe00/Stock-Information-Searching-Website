var jsonObj = {};
var ajaxCallNum = 0;
var error = {};
var phpUrlOrig = "http://localhost/hw8-2/php/multiAjax.php";
var phpUrl = phpUrlOrig;
var symbol;
var arrayIndicatorName=["PRICE","SMA","EMA","STOCH","RSI","ADX","CCI","BBANDS","MACD"];
// var phpUrl = "http://localhost/hw8-2/php/multiAjax.php";
// var phpUrl = "php/multiAjax.php";
// set initial value to 0
function initStat() {
    jsonObj = {};
    ajaxCallNum = 0;
    error = {};
    phpUrl = phpUrlOrig;
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

function drawCharts(functionName){
    switch (functionName) {
        case 'PRICE': priceAndVolume(); break;
        case 'SMA': SMAcharts();break;
        case 'EMA': EMAcharts();break;
        case 'RSI': RSIcharts();break;
        case 'ADX': ADXcharts();break;
        case 'CCI': CCIcharts();break;
        case 'STOCH': STOCHcharts();break;
        case 'BBANDS': BBANDScharts();break;
        case 'MACD': MACDcharts(); break;
    }
}

function showErrors(functionName){
    if (functionName=='PRICE') {
        $("#price-chart").html(
            "<div style='height:40px; background-color: #ffb7a3;margin-top:20px'>" +
            "<p style='padding-top: 10px;padding-left: 10px'>Error!Failed to get price data</p></div>"
        );
        $("#stock-detail-table").html(
            "<div style='height:40px; background-color: #ffb7a3;margin-top:20px'>" +
            "<p style='padding-top: 10px;padding-left: 10px'>Error!Failed to get current stock data</p></div>"
        );
    } else {
        functionName=functionName.toLowerCase();
        $("#"+functionName+"-chart").html(
            "<div style='height:40px; background-color: #ffb7a3;margin-top:20px'>" +
            "<p style='padding-top: 10px;padding-left: 10px'>Error!Failed to get "+functionName+ " data</p></div>"
        );

    }
}


// check if all jquery is done
function checkAllJqueryDone() {
    if (ajaxCallNum == 9) {

        for (var num in arrayIndicatorName) {
            var name=arrayIndicatorName[num];
            if(error.hasOwnProperty(name)){
                showErrors(name);
            } else {
                drawCharts(name);
            }
        }

    }

}

// function draw progress bar
function drawProgress(){

    // draw all indivator progress bar, including price
    for (var i=0; i<arrayIndicatorName.length; i++) {
        $("#"+arrayIndicatorName[i].toLowerCase()+"-chart").html(
            "<div class=\"progress\">\n" +
            "    <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:60%\"></div>\n" +
            "  </div>"
        );
    }

    // draw detail table progress bar, need to redraw table later
    $("#stock-detail-table-div").html(
        "<div class=\"progress\">\n" +
        "    <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:60%\"></div>\n" +
        "  </div>"
    );

    // draw progress bar for histrorical and news sections
    $("#historical-charts-container").html(
        "<div class=\"progress\">\n" +
        "    <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:60%\"></div>\n" +
        "  </div>"
    );

    $("#news-item-div").html(
        "<div class=\"progress\">\n" +
        "    <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:60%\"></div>\n" +
        "  </div>"
    );


}


// redraw news item div
function redrawNewsItemDiv() {
    $("#news-item-div").html(
        "<div id=\"news1\"class=\"col-md-12 col-xs-12 col-sm-12\"></div>\n" +
        "            <div id=\"news2\"class=\"col-md-12 col-xs-12 col-sm-12\"></div>\n" +
        "            <div id=\"news3\"class=\"col-md-12 col-xs-12 col-sm-12\"></div>\n" +
        "            <div id=\"news4\"class=\"col-md-12 col-xs-12 col-sm-12\"></div>\n" +
        "            <div id=\"news5\"class=\"col-md-12 col-xs-12 col-sm-12\"></div>"
    );
}

// redrawDetailTable after ajax call for derail info
// because progress bar has change the html for #stock-detail-table
function redrawDetailTable(){
    $("#stock-detail-table-div").html(
        "<table class=\"table table-striped\" id=\"stock-detail-table\" style=\"margin-top: 10px\">\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Stock Ticker Symbol</th>\n" +
        "                  <td id=\"symbol\"></td>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Last Price</th>\n" +
        "                  <td id=\"last-price\"></td>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Change(Change Percent)</th>\n" +
        "                  <td id=\"change-and-percent\"></td>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Timestamp</th>\n" +
        "                  <td id=\"timestamp\"></td>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Open</th>\n" +
        "                  <td id=\"open\"></td>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Close</th>\n" +
        "                  <td id=\"close\"></td>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Day's Range</th>\n" +
        "                  <td id=\"range\"></td>\n" +
        "                </tr>\n" +
        "                <tr>\n" +
        "                  <th class=\"col-md-6\">Volume</th>\n" +
        "                  <td id=\"volume\"></td>\n" +
        "                </tr>\n" +
        "\n" +
        "              </table>"
    );
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
            drawCharts(functionName);
            checkAllJqueryDone();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(functionName + " data " + XMLHttpRequest.readyState + "\n" + XMLHttpRequest.status + "\n" + errorThrown);

            //showErrors(functionName);

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


        // draw progress bar before ajax complete
        drawProgress();

        // use get basic data and daily data
        var data = {
            "action": "getStockData" // set "action" which will be tranfer to php
        };
        data = $(this).serialize() + "&" + $.param(data);
        var dataSave = data; // save for later use
        //serialize every data with & eg: Favorite beverage=coke&favorite_restaurant=df&...&action=test
        $.ajax({
            type: "GET",
            dataType: "json", // dataType send back
            url: phpUrl,
            data: data,  // data send to server
            success: function (data) {
                redrawDetailTable();
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

                drawCharts("PRICE");

                // use get SMA data
                jqueryGetData("SMA", dataSave);

                // use get EMA data
                jqueryGetData("EMA", dataSave);

                // use get RSI data
                jqueryGetData("RSI", dataSave);

                // use get ADX data
                jqueryGetData("ADX", dataSave);

                // use get CCI data
                jqueryGetData("CCI", dataSave);

                // use get BBANDS data
                jqueryGetData("BBANDS", dataSave);

                // use get MCAD data
                jqueryGetData("MACD", dataSave);

                // use get STOCH data
                jqueryGetData("STOCH", dataSave);

                // draw histrory charts
                drawHisCharts(jsonObj["basic info"]["symbol"]);

                // show news
                showNews(jsonObj["basic info"]["symbol"]);

                checkAllJqueryDone();


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("detail data " + XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
                //saveError("Current stock");
                saveError("PRICE");
                ajaxCallNum++;
                showErrors("PRICE");
                showErrors("SMA");
                for (i=0; i<arrayIndicatorName.length; i++) {
                    showErrors(arrayIndicatorName[i]);
                }
            }
        });





        return false;

    });
});

// draw price and volume charts
function priceAndVolume() {
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

    var chart= new Highcharts.chart('price-chart', {
        chart: {
            zoomType: 'x',
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
            align: 'center',
            verticalAlign: 'bottom',
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

// SMAcharts, one line
function SMAcharts() {
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }


    for(num in jsonObj["SMA"]["SMA"]) {
        arraySma.push(jsonObj["SMA"]["SMA"][num]);
    }
    arraySma = arraySma.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var chart= new Highcharts.chart('sma-chart', {
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: 'Simple Moving Average (SMA)' //change
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
            min: minSma,
            max: maxSma,
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'SMA',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
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
            name: symbol+" ",
            type: 'line',
            color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1
        }]
    });
}


// EMAcharts, one line
function EMAcharts() {
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }


    for(num in jsonObj["EMA"]["EMA"]) {
        arraySma.push(jsonObj["EMA"]["EMA"][num]);
    }
    arraySma = arraySma.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var chart= new Highcharts.chart('ema-chart', {
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: 'Exponential Moving Average (EMA)' //change
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
            min: minSma,
            max: maxSma,
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'EMA',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
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
            name: symbol+" ",
            type: 'line',
            color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1
        }]
    });
}

// RSIcharts, one line
function RSIcharts() {  //change
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }


    for(num in jsonObj["RSI"]["RSI"]) { //change
        arraySma.push(jsonObj["RSI"]["RSI"][num]); //change
    }
    arraySma = arraySma.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var chart= new Highcharts.chart('rsi-chart', { //change
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: 'Relative Strength Index (RSI)' //change
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
            min: minSma,
            max: maxSma,
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'RSI',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
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
            name: symbol+" ",
            type: 'line',
            color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1
        }]
    });
}

// ADXcharts, one line
function ADXcharts() {  //change
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }


    for(num in jsonObj["ADX"]["ADX"]) { //change
        arraySma.push(jsonObj["ADX"]["ADX"][num]); //change
    }
    arraySma = arraySma.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var chart= new Highcharts.chart('adx-chart', { //change
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: 'Average Directional Movement Index (ADX)' //change
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
            min: minSma,
            max: maxSma,
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'ADX',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
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
            name: symbol+" ",
            type: 'line',
            color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1
        }]
    });
}

// CCIcharts, one line
function CCIcharts() {  //change
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }


    for(num in jsonObj["CCI"]["CCI"]) { //change
        arraySma.push(jsonObj["CCI"]["CCI"][num]); //change
    }
    arraySma = arraySma.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var chart= new Highcharts.chart('cci-chart', { //change
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: 'Commodity Channel Index (CCI)' //change
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
            min: minSma,
            max: maxSma,
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'CCI',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
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
            name: symbol+" ",
            type: 'line',
            color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1
        }]
    });
}

// STOCH charts, two lines
function STOCHcharts() {
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    var arrayK=[];

    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }

    for(num in jsonObj["STOCH"]["STOCH"]["SlowD"]) { //change
        arraySma.push(jsonObj["STOCH"]["STOCH"]["SlowD"][num]); //change
    }
    arraySma = arraySma.map(Number);

    for(num in jsonObj["STOCH"]["STOCH"]["SlowK"]) { //change
        arrayK.push(jsonObj["STOCH"]["STOCH"]["SlowK"][num]); //change
    }
    arrayK = arrayK.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var maxK = Math.max.apply(null,arrayK);
    var minK = Math.min.apply(null,arrayK);


    // var minY = Math.min(minSma,minK),
    // var maxY = Math.max(maxSma,maxK),

    var chart= new Highcharts.chart('stoch-chart', { //change
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: "Stochastic Oscillator (STOCH)" //change
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
            min: Math.min(minSma,minK),
            max: Math.max(maxSma,maxK),
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'STOCH',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }],

        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: symbol+" SlowD",
            type: 'line',
            // color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1

        }
            ,{
                name: symbol+" SlowK",
                type: 'line',
                color: '#D6391F',
                fillOpacity: 0.6,
                lineWidth: 1,
                marker: {
                    radius: 2
                },
                data: arrayK,
                zIndex: 2

            }


        ]
    });
}

// BBANDS charts, three lines
function BBANDScharts() {
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    var arrayK=[];
    var arrayUpper = [];

    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }
    var indicatorName="BBANDS";

    for(num in jsonObj[indicatorName][indicatorName]["Real Middle Band"]) { //change
        arraySma.push(jsonObj[indicatorName][indicatorName]["Real Middle Band"][num]); //change
    }
    arraySma = arraySma.map(Number);

    for(num in jsonObj[indicatorName][indicatorName]["Real Lower Band"]) { //change
        arrayK.push(jsonObj[indicatorName][indicatorName]["Real Lower Band"][num]); //change
    }
    arrayK = arrayK.map(Number);

    for(num in jsonObj[indicatorName][indicatorName]["Real Upper Band"]) { //change
        arrayUpper.push(jsonObj[indicatorName][indicatorName]["Real Upper Band"][num]); //change
    }
    arrayUpper = arrayUpper.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var maxK = Math.max.apply(null,arrayK);
    var minK = Math.min.apply(null,arrayK);

    var maxUpper = Math.max.apply(null,arrayUpper);
    var minUpper = Math.min.apply(null,arrayUpper);

    var chart= new Highcharts.chart('bbands-chart', { //change
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: "Bollinger Bands (BBANDS)" //change
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
            min: minK,              //change
            max: maxUpper,          //change
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'BBANDS',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }],

        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: symbol+" Real Middle Band",
            type: 'line',
            color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1

        }
            ,{
                name: symbol+" Real Lower Band",
                type: 'line',
                // color: '#D6391F',
                fillOpacity: 0.6,
                lineWidth: 1,
                marker: {
                    radius: 2
                },
                data: arrayK,
                zIndex: 2

            }

            ,{
                name: symbol+" Real Upper Band",
                type: 'line',
                // color: '#D6391F',
                fillOpacity: 0.6,
                lineWidth: 1,
                marker: {
                    radius: 2
                },
                data: arrayUpper,
                zIndex: 3


            }


        ]
    });
}

// MACD charts, three lines
function MACDcharts() {
    var symbol = jsonObj["basic info"]["symbol"];

    var arrayDate=[];
    var arraySma=[];
    var arrayK=[];
    var arrayUpper = [];

    for(num in jsonObj["basic info"]["arrayDate"]) {
        arrayDate.push(jsonObj["basic info"]["arrayDate"][num]);
    }
    var indicatorName="MACD"; //change

    for(num in jsonObj[indicatorName][indicatorName]["MACD_Signal"]) { //change
        arraySma.push(jsonObj[indicatorName][indicatorName]["MACD_Signal"][num]); //change
    }
    arraySma = arraySma.map(Number);

    for(num in jsonObj[indicatorName][indicatorName]["MACD_Hist"]) { //change
        arrayK.push(jsonObj[indicatorName][indicatorName]["MACD_Hist"][num]); //change
    }
    arrayK = arrayK.map(Number);

    for(num in jsonObj[indicatorName][indicatorName]["MACD"]) { //change
        arrayUpper.push(jsonObj[indicatorName][indicatorName]["MACD"][num]); //change
    }
    arrayUpper = arrayUpper.map(Number);

    var maxSma = Math.max.apply(null,arraySma);
    var minSma = Math.min.apply(null,arraySma);

    var maxK = Math.max.apply(null,arrayK);
    var minK = Math.min.apply(null,arrayK);

    var maxUpper = Math.max.apply(null,arrayUpper);
    var minUpper = Math.min.apply(null,arrayUpper);

    var chart= new Highcharts.chart('macd-chart', { //change
        chart: {
            zoomType: 'x',
            borderWidth: 1,
            borderColor: '#D6D6D6',
            marginBottom: 100 //put legend at bottom
            // alignTicks: false
        },
        title: {
            text: "Moving Average Convergence/Divergence (MACD)" //change
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
            min: minK,              //change
            max: maxUpper,          //change
            // startOnTick: false,
            // tickInterval: 2,
            title: {
                text: 'MACD',   // change
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }],

        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: symbol+" MACD_Signal",
            type: 'line',
            color: '#D6391F',
            fillOpacity: 0.6,
            lineWidth: 1,
            marker: {
                radius: 2
            },
            data: arraySma,
            zIndex: 1

        }
            ,{
                name: symbol+" MACD_Hist",
                type: 'line',
                // color: '#D6391F',
                fillOpacity: 0.6,
                lineWidth: 1,
                marker: {
                    radius: 2
                },
                data: arrayK,
                zIndex: 2

            }

            ,{
                name: symbol+" MACD",
                type: 'line',
                // color: '#D6391F',
                fillOpacity: 0.6,
                lineWidth: 1,
                marker: {
                    radius: 2
                },
                data: arrayUpper,
                zIndex: 3


            }


        ]
    });
}

// draw history chart
function drawHisCharts(symbol) {
    var hisData = [];
//        var symbol = 'FB';
    phpUrl = phpUrl+"?input=";
    phpUrl = phpUrl + symbol;
    $.getJSON(phpUrl, function (data) {
        // data format
        for (var num in data["arrayDate"]) {
            var temp = [];
            temp.push(data["arrayDate"][num] * 1000);
            price = Number(data["arrayPrice"][num]);
            temp.push(price);
            hisData[num] = temp;
        }
        //var width= $("#historical-charts-container").width();
        // Create the chart
        Highcharts.stockChart('historical-charts-container', { //change

            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [
                    {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'ytd',
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                buttonTheme: {
                    width: 30
                },
                selected: 0
            },

            title: {
                text: symbol + ' Stock Price'
            },
            subtitle: {
                text: '<a href="https://www.alphavantage.co/" >Source: Alpha Vantage </a>',
                useHTML: true

            },
            tooltip: {
                split: false,
                xDateFormat: '%A, %b %d, %Y',
            },

            series: [{
                name: symbol,
                data: hisData,
                type:'area',
                tooltip: {
                    valueDecimals: 2
                }
            }],
            responsive:{
                rules:[{
                    condition:{
                        maxWidth:410
                    },
                    chartOptions:{
                        rangeSelector: {
                            allButtonsEnabled: true,
                            buttons: [
                                 {
                                    type: 'month',
                                    count: 1,
                                    text: '1m'
                                }, {
                                    type: 'month',
                                    count: 3,
                                    text: '3m'
                                }, {
                                    type: 'month',
                                    count: 6,
                                    text: '6m'
                                }, {
                                    type: 'year',
                                    count: 1,
                                    text: '1y'
                                }, {
                                    type: 'all',
                                    text: 'All'
                                }],
                            buttonTheme: {
                                width: 30
                            },
                            selected: 0
                        },

                    }
                }]
            }
        });
    });

}

// show news
function showNews(symbol) {
    phpUrl=phpUrlOrig;
    phpUrl = phpUrl+"?newssymbol=";
    phpUrl = phpUrl + symbol;
    $.getJSON(phpUrl, function (data) {

        redrawNewsItemDiv();
        // data format
        for (var i in data) {
            var number=Number(i)+1;
            var newsDivId="#news"+number.toString();
            $(newsDivId).html(
//                "<a href=\""+arrayNews[i]["link"]+"\">"+arrayNews[i]['title']+
//                "</a>&nbsp&nbsp&nbsp&nbsp&nbsp " +
//                "Publicated&nbspTime:&nbsp"+arrayNews[i]['pubDate']+"</td></tr>"
                "<h4 style='font-weight: bold'><a href="+data[i]['link']+" target='_blank' style='text-decoration: none'>"+data[i]['title']+"</a></h4><span>Author: "
                +data[i]['author_name']+"</br>Date: "+data[i]['pubDate']+"</br></span>"

            );
            $(newsDivId).css(
                {
                    //width
                    'border-radius': '5px',
                    'height':'120px',
                    'background-color':'#efefef',
                    'padding':'10px',
                    'margin-top':'10px',
                    'margin-down':'10px'
                }
            )
        }
    });
}





