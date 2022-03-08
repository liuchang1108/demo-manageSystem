import request from '../utils/request'
export default{
    // 分页查询
    search(page: any,size: any,searchMap: any){
        return request({
            url:'/student/list',
            method:'post',
            data:{
                page,
                size,
                searchMap
            }
        })
    },
    // 新增学生
    add(student: any){
        return request({
            url:'/students',
            method:'post',
            data:student
        })
    },
    // 根据id 查询导师
    getById(id: any){
        return request({
            url:`/students?id=${id}`,
            method:'get'
        })
    },
    // 根据id修改导师信息
    update(teacher: any){
        return request({
            url:'/students',
            method:'put',
            data:teacher
        })
    },
    deleteById(id: any){
        return request({
            url:'/students',
            method:'delete',
            data:{
                id:id
            }
        })
    }
}