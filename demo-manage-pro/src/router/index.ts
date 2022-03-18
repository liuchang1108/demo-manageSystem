import { createRouter,createWebHistory } from "vue-router";
const history = createWebHistory()

const routes = [
   {
       path:'/',
       component:()=>import('../pages/login/index.vue')
   },{
       path:'/index',
       component:()=>import('../pages/index/index.vue'),
       children:[
          {
            path:'/home',
            component:()=>import('../pages/home/index.vue'),
            meta:{
                title:'介绍'
            }
          },{
              path:'/student',
              component:()=>import('../pages/student/index.vue'),
              meta:{
                  title:'实习生入职管理'
              }
          },{
            path:'/teacher',
            component:()=>import('../pages/mentor/index.vue'),
            meta:{
                title:'导师信息管理'
            }
        },{
            path:'/level',
            component:()=>import('../pages/level/index.vue'),
            meta:{
                title:'实习生等级评选'
            }
        }
       ]
   },
   {
       path:'/register',
       component:()=>import('../pages/register/index.vue')
   }
]
const router = createRouter({
    history,
    routes
});

export default router;