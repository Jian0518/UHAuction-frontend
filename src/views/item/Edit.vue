<template>
  <section>
    <div class="columns">
      <div class="column is-full">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span><i class="fa fa fa-book">Edit Item</i></span>
          </div>
          <div>
            <el-form :model="topic" ref="topic" class="demo-topic">
              <el-form-item prop="title">
                <el-input
                  v-model="topic.title"
                  placeholder="Enter new item name"
                ></el-input>
              </el-form-item>

              <b-input
                v-model.lazy="content"
                type="textarea"
                maxlength="400"
                placeholder="Add a description..."
                :disabled="isLoading"
              ></b-input>

              <br>
              <br />

              <div>
                <el-date-picker
                  v-model="endTime"
                  type="date"
                  :picker-options="pickerOptions"
                  placeholder="Select Auction End Date"
                  style="width: 100%"
                ></el-date-picker>
              </div>

              <br>

              <b-taginput
                v-model="tags"
                class="my-3"
                maxlength="255"
                maxtags="3"
                ellipsis
                placeholder="Please enter at most three categories"
              />

              <el-form-item class="mt-3">
                <el-button type="primary" @click="handleUpdate()"
                  >Edit
                </el-button>
                <el-button @click="resetForm('topic')">Reset</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
import { getItem, update } from "@/api/item";

export default {
  name: "TopicEdit",
  components: {},
  data() {
    return {
      topic: {},
      tags: [],
      content: "",
      endTime: null,
    };
  },
  created() {
    this.fetchItem();
  },
  methods: {
    fetchItem() {
      getItem(this.$route.params.id).then((value) => {
        this.topic = value.data.topic;
        this.tags = value.data.tags.map((tag) => tag.name);
        this.content = this.topic.content;
        this.endTime = this.topic.endTime;
      });
    },
    handleUpdate: function () {
      this.topic.content = this.content;
      this.topic.endTime = this.endTime;
      update(this.topic).then((response) => {
        const { data } = response;
        console.log(data);
        setTimeout(() => {
          this.$router.push({
            name: "item-detail",
            params: { id: data.id },
          });
        }, 800);
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.contentEditor.setValue("");
      this.tags = "";
    },

  },
};
</script>

<style>
.vditor-reset pre > code {
  font-size: 100%;
}
</style>
