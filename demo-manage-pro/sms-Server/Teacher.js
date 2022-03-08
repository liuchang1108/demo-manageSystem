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
    // 部门
    department:{
        type:String,
        required:true
    },
    // 实习学员
    departmentStu:{
        type:String,
    },
    // 电话号码
    phoneNumber:{
        type:String,
    },
})
module.exports = mongoose.model('Teacher',userSchema);

