<template>
  <div class="login-container">
    <el-form
      :model="loginForm"
      status-icon
      :rules="loginRules"
      ref="loginFormRef"
      label-width="70px"
      class="login-form"
    >
      <h2 class="login-title">登录</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="loginForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div class="login-button">
            <el-button type="primary"  @click="submitForm(loginFormRef)"
          >提交</el-button
        >
        <el-button @click="goRegister">注册</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref,getCurrentInstance, reactive } from "vue";
import { useRoute,useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { ElMessage } from 'element-plus'
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
import { login, getUserInfo } from "../../api/login";
export default defineComponent({
  name: "LoginVue",
  components: {},
  setup() {
    const loginForm = reactive({
      username: "",
      pass: "",
    });
    const loginRules = reactive({
      username: [{ required: true, message: "请输入账号", trigger: "blur" }],
      pass: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
    });
    const router=useRouter()
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          login(loginForm.username, loginForm.pass).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              getUserInfo(resp.data.token).then((response) => {
                const respUser = response.data;
                console.log(respUser);
                if (respUser.flag) {
                  localStorage.setItem(
                    "demoPro-user",
                    JSON.stringify(respUser.data)
                  );
                  localStorage.setItem("demoPro-token", resp.data.token);
                  ElMessage({
                    message:'登录成功',
                    type:'success'
                  })
                  router.push("/home");
                } else {
                  ElMessage({
                    message: resp.message,
                    type: "error",
                  });
                }
              });
            } 
          });
        } else {
          console.log("错误");
          return false;
        }
      });
    };
    const goRegister=()=> {
      router.push("/register");
    };
    return{
      loginForm,
      loginRules,
      submitForm,
      goRegister,
      loginFormRef,
    }
  },
});
</script>

<style lang="scss" scoped>
.login-container {
 height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("../../assets/01.jpg");
  background-size: cover;
}
.login-form {
  width: 350px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 35px 35px 35px 5px;
  border-radius: 20px;
  .el-form-item{
      margin-left: 30px;
  }
}
.login-title {
  text-align: center;
  margin-bottom: 40px;
  margin-top:-5px;
  margin-left:30px;
}
.login-button{
  margin-left: 25px;
  margin-top:20px;
}
.el-input{
  width: 230px !important;
}
</style>
