<template>
  <div class="appNav">
    <el-row class="appNav-row">
      <el-col :span="12" class="appNav-col">
        <el-menu class="appNav-menu" :default-active="route.path" router="true">
          <el-menu-item index="/home">
          <el-icon><icon-introduction/></el-icon>
            <span>首页介绍</span>
          </el-menu-item>
          <el-menu-item index="/teacher">
           <el-icon><icon-mentor /></el-icon>
            <span>导师信息管理</span>
          </el-menu-item>
          <el-menu-item index="/student">
            <el-icon><icon-stu /></el-icon>
            <span>实习生入职管理</span>
          </el-menu-item>
           <el-menu-item index="/level">
           <el-icon><icon-choose /></el-icon>
            <span>实习生等级评选</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import {
  Avatar as IconMentor,
  HomeFilled as IconIntroduction,
  Reading as IconStu,
  Filter as IconChoose
} from "@element-plus/icons-vue";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "AppNavSide",
  components: {
    IconMentor,
    IconIntroduction,
    IconStu,
    IconChoose
  },
  setup() {
      const route=useRoute()
      return{
          route
      }
  },
});
</script>
<style lang="scss" scoped>
.appNav {
  position: absolute;
  width: 450px;
  top: 70px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}
.appNav-row {
  height: 100%;
}
.appNav-col {
  height: 100%;
}
.appNav-menu {
  height: 100%;
}
</style>