<template>
  <div class="login-container">
    <div class="login-card">
      <div class="content">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
            :size="formSize"
        >
          <el-form-item label="账号" prop="name">
            <el-input v-model="ruleForm.name"
                      type="text"
                      autocomplete="off"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input  v-model="ruleForm.password"
                       type="password"
                       show-password
                       autocomplete="off"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              {{'登录'}}
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">{{'重置'}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import type { FormInstance, FormRules } from 'element-plus'
const store = useStore();
const router = useRouter();
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  name: 'admin',
  password: 'abcd1234',
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 5, message: '最小三位最长5位有效数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      localStorage.setItem('loginToken', ruleForm.name);
      router.push('/');
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
    .login-card{
        border-radius: 20px;
        box-shadow: 0 0 10px #dcdfe6;
        background-color: #fff;
        overflow: hidden;
        .content {
            padding: 40px 80px 20px 20px;
            /deep/(.el-input-group__append) {
              padding: 0;
              overflow: hidden;
            }
            .el-button {
              width: 44%;
              margin-top: 10px;
            }
            /deep/.el-form-item__label{
             // color: #fff;
            }
            /deep/.el-form-item__content{
              width: 160px;
            }
        }
    }
}
</style>
