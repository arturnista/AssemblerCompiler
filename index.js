var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var compiler = require('./controllers/compiler.js');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/compiler', function (req, res) {
    compiler.compile(req.body.code, function(result){
        res.send(result);
    });
});

app.listen((process.env.PORT || 5000), function () {
  console.log('Example app listening on port ' + (process.env.PORT || 5000) + '!');
});

