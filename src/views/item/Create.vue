<template>
  <div class="columns">
    <div class="column is-full">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span><i class="fa fa fa-gift"> Donate Item</i></span>
        </div>
        <div>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            class="demo-ruleForm"
          >
            <el-form-item prop="title">
              <el-input
                v-model="ruleForm.title"
                placeholder="Enter item name"
              />
            </el-form-item>

            <div />
            <b-input
              v-model.lazy="ruleForm.content"
              type="textarea"
              maxlength="400"
              placeholder="Add a description..."
            ></b-input>
            <br />

            <el-upload
              class="upload-demo"
              action="http://localhost:8000/file/upload2"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              :file-list="imgUrl"
              multiple
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">
                <i>Only JPG and PNG files that are below 500KB are allowed.</i>
              </div>
            </el-upload>
            <br />
            <div>
              <el-date-picker
                v-model="ruleForm.endTime"
                type="date"
                :picker-options="pickerOptions"
                placeholder="Select Auction End Date"
                style="width: 100%"
              ></el-date-picker>
            </div>

            <br />
            <b-taginput
              v-model="ruleForm.tags"
              class="my-3"
              maxlength="255"
              maxtags="3"
              ellipsis
              placeholder="Please enter at most three categories"
            />

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >Submit
              </el-button>
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { post } from "@/api/item"; 

export default {
  name: "TopicPost",

  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          // Disable dates before tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate());
          return time.getTime() < tomorrow.getTime();
        },
      },
      imgUrl: [],
      ruleForm: {
        title: "",
        tags: [], // category tags
        content: "",
        images: [],
        cover: "",
        endTime: null,
      },
      rules: {
        title: [
          {
            required: true,
            message: "Please enter item name",
            trigger: "blur",
          },
          {
            min: 1,
            max: 255,
            message: "Length between 1 ~ 255 characters",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleUploadSuccess(response, file) {
      // Handle successful upload
      if (response.code === 200) {
        const fileName = response.data; // the file name is returned in response.data
        this.ruleForm.images.push(fileName);
        this.imgUrl.push({
          url: file.url,
        });
      } else {
        // Handle upload failure
        this.$message.error(response.message);
      }
    },
    handleRemove(file) {
      const index = this.ruleForm.images.findIndex(
        (img) => img.url === file.url
      );
      if (index !== -1) {
        this.ruleForm.images.splice(index, 1);
        this.imgUrl.splice(index, 1);
      }
      
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.content.trim()) {
            alert("Description cannot be empty");
            return false;
          }

          if (this.ruleForm.images.length == 0) {
            alert("Image cannot be empty");
            return false;
          }

          if (this.ruleForm.endTime == null) {
            alert("End date cannot be empty");
            return false;
          }

          if (this.ruleForm.tags == null || this.ruleForm.tags.length === 0) {
            alert("Categories tag cannot be empty");
            return false;
          }

          this.ruleForm.cover = this.ruleForm.images[0];

          post(this.ruleForm).then((response) => {
            const { data } = response;
            setTimeout(() => {
              this.$router.push({
                name: "item-detail",
                params: { id: data.id },
              });
            }, 800);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.content = "";
      this.ruleForm.tags = "";
      this.ruleForm.endTime = null;
      this.ruleForm.images = [];
      this.imgUrl = [];
    },
  },
};
</script>

<style>
</style>




