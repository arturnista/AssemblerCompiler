var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var compiler = require('./controllers/compiler/core.js');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/about', function (req, res) {
    res.render('about.html');
});

app.get('/samplecode', function (req, res) {
    var txt = {}
    txt.val = "add $s0, $s1, $s2\n" + 
               "sub $t0, $t3, $t5\n" + 
               "addi $s0, $s1, 5\n" + 
               "beq $s0, $s1, Label1\n" + 
               "addi $t0, $s3, -12\n" + 
               "lw $t2, 32($0)\n" + 
               "sw $s1, 4($t1)\n" + 
               ":Label1\n" + 
               "j 2500";
    res.send(txt);
});

app.get('/images/:image_name', function (req, res) {
    var imageName = req.params.image_name + ".png"
    res.sendFile(__dirname + "/images/" + imageName);
});

app.get('/js/:js_file', function (req, res) {
    var jsFile = req.params.js_file + ".min";
    res.sendFile(__dirname + "/js/" + jsFile);
});

app.post('/compiler', function (req, res) {
    compiler.compile(req.body.code, function(result){
        res.send(result);
    });
});

app.listen((process.env.PORT || 5000), function () {
  console.log('Example app listening on port ' + (process.env.PORT || 5000) + '!');
});

