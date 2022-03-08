<template>
  <div class="register-container">
    <el-form
      :model="registerForm"
      status-icon
      :rules="registerRules"
      ref="registerFormRef"
      label-width="100px"
      class="register-form"
    >
      <h2 class="register-title">注册</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="registerForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="registerForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="registerForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <div class="register-button">
        <el-form-item>
          <el-button type="primary"  @click="submitForm(registerFormRef)">提交</el-button>
          <el-button @click="goLogin">登录</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, getCurrentInstance, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { ElMessage } from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>;
const registerFormRef = ref<FormInstance>();
import {register} from "../../api/login";
export default defineComponent({
  name: "RegisterVue",
  components: {},
  setup() {
    const router = useRouter();
    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (registerForm.checkPass !== "") {
          if (!registerFormRef.value) return;
          registerFormRef.value.validateField("checkPass", () => null);
        }
        callback();
      }
    };
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== registerForm.password) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    };
    const registerForm = reactive({
      username: "",
      nickname: "",
      password: "",
      checkPass: "",
    });

    const registerRules = reactive({
      password: [{ required: true, validator: validatePass, trigger: "blur" }],
      checkPass: [
        { required: true, validator: validatePass2, trigger: "blur" },
      ],
      username: [{ required: true, message: "账号不能为空", trigger: "blur" }],
      nickname: [
        {
          required: true,
          message: "昵称不能为空",
          trigger: "blur",
        },
      ],
    });

    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
           register(registerForm.username,registerForm.nickname,registerForm.password).then(response=>{
              // console.log(response.data);
              const resp=response.data;
              if(resp.flag)
              {
                //跳转到登录页面
                ElMessage({
                  message:'注册成功',
                  type:'success'
                })
                router.push("/")
              }
            })
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };
    const goLogin = () => {
      router.push("/");
    };
    return {
      registerForm,
      registerRules,
      submitForm,
      goLogin,
      registerFormRef
    };
  },
});
</script>

<style lang="scss" scoped>
.register-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("../../assets/01.jpg");
  background-size: cover;
}
.register-form {
  width: 350px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 35px 35px 35px 5px;
  border-radius: 20px;
  .el-form-item {
    margin-left: 8px;
  }
}
.register-title {
  text-align: center;
  margin-bottom: 40px;
  margin-top: -5px;
  margin-left: 30px;
}
.register-button {
  margin-left: 20px;
  margin-top: 35px;
}
.el-input {
  width: 210px !important;
}
</style>
