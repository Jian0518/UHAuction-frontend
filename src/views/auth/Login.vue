<template>
  <div class="columns py-6">
    <div class="column is-half is-offset-one-quarter">
      <el-card shadow="never">
        <div slot="header" class="has-text-centered has-text-weight-bold">
          Login
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
            <el-form-item label="User Name" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="Password" prop="pass">
              <el-input
                type="password"
                v-model="ruleForm.pass"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item label="Remember me" prop="delivery">
              <el-switch v-model="ruleForm.rememberMe"></el-switch>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >Login</el-button
              >
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
            <router-link :to="{ path: '/resetpass' }"
              ><u>Forget Password</u></router-link
            >
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      redirect: undefined,
      loading: false,
      ruleForm: {
        name: "",
        pass: "",
        rememberMe: true,
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please enter user name",
            trigger: "blur",
          },
          {
            min: 2,
            max: 15,
            message: "Length between 2 ~ 15 characters",
            trigger: "blur",
          },
        ],
        pass: [
          { required: true, message: "Please enter password", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "Length between 6 ~ 20 characters",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.ruleForm)
            .then(() => {
              const user = { username: this.ruleForm.name };
              localStorage.setItem("user", JSON.stringify(user)); // Store username in session storage
              this.$message({
                message: "Login successfully",
                type: "success",
                duration: 2000,
              });

              setTimeout(() => {
                this.loading = false;
                this.$router.push({ path: this.redirect || "/" });
              }, 0.1 * 1000);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
</style>
