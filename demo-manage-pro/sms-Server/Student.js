const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demoPro');
// 规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    // 工号
    jobNumber:{
        type:String,
       required:true
    },
    // 姓名
    name:{
        type:String,
        required:true
    },
    // 入职时间
    enterDate:{
        type:String,

    },
    // 电话号码
    phoneNumber:{
        type:String,
    },
    // 导师
    mentor:{
        type:String,

    },
    // 所在部门
    department:{
        type:String,

    },
    //答辩时间
    testDate:{
        type:String,

    }
 })
module.exports = mongoose.model('Student',userSchema);

