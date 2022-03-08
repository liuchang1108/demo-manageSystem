<template>
  <div class="appMain">
    <AppBreadCrumb></AppBreadCrumb>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppBreadCrumb from "./breadcrumb.vue";
export default defineComponent({
  name: "AppMain",
  components: {
    AppBreadCrumb,
  },
  setup() {
    const route = useRoute();
    return {
      route,
    };
  },
});
</script>
<style lang="scss" scoped>
.appMain{
    color: black;
        position: absolute;
        top: 80px;
        right: 0;
        left: 240px;
        bottom: 0;
        overflow-y: auto;
}
</style>