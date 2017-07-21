
var express = require("express");
var app = express();

var PORT = process.env.PORT || 8080;

app.use('/src', express.static(__dirname + '/src'));
app.use('/build', express.static(__dirname + '/build'));

/* serves main page */
app.get("/", function(req, res) {
    res.sendfile('index.html');
});

app.listen(PORT, function(){
    console.log("server start at"+PORT);
});
