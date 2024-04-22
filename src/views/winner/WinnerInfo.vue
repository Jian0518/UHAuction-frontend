<template>
  <div class="columns is-centered">
    <div class="column is-half">
      <el-card class="box-card">
        <div slot="header" class="has-text-centered">
          <h3 class="title is-3"><b>Winner Information</b></h3>
        </div>

        <div class="winner-info">
          <figure class="image is-128x128">
            <img
              :src="`https://cn.gravatar.com/avatar/${userId}?s=164&d=monsterid`"
              alt="User Avatar"
              class="circle-image"
            />
          </figure>
        </div>

        <table class="table is-bordered is-striped is-fullwidth">
          <tbody>
            <tr>
              <td><b>Name:</b></td>
              <td>{{ userName }}</td>
            </tr>
            <tr>
              <td><b>Item:</b></td>
              <td>{{ itemName }}</td>
            </tr>
            <tr>
              <td><b>Description:</b></td>
              <td>{{ description }}</td>
            </tr>
            <tr>
              <td><b>Address:</b></td>
              <td>{{ address }}</td>
            </tr>
          </tbody>
        </table>

        <div class="buttons is-centered">
          <el-button v-if="isPay == 1" type="primary" @click="deliverItem" round
            >Deliver</el-button
          >

          <el-button
            v-if="isPay == 2"
            type="primary"
            @click="deliverItem"
            round
            disabled
            >Delivered</el-button
          >
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getItem,deliver } from "@/api/item";
import { getUserName } from "@/api/user";

export default {
  name: "WinnerInfo",

  data() {
    return {
      address: "",
      itemName: "",
      userId: "",
      highestBid: "",
      description: "",
      userName: "",
      isPay: "",
    };
  },

  mounted() {
    this.fetchItem();
  },

  methods: {
    async fetchItem() {
      try {
        const response = await getItem(this.$route.params.id);
        const { data } = response;
        this.address = data.topic.address;
        this.itemName = data.topic.title;
        this.userId = data.topic.winnerId;
        this.highestBid = data.topic.highestBid;
        this.description = data.topic.content;
        this.isPay = data.topic.isPay;
        this.fetchUsername(); // Call fetchUsername after userId is fetched
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    },

    async fetchUsername() {
      try {
        const response = await getUserName(this.userId);
        this.userName = response.data;
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    },

    deliverItem() {
      // Add logic for delivering the item
      this.$message.success("Update successful");
      console.log("Item delivered!");
      deliver(this.$route.params.id);
      // Introduce a delay of 1 second before refreshing the page
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 700); // 1000 milliseconds = 1 second
    },
  },
};
</script>


<style scoped>
.box-card {
  margin-top: 50px;
  padding: 30px;
}

.buttons {
  margin-top: 20px;
}

.circle-image {
  border-radius: 50%;
}

.winner-info {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
