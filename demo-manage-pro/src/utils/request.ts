import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";
let loadingInstance:any=null;
const open=()=>{
    if(loadingInstance===null){
        loadingInstance=ElLoading.service({
            text: '拼命加载中...',
                target: '.main',
                background: 'rgba(0,0,0,0.5)'
        })
    }
}
const close=()=>{
    if(loadingInstance!==null){
        loadingInstance.close()
    }
    loadingInstance=null;
}
const request = axios.create({
    baseURL: '/dev-api',//代表根目录
    timeout: 5000
});
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    //请求拦截
    open()
    return config;
}, function (error) {
    // Do something with request error
    close();
    return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    //响应拦截
    close()
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    close()

    return Promise.reject(error);
});
request.interceptors.response.use(response => {
    close() // 关闭加载效果
    const resp = response.data
    // 如果后台响应状态码不是 2000 , 说明后台服务有异常,统一可在此处处理
    if (resp.code !== 2000) {
        ElMessage({
            message: resp.message || '系统异常',
            type: 'warning',
            duration: 5 * 1000 // 停留时长
        })
    }
    return response
}, error => {
    close() // 关闭加载效果
    // 当请求接口出错时, 进行弹出错误提示, 如 404, 500, 请求超时
    console.log('response error', error.response.status)
    ElMessage({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error);
})
export default request;
//把对象request导出到test.hs，api就是为了封装axios对象的