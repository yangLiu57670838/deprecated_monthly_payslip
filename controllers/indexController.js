var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    moment = require('moment'),
    json2csv = require('json2csv');

app.post('/createCSV', function (req, res) {
    var finalJsonArray = req.query.finalJsonArray;
    var data = JSON.parse(finalJsonArray);
    var time = moment().format('MMMMDo_hmmss');//create unique csv file with time
    var filePath = 'files/' + time + '.csv';
    console.log(data);
    var fields = ['name', 'payPeriod', 'grossIncome', 'incomeTax', 'netIncome', 'super'];
    
    json2csv({ data: data, fields: fields }, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile(filePath, csv, function(err) {
            if (err) throw err;
            console.log('file saved');
            res.end(filePath);
        });
    });
});