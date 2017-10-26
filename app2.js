/**
 * Created by hjx on 2017/10/10.
 */
var express = require("express")
var app2 = express()
app2.get('/', function (req, res) {
	res.send("Hello , this is app2")
})

var server = app2.listen(3001, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Example app listening at http://%s:%s", host, port)
})