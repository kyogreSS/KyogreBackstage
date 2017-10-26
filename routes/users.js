var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
	//res.send('respond with a resource');
	console.log("req", req.data)
	res.send({aaa: "fsasd"})
});



router.post('/', function (req, res, next) {
	console.log("req",req.body)
	res.send([1,2,3])


})

module.exports = router;
