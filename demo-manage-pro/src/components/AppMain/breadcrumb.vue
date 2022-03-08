<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:route.path}">{{route.meta.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from '@element-plus/icons-vue'
export default defineComponent({
  name: "breadCrumb",
  components:{
  },
  setup() {
    const route = useRoute();
    return {
      route,
      ArrowRight
    };
  },
});
</script>
<style lang="scss" scoped>

</style>