const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demoPro',{ useNewUrlParser: true });
//定义一个规则对象
var Schema=mongoose.Schema;
var userSchema=new Schema({
    username:{
        required:true,
        type:String
    },
    nickname:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    token:{
        required:true,
        type:String
    }
})
module.exports= mongoose.model('company', userSchema);
