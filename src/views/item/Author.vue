<template>
  <section id="author">
    <el-card class="" shadow="never">
      <div slot="header">
        <span class="has-text-weight-bold">👨‍💻 Donor</span>
      </div>
      <div class="has-text-centered">
        <p class="is-size-5 mb-5">
          <router-link :to="{ path: `/member/${user.username}/home` }">
            {{ user.alias }}
            <span class="is-size-7 has-text-grey">{{
              "@" + user.username
            }}</span>
          </router-link>
        </p>
        <div class="columns is-mobile">
          <div class="column is-half">
            <code>{{ user.itemCount }}</code>
            <p>Item</p>
          </div>
          <div class="column is-half">
            <code>{{ user.followerCount }}</code>
            <p>Follower</p>
          </div>
        </div>
        <div>
          <button
            v-if="hasFollow"
            class="button is-success button-center is-fullwidth"
            @click="handleUnFollow(user.id)"
          >
            Followed
          </button>

          <button
            v-else
            class="button is-link button-center is-fullwidth"
            @click="handleFollow(user.id)"
          >
            Follow
          </button>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import { follow, hasFollow, unFollow } from "@/api/follow";
import { mapGetters } from "vuex";
export default {
  name: "Author",
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      hasFollow: false,
    };
  },
  mounted() {
    this.fetchInfo();
  },
  computed: {
    ...mapGetters(["token"]),
  },
  methods: {
    fetchInfo() {
      if (this.token != null && this.token !== "") {
        hasFollow(this.user.id).then((value) => {
          const { data } = value;
          this.hasFollow = data.hasFollow;
        });
      }
    },
    handleFollow: function (id) {
      if (this.token != null && this.token !== "") {
        follow(id)
          .then((response) => {
            const { message } = response;
            this.$message.success(message);
            this.hasFollow = !this.hasFollow;
            this.user.followerCount = parseInt(this.user.followerCount) + 1;
          })
          .catch((error) => {
            const errorMessage = error.message || "Unknown error occurred";
              console.log(errorMessage)
          });
      } else {
        this.$message.error("Please login first");
      }
    },

    handleUnFollow: function (id) {
      unFollow(id).then((response) => {
        const { message } = response;
        this.$message.success(message);
        this.hasFollow = !this.hasFollow;
        this.user.followerCount = parseInt(this.user.followerCount) - 1;
      });
    },
  },
};
</script>

<style scoped>
</style>
