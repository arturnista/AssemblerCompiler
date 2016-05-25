var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('index.html');
});

app.listen((process.env.PORT || 5000), function () {
  console.log('Example app listening on port ' + (process.env.PORT || 5000) + '!');
});
