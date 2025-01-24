<template>
  <div class="columns py-6">
    <div class="column is-half is-offset-one-quarter">
      <el-card shadow="never">
        <div slot="header" class="has-text-centered has-text-weight-bold">
          Reset Password
        </div>
        <div>
          <el-form
            v-loading="loading"
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="Email" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>

            <el-form-item class="button-group">
              <el-button 
                type="primary" 
                @click="submitForm('ruleForm')"
                class="submit-button"
                :loading="loading"
                :disabled="loading"
              >
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </el-button>
              <el-button 
                @click="goBack"
                class="back-button"
                :disabled="loading"
              >
                Back to Login
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { resetPassword } from '@/api/user'

export default {
  name: 'ResetPassword',
  data() {
    // Email validation rule
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value === '') {
        callback(new Error('Please enter your email'))
      } else if (!emailRegex.test(value)) {
        callback(new Error('Please enter a valid email address'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      ruleForm: {
        email: ''
      },
      rules: {
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true
            const response = await resetPassword(this.ruleForm.email)
            
            this.$message({
              type: 'success',
              message: 'Password reset link has been sent to your email!',
              duration: 1000
            })

            setTimeout(() => {
              this.$router.push('/login')
            }, 1000)

          } catch (error) {
            this.$message({
              type: 'error',
              message: 'Failed to send reset password link. Please try again.',
              duration: 1000
            })
          } finally {
            this.loading = false
          }
        }
      })
    },
    goBack() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.el-card {
  max-width: 500px;
  margin: 0 auto;
}

.el-form {
  padding: 20px;
}

/* Center the buttons and add proper spacing */
.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
}

.submit-button {
  margin-right: 15px;
  min-width: 120px;
}

.back-button {
  min-width: 120px;
}

/* Remove the default margin-bottom from the last form item */
.el-form-item:last-child {
  margin-bottom: 0;
}
</style>