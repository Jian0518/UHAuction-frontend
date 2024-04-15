<template>
  <div class="columns py-6">
    <div class="column is-three-fifths is-offset-one-quarter">
      <el-card shadow="never">
        <div slot="header" class="has-text-centered has-text-weight-bold">
          New User Registration
        </div>
        <div>
          <el-form
            ref="ruleForm"
            v-loading="loading"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="160px"
            class="demo-ruleForm"
          >
            <el-form-item label="User Id" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>

            <el-form-item label="Password" prop="pass">
              <el-input
                v-model="ruleForm.pass"
                type="password"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item label="Confirm Password" prop="checkPass">
              <el-input
                v-model="ruleForm.checkPass"
                type="password"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input v-model="ruleForm.email" autocomplete="off" />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
              >Sign up</el-button>
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userRegister } from '@/api/auth/auth'

export default {
  name: 'Register',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password again'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('Password inconsistent!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        name: '',
        pass: '',
        checkPass: '',
        email: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please enter user id', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: 'Length between 2 ~ 10 characters',
            trigger: 'blur'
          }
        ],
        pass: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: 'Length between 6 ~ 20 characters',
            trigger: 'blur'
          }
        ],
        checkPass: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter email', trigger: 'blur' },
          {
            type: 'email',
            message: 'Format incorrect',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          userRegister(this.ruleForm)
            .then((value) => {
              const { code, message } = value
              if (code === 200) {
                this.$message({
                  message: 'Register successfully',
                  type: 'success'
                })
                setTimeout(() => {
                  this.loading = false
                  this.$router.push({ path: this.redirect || '/login' })
                }, 0.1 * 1000)
              } else {
                this.$message.error('Register failed' + message)
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
</style>