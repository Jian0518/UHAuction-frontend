<template>
  <div class="columns">
    <!--item detail-->
    <div class="column is-three-quarters">
      <!--item name-->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="has-text-centered">
          <p class="is-size-5 has-text-weight-bold">{{ topic.title }}</p>

          <!-- Countdown Timer -->
          <div
            class="countdown-timer has-text-danger is-size-5 mt-3"
            :style="{ fontWeight: 'bold' }"
          >
            Ends In: {{ countdownTimer }}
          </div>

          <div class="has-text-grey is-size-7 mt-3">
            <span>{{
              dayjs(topic.createTime).format("YYYY/MM/DD HH:mm:ss")
            }}</span>

            <el-divider direction="vertical" />
            <span>Donor: {{ topicUser.alias }}</span>

            <el-divider direction="vertical" />
            <span>Bidder Count: {{ topic.bidCount }}</span>
          </div>
        </div>

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
        <nav class="level has-text-grey is-size-7 mt-6">
          <div class="level-left">
            <p class="level-item">
              <b-taglist>
                <router-link
                  v-for="(tag, index) in tags"
                  :key="index"
                  :to="{ name: 'tag', params: { name: tag.name } }"
                >
                  <b-tag type="is-info is-light mr-1">
                    {{ "#" + tag.name }}
                  </b-tag>
                </router-link>
              </b-taglist>
            </p>
          </div>
          <div v-if="token && user.id === topicUser.id" class="level-right">
            <router-link
              class="level-item"
              :to="{ name: 'item-edit', params: { id: topic.id } }"
            >
              <span class="tag">Edit</span>
            </router-link>
            <a class="level-item">
              <span class="tag" @click="confirmDelete(topic.id)">Delete</span>
            </a>
          </div>
        </nav>
      </el-card>

      <div></div>
      <lv-bids :slug="topic.id" v-if="countdownTimer != 'Expired'" />
      <lv-winner-item
        :userId="winner.id"
        :amount="winner.amount"
        :itemId="topic.id"
        v-if="countdownTimer == 'Expired'"
      />
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
      topic: {
        content: "",
        id: this.$route.params.id,
      },
      winner: {
        id: "",
        amount: "",
      },
      tags: [],
      images: [],
      topicUser: {},
      imgName: "",
      endTime: null,
      countdownTimer: "",
    };
  },

  mounted() {
    this.fetchItem();
    this.updateCountdownTimer();
  },

  methods: {
    // Method to update countdown timer
    updateCountdownTimer() {
      setInterval(() => {
        if (!this.endTime) return; // If endTime is not set, do nothing

        const now = new Date();
        const end = new Date(this.endTime);
        const diff = end - now;

        if (diff <= 0) {
          this.countdownTimer = "Expired"; // If endTime has passed, display 'Expired'
          return;
        }

        // Calculate days, hours, minutes, and seconds remaining
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update countdown timer with formatted time
        this.countdownTimer = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000); // Update every second
    },

    itemDetail(description, images) {
      var desc = document.getElementById("desc");
      desc.innerText += description;
      var img = document.getElementById("imgs");
      images.forEach((image) => {
        img.innerHTML += `<img src="${
          "http://localhost:9000/uhauction/item/img/" + image.name
        }" width='200px' height='200px' />`;
      });
    },

    // initialize
    async fetchItem() {
      getItem(this.$route.params.id).then((response) => {
        const { data } = response;
        document.title = data.topic.title;
        this.endTime = data.topic.endTime;
        this.topic = data.topic;
        this.tags = data.tags;
        this.topicUser = data.user;
        // this.comments = data.comments
        this.images = data.images;
        this.itemDetail(this.topic.content, this.images);
        this.flag = true;
        this.winner.id = data.topic.winnerId;
        this.winner.amount = data.topic.highestBid;
      });
    },

    confirmDelete(id) {
      if (window.confirm("Are you sure you want to delete this item?")) {
        this.handleDelete(id);
      }
    },

    handleDelete(id) {
      deleteItem(id).then((value) => {
        const { code, message } = value;
        alert(message);

        if (code === 200) {
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
</style>

<style scoped>
.input-card {
  padding: 20px;
}

.input-container {
  display: flex;
  align-items: center;
}

.el-input {
  margin-right: 10px;
  border-color: #9c27b0; /* Purple border color */
}

.el-button {
  background-color: #673ab7 !important; /* Purple background color for button */
  border-color: #673ab7 !important; /* Purple border color for button */
}
</style>
