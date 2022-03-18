<template>
  <div class="homeVue">
     <div class="homeVue-title">
    <h2 class="homeVue-title__text">Hi，欢迎使用实习生入职管理系统!</h2> 
    </div> 
     <div class="homeVue-mainTools">
    <el-space wrap :size="size">
      <el-card
        v-for="(item, index) in ToolsData"
        :key="index"
        class="main-tools__boxCard"
        shadow="hover"
      >
        <div class="main-tools__cardContent">
            <h3>{{ item.title }}</h3>
            <span class="main-tools__IntroText"><el-icon><edit-pen /></el-icon>  简介：</span>
            <span>{{ item.content }}</span>
            <p class="main-tools__EnterLink"  @click="clickCardHandler(index)">
              进入 <el-icon><d-arrow-right /></el-icon>
            </p>
        </div>
      </el-card>
    </el-space>
  </div>
   
   
</div>
    
 
</template>
<script lang="ts">
import { defineComponent,ref } from "vue";
import { useRoute,useRouter } from "vue-router";
import {
  DArrowRight,
  EditPen
} from "@element-plus/icons-vue";
export default defineComponent({
    name:'HomeVue',
    components:{
        DArrowRight,
        EditPen
    },
    setup(){
         const size = ref(10);
         const ToolsData=([
             {
                 title:'导师信息管理',
                 content:'在这里你可以进行导师信息的录入以及查询、更改和删除数据等操作，可以分配给导师实习学员..'
             },{
                 title:'实习生入职管理',
                 content:'在这里你可以进行实习生入职信息的录入以及查询、更改和删除数据等操作，还可以对实习生的导师进行分配...'
             }
         ])
         const route=useRoute();
         const router=useRouter();
         const clickCardHandler=(index:number)=>{
           if(index===0){
               router.push('/teacher')
           }else if(index===1){
               router.push('/student')
           }
         }
         return{
             size,
             ToolsData,
            clickCardHandler
         }
    }
})
</script>
<style lang="scss" scoped>
.homeVue{
    margin-top:20px;
     font-family: "黑体";
     font-weight: 500;
     line-height: 30px;
}
.homeVue-title{
    background-color: #247fff;
    color: #fff;
    border-radius: 5px;
    width: 1185px;
    height: 180px;
    display: flex;
    &__text{
        margin-left: 20px;
        line-height: 60px;
    }
}
.homeVue-mainTools{
   width: 100%;
}
.main-tools__boxCard{
    width: 440px;
    height: 250px;
    display: flex;
    margin-top:80px;
    margin-right:0;
    color:rgb(56, 53, 53)
}
::v-deep .el-space__item:nth-child(2n+1) {
  margin-right: 180px !important;
  margin-left:35px;
}
.main-tools__EnterLink{
    margin-left: 340px;
    display: flex;
    // justify-content: center;
    align-items: center;
     cursor: pointer;
     color:#247fff
}
.main-tools__IntroText{
    display: flex;
    align-items: center;
}
</style>