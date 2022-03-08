<template>
     <div>
        <!--         头部区域-->
        <app-header></app-header>
        <!--        左侧导航栏-->
        <app-nav></app-nav>
        <!--        主体区域-->
        <app-main></app-main>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from '../../components/AppHeader/index.vue'
import AppNav from '../../components/AppNavSide/index.vue'
import AppMain from '../../components/AppMain/index.vue'
export default defineComponent({
    name:'Index',
    components:{
        AppHeader,
        AppMain,
        AppNav
    },
    setup(){
        return{

        }
    }
})
</script>
<style lang="scss" scoped>
body{
    margin:0 !important;
}
</style>