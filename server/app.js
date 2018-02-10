const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/index.js');
const methodOverride = require("method-override");


//biar request yang dikirim kebaca sama si server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//biar ada yang akses api bisa akses dengan berbagai method
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
});


//semua request masuk sini dulu
app.use(function(req, res, next) {
  console.log(req.url + " /" + req.method);
  next();
});


//biar ada req masuk ke index.js juga
app.use("/", routes);


//error handler middleware-1
//tangkap not found request, teruskan ke middleware-2
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

//error handler middleware-2
//tangkap not found request dari middleware-1, keluarkan di halaman error
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: "Error",
    status: err.status
  	});
  console.log(res.statusCode);
});


//buat port server biar listen di 3000
const port = process.env.port || 3000;
app.listen(port, () => {
	console.log("SERVER, is running on 127.0.0.1:" + port);
})