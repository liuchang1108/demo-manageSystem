<template>
  <div class="appHeader">
    <a href="#" class="appHeader-title">
      <span>实习生入职管理系统</span>
    </a>

    <div class="appHeader-dropdown">
       <el-menu
    :default-active="route.path"
    class="appHeader-menu"
    mode="horizontal"
    router="true"
     background-color="#01162b"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/level">评级</el-menu-item>
  </el-menu>
      <el-button type="text" @click="helpPage = true" class="appHeader-help"
        >帮助</el-button
      >
      <el-drawer
        v-model="helpPage"
        title="帮助"
        direction="rtl"
        size="35%"
        class="appHeader-helpPage"
      >
        <div class="homeVue-text">
          <span
            >1.项目介绍：共包含两个管理子模块和一个评级子模块，分别是导师信息管理、实习生入职管理和实习生等级评选(答辩后通过与否和等级评价)</span
          >
           <el-divider border-style="dashed"></el-divider>
          <span
            >2.涉及技术：html+scss+vue3.0+typescript+node.js+element-plus+mongodb</span
          >
            <el-divider border-style="dashed"></el-divider>
          <span>3.构建项目工具：vite</span>
            <el-divider border-style="dashed"></el-divider>
          <span
            >4.包含功能：新增员工、设置导师、查询员工、更改员工信息、删除员工信息、修改密码、评答辩等级等基础功能</span
          >
            <el-divider border-style="dashed"></el-divider>
          <span>5.github账号:liuchang1108</span>
            <el-divider border-style="dashed"></el-divider>
          <span>6.学号：1914010815</span>
            <el-divider border-style="dashed"></el-divider>
          <span>7.专业班级姓名：软件19-8班刘畅</span>
            <el-divider border-style="dashed"></el-divider>
        </div>
      </el-drawer>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ user.nickname
          }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">修改密码</el-dropdown-item>
            <el-dropdown-item command="b">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="appHeader-avatar">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
      </div>
    </div>
    <!-- 修改密码弹窗-->
    <el-dialog
      title="修改密码"
      v-model="dialogVisible"
      width="400px"
      class="appHeader-dialog"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleFormRef"
        label-width="80px"
        class="appHeader-changePass"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="appHeader-dialog__button">
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >提交</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from "vue";
import { logout } from "../../api/login";
import passwordApi from "../../api/password";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessageBox } from "element-plus";
import type { ElDrawer } from "element-plus";

type FormInstance = InstanceType<typeof ElForm>;
const ruleFormRef = ref<FormInstance>();

export default defineComponent({
  name: "AppHeader",
  components: {
    ArrowDown,
  },
  setup() {
    let timer = ref();

    const helpPage = ref(false);
    const drawerRef = ref<InstanceType<typeof ElDrawer>>();
    const onClick = () => {
      drawerRef.value!.close();
    };

    const router = useRouter();
    const route = useRoute();
    const validateOldPass = (rule: any, value: any, callback: any) => {
      passwordApi.checkPwd(user.id, value).then((response: { data: any }) => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    const validatePass = (rule: any, value: any, callback: any) => {
      console.log(ruleForm);
      if (value != ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const user = JSON.parse(localStorage.getItem("demoPro-user") || "0");
    const ruleForm = reactive({
      oldPass: "",
      pass: "",
      checkPass: "",
    });
    const dialogVisible = ref(false);

    const rules = reactive({
      oldPass: [
        {
          required: true,
          validator: validateOldPass,
          message: " ",
          trigger: "blur",
        },
      ],
      pass: [
        {
          required: true,
          message: "新密码不能为空",
          trigger: "blur",
        },
      ],
      checkPass: [
        {
          required: true,
          message: "确认密码不能为空",
          trigger: "blur",
        },
        {
          validator: validatePass,
          trigger: "change",
        },
      ],
    });
    const handleCommand = (command: string | number | object) => {
      switch (command) {
        case "a":
          handlePwd();
          break;
        case "b":
          handleLogout();
          break;
        default:
          break;
      }
    };
    const handlePwd = () => {
      dialogVisible.value = true;
      nextTick(() => {
        resetForm(ruleFormRef.value);
      });
    };
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          passwordApi
            .updatePwd(user.id, ruleForm.checkPass)
            .then((response) => {
              const resp = response.data;
              ElMessage({
                message: resp.message,
                type: resp.flag ? "success" : "warning",
              });
              if (resp.flag) {
                handleLogout();
                dialogVisible.value = false;
              }
            });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    const handleLogout = () => {
      logout(localStorage.getItem("demoPro-token")).then(
        (response: { data: any }) => {
          const resp = response.data;
          if (resp.flag) {
            localStorage.removeItem("demoPro-token");
            localStorage.removeItem("demoPro-user");
            router.push("/");
          } else {
            ElMessage({
              message: resp.message,
              type: "warning",
            });
          }
        }
      );
    };
    const toHelpPage = () => {
      router.push("/help");
    };
    return {
      handleCommand,
      submitForm,
      resetForm,
      handleLogout,
      rules,
      ruleForm,
      dialogVisible,
      ruleFormRef,
      user,
      route,
      helpPage,
      toHelpPage
    };
  },
});
</script>
<style lang="scss" scoped>
.appHeader {
  width: 100%;
  height: 70px;
  background-color: #01162b;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.appHeader-title {
  color: #fff;
  font-size: 19px;
  text-decoration: none;
  margin-left: 25px;
  font-weight: 400;
  font-family: "黑体";
}
.appHeader-dropdown {
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -3px;
  font-size: 13px !important;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.appHeader-changePass {
  width: 320px;
  .el-form-item {
    margin-left: 20px;
  }
}
.el-form-item--default .el-form-item__content {
  margin-left: 20px !important;
}
.appHeader-dialog {
  height: 100px !important;
}
.appHeader-dialog__button {
  margin-top: 8px;
  margin-bottom: -40px;
  margin-left: 88px;
}
.appHeader-help {
  margin-right: 56px;
  margin-top: 2px;
  color: #fff;
  line-height: 0 !important;
}
.el-button {
  font-size: 14px !important;
}
.appHeader-menu {
  width: 152px;
font-size: 14px;
margin-left:200px;
line-height: 0 !important;
  .el-menu--horizontal {
    border-bottom: none !important;
  }
  .el-menu-item {
    padding: 0 30px;
    height: 68px;
    margin-top:5px;
    margin-left:20px;
  }
}
.appHeader-avatar {
  margin-left: 7px;
  margin-top: 8px;
}
.homeVue-text {
  font-size: 18px;
  font-family: "华文中宋";
}
</style>
