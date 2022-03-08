<template>
  <div class="appHeader">
    <a href="#" class="appHeader-title">
      <span>实习生入职管理系统</span>
    </a>
    <div class="appHeader-dropdown">
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
              <div  class="appHeader-dialog__button">
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

type FormInstance = InstanceType<typeof ElForm>;
const ruleFormRef = ref<FormInstance>();

export default defineComponent({
  name: "AppHeader",
  components: {
    ArrowDown,
  },
  setup() {
    const router = useRouter();
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
.appHeader-dialog__button{
    margin-top:8px;
    margin-bottom: -40px;
    margin-left: 88px;
}

</style>
