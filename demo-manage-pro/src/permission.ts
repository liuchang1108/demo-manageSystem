import router from "./router";
import {getUserInfo} from './api/login'
router.beforeEach((to,from,next)=>{
    const token=localStorage.getItem("demoPro-token");
    if(!token){
        if(to.path==="/login"){
            next();
        }
        else if(to.path==="/register"){
            next();
        }
        else {
            next({path:'/login'})
        }
    }
    else {
        if(to.path==='/login'){
            next();
        }
        else if(to.path==='/register'){
            next();
        }else {
            const userInfo=localStorage.getItem("demoPro-user")
            if(userInfo){
                next();
            }else {
                getUserInfo(token).then((response: { data: any; })=>{
                    const resp=response.data;
                    if(resp.flag){
                        localStorage.setItem('demoPro-user',JSON.stringify(resp.data))
                    }
                    else {
                        next({path:'/login'})
                    }

                })
            }
        }
    }
})