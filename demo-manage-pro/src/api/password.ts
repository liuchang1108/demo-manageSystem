import request from "../utils/request";
export default {
    checkPwd(userId: any,password: any) {
        return request({
            url:'/user/pwd',
            method:'post',
            data:{
                userId,
                password
            }
        })
    },
    updatePwd(userId: any,password: any){
        return request({
            url:'/user/pwd',
            method:'put',
            data:{
                userId,
                password
            }
        })
    }
}