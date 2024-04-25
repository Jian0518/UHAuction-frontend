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
                <el-form-item
                  prop="email"
                  label="Email"
                  :rules="[
                    { required: true, message: 'Please enter email address', trigger: 'blur' },
                    { type: 'email', message: 'Please enter in correct format', trigger: ['blur', 'change'] }
                  ]"
                >
                  <el-input v-model="user.email" />
                </el-form-item>
                 <el-form-item
                label="Phone No">
                  <el-input v-model="user.mobile" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
                  <el-button @click="resetForm('ruleForm')">Reset</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="Profile" name="second">
              <figure class="image is-48x48">
                <img :src="`https://cn.gravatar.com/avatar/${this.user.id}?s=164&d=monsterid`">
              </figure>
            </el-tab-pane>
          
            
          </el-tabs>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import {getInfo, update} from '@/api/user'

export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'first',
      labelPosition: 'right',
      user: {
        id: '',
        username: '',
        alias: '',
        bio: '',
        email: '',
        mobile: '',
        avatar: ''
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
    }
  }
}
</script>

<style scoped>

</style>
