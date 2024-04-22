<template>
  <section class="box comments center-elements interesting-section">
    <div class="winner-info">
      <h3 class="title is-5">Winner</h3>
      <el-divider direction="horizontal" />
      <h5>{{ userName }}</h5>
      <figure class="image is-128x128">
        <img
          :src="`https://cn.gravatar.com/avatar/${userId}?s=164&d=monsterid`"
        />
      </figure>
      <br />
      <p>RM {{ amount }}</p>
      <br />
      <a
        v-if="user.id == userId && isPay == 0"
        :href="payLink"
        class="button is-primary is-outlined"
      >
        Pay
      </a>
      <button
        v-if="user.id == userId && isPay == 1"
        class="button is-primary is-outlined"
        disabled
      >
        Paid
      </button>

      <b-button
        v-if="user.id == userId && isPay == 2"
        tag="router-link"
        :to="{ path: '/winner/info/' + itemId }"
        class="button is-primary "
      >
        To Receive
      </b-button>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { getUserName } from "@/api/user";

export default {
  name: "LvWinnerItem",
  components: {},
  data() {
    return {
      userName: "",
    };
  },
  props: {
    userId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    itemId: {
      type: String,
      default: null,
    },
    payLink: {
      type: String,
      default: null,
    },
    isPay: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },

  mounted() {
    this.fetchUsername();
  },
  methods: {
    async fetchUsername() {
      getUserName(this.userId).then((response) => {
        this.userName = response.data;
      });
    },
  },
};
</script>
<style>
.winner-info {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.winner-info h3 {
  font-size: 1.2rem;
  color: #333;
}

.winner-info h5 {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

.winner-info img {
  border-radius: 50%;
}

.winner-info p {
  font-size: 1.1rem;
  color: #00aaff;
  font-weight: bold;
}
</style>