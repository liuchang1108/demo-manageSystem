var express=require("express");
var bodyParser=require("body-parser");
var path=require("path");
const router = require("./router");
var app=express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/node_modules/",express.static(path.join(__dirname,"./node_modules")));
app.use(router);
app.listen(3000,function(){
    console.log("running...");
})