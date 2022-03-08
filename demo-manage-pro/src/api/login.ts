import request from "../utils/request";

//注册
export function register(username: any,nickname: any,password: any) {
    return request({
        method:"post",
        url:"/user/register",
        data:{
            username,//等价于username:username
            nickname,
            password
        }
    })
}

//登录
export function login(username: any,password: any) {
    return request({
        method:'post',
        url:'/user/login',
        data:{
            username,
            password
        }
    })
}
//获取用户信息
export function getUserInfo(token: any) {
    return request({
        method:'get',
        url:`/user/info?token=${token}`
    })
}
//退出登录
export function logout(token: any) {
   return request({
       url:'/user/logout',
       method:'post',
       data:{
           token
       }
   })
}