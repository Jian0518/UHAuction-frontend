<template>
  <section>
    <el-card shadow="never">
      <div slot="header">
        Personal Profile
      </div>
      <div class="columns">
        <div class="column is-full">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="Basic Info" name="first">
              <el-form :label-position="labelPosition" label-width="100px" :model="user">
                <el-form-item label="User Name">
                  <el-input v-model="user.username" disabled />
                </el-form-item>
                <el-form-item label="Alias">
                  <el-input v-model="user.alias" />
                </el-form-item>
                <el-form-item prop="email" label="Email" :rules="[
                  { required: true, message: 'Please enter email address', trigger: 'blur' },
                  { type: 'email', message: 'Please enter in correct format', trigger: ['blur', 'change'] }
                ]">
                  <el-input v-model="user.email" />
                </el-form-item>
                <el-form-item label="Phone No">
                  <el-input v-model="user.mobile" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
                  <el-button @click="resetForm('ruleForm')">Reset</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="Change Password" name="second">
              <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="150px"
                class="password-form">
                <el-form-item label="Current Password" prop="currentPassword">
                  <el-input type="password" v-model="passwordForm.currentPassword" autocomplete="off" style="max-width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="New Password" prop="newPassword">
                  <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off" style="max-width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="Confirm Password" prop="confirmPassword">
                  <el-input type="password" v-model="passwordForm.confirmPassword" autocomplete="off" style="max-width: 300px"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="changePassword('passwordForm')" :loading="passwordLoading">
                    Change Password
                  </el-button>
                  <el-button @click="resetPasswordForm('passwordForm')">
                    Reset
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import { getInfo, update, changePassword } from '@/api/user'

export default {
  name: 'Setting',
  data() {
    // Password validation rule
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password'))
      } else if (value.length < 6) {
        callback(new Error('Password must be at least 6 characters'))
      } else {
        callback()
      }
    }

    // Confirm password validation rule
    const validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please confirm password'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    }

    return {
      activeName: 'first',
      labelPosition: 'right',
      passwordLoading: false,
      user: {
        id: '',
        username: '',
        alias: '',
        bio: '',
        email: '',
        mobile: '',
        avatar: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        currentPassword: [
          { required: true, message: 'Please enter current password', trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateConfirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchInfo()
  },
  methods: {
    fetchInfo() {
      getInfo(this.$route.params.username).then(res => {
        console.log(res)
        const { data } = res
        this.user = data
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitForm(formName) {
      console.log(this.user)
      update(this.user).then(res => {
        this.$message.success('Infomation has been updated successfully')
        this.fetchInfo()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async changePassword(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.passwordLoading = true
            const passwordData = {
              userId: this.user.id,
              currentPassword: this.passwordForm.currentPassword,
              newPassword: this.passwordForm.newPassword
            }
            await changePassword(passwordData)

            this.$message({
              type: 'success',
              message: 'Password changed successfully!',
              duration: 2000
            })

            // Reset the form after successful change
            this.resetPasswordForm(formName)
          } catch (error) {
            this.$message({
              type: 'error',
              message: error.message || 'Failed to change password',
              duration: 3000
            })
          } finally {
            this.passwordLoading = false
          }
        }
      })
    },
    resetPasswordForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.password-form {
  max-width: 600px;
  padding: 20px;
}

.el-button {
  margin-right: 15px;
}
</style>
