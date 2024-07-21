<template>
  <div class="columns">
    <!-- Item detail -->
    <div class="column is-three-quarters">
      <!-- Item name -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="has-text-centered">
          <p class="is-size-5 has-text-weight-bold">{{ topic.title }}</p>
          <!-- Countdown Timer -->
          <div class="countdown-timer has-text-danger is-size-5 mt-3" :style="{ fontWeight: 'bold' }">
            Ends In: {{ countdownTimer }}
          </div>
          <!-- Add to Favorite button -->
          <a class="level-item" @click="handleFavorite(user.id, topic)">
            <span class="tag is-medium is-warning is-light">Add to Favorite</span>
          </a>
          <!-- Item details -->
          <div class="has-text-grey is-size-7 mt-3">
            <span>{{ dayjs(topic.createTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
            <el-divider direction="vertical" />
            <span>Donor: {{ topicUser.alias }}</span>
            <el-divider direction="vertical" />
            <span>Bidder Count: {{ topic.bidCount }}</span>
          </div>
        </div>
        <!-- Description and images -->
        <div id="app" class="has-text-centered">
          <div id="preview">
            <div id="imgs"></div>
            <br />
            <b>Description</b>
            <hr />
            <div id="desc"></div>
          </div>
        </div>
        <br />
        <!-- Tags and edit/delete options -->
        <nav class="level has-text-grey is-size-7 mt-6">
          <div class="level-left">
            <p class="level-item">
              <b-taglist>
                <router-link v-for="(tag, index) in tags" :key="index" :to="{ name: 'tag', params: { name: tag.name } }">
                  <b-tag type="is-info is-light mr-1">{{ '#' + tag.name }}</b-tag>
                </router-link>
              </b-taglist>
            </p>
          </div>
          <div v-if="token && user.id === topicUser.id" class="level-right">
            <router-link class="level-item" :to="{ name: 'item-edit', params: { id: topic.id } }">
              <span class="tag">Edit</span>
            </router-link>
            <a class="level-item" @click="confirmDelete(topic.id)">
              <span class="tag">Delete</span>
            </a>
          </div>
        </nav>
      </el-card>
      <!-- Bids and comments -->
      <lv-bids :slug="topic.id" v-if="countdownTimer != 'Ended'" />
      <lv-winner-item :userId="winner.id" :amount="winner.amount" :itemId="topic.id" :payLink="winner.payLink" :isPay="winner.isPay" v-if="countdownTimer == 'Ended'" />
      <lv-comments :slug="topic.id" />
    </div>
    <div class="column">
      <Author v-if="flag" :user="topicUser" />
      <recommend v-if="flag" :item-id="topic.id" />
    </div>
  </div>
</template>

<script>
import { deleteItem, getItem } from "@/api/item";
import { favorite } from "@/api/favorite";
import { mapGetters } from "vuex";
import Author from "@/views/item/Author";
import Recommend from "@/views/item/Recommend";
import LvComments from "@/components/Comment/Comments";
import LvBids from "@/components/Bid/Bids";
import LvWinnerItem from "@/components/Winner/WinnerItem";

export default {
  name: "TopicDetail",
  components: { Author, Recommend, LvComments, LvBids, LvWinnerItem },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  data() {
    return {
      flag: false,
      topic: { content: "", id: this.$route.params.id },
      winner: { id: "", amount: "", payLink: "", isPay: "" },
      tags: [],
      images: [],
      topicUser: {},
      endTime: null,
      countdownTimer: "",
    };
  },
  mounted() {
    this.fetchItem();
    this.updateCountdownTimer();
  },
  methods: {
    handleFavorite(userId, topic) {
      if (this.token) {
        favorite(userId, topic).then((response) => {
          this.$message.success(response.message);
        });
      } else {
        this.$message.error("Please login first");
      }
    },
    updateCountdownTimer() {
      setInterval(() => {
        if (!this.endTime) return;
        const now = new Date();
        const end = new Date(this.endTime);
        const diff = end - now;
        if (diff <= 0) {
          this.countdownTimer = "Ended";
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        this.countdownTimer = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000);
    },
    itemDetail(description, images) {
      document.getElementById("desc").innerText = description;
      const imgContainer = document.getElementById("imgs");
      images.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = `http://localhost:9000/uhauction/item/img/${image.name}`;
        imgElement.width = 200;
        imgElement.height = 200;
        imgContainer.appendChild(imgElement);
      });
    },
    async fetchItem() {
      getItem(this.$route.params.id).then((response) => {
        const { data } = response;
        document.title = data.topic.title;
        this.endTime = data.topic.endTime;
        this.topic = data.topic;
        this.tags = data.tags;
        this.topicUser = data.user;
        this.images = data.images;
        this.itemDetail(this.topic.content, this.images);
        this.flag = true;
        this.winner = {
          id: data.topic.winnerId,
          amount: data.topic.highestBid,
          payLink: data.topic.payLink,
          isPay: data.topic.isPay,
        };
      });
    },
    confirmDelete(id) {
      if (window.confirm("Are you sure you want to delete this item?")) {
        this.handleDelete(id);
      }
    },
    handleDelete(id) {
      deleteItem(id).then((value) => {
        alert(value.message);
        if (value.code === 200) {
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 500);
        }
      });
    },
  },
};
</script>

<style>
#preview {
  display: inline-block;
}
.input-card {
  padding: 20px;
}
.input-container {
  display: flex;
  align-items: center;
}
.el-input {
  margin-right: 10px;
  border-color: #9c27b0;
}
/* .el-button {
  background-color: #673ab7 !important;
  border-color: #673ab7 !important;
} */
</style>
