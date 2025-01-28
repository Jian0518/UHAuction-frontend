<template>
  <article class="media">
    <div class="media-content">
      <form @submit.prevent="onSubmit">
        <b-field>
          <el-input
            v-model.lazy="amount"
            :placeholder="msg"
            :disabled="isLoading"
            :validateEvent="false"
          ></el-input>
          <span v-if="!isValidAmount && amount !== ''" class="help is-danger"
            >Please enter a valid number. Your bid must be higher than: ${{
              item.highestBid
            }}</span
          >
        </b-field>
        <nav class="level">
          <div class="level-left">
            <b-button
              type="is-primary"
              native-type="submit"
              class="level-item"
              :disabled="isLoading"
            >
              Bid
            </b-button>
          </div>
        </nav>
      </form>
    </div>
  </article>
</template>

<script>
import { fetchBidsByItemId } from "@/api/bid";
import { mapGetters } from "vuex";
import { pushBid, updateBid } from "@/api/bid";
import { getItem } from "@/api/item";

export default {
  name: "LvBidsForm",
  data() {
    return {
      amount: "",
      isLoading: false,
      item: null,
      msg: "",
      bids: [],
      userId: "",
      bidId: "",
      socket: null,
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
    isValidAmount() {
      // Check if amount is a valid number
      return (
        !isNaN(parseFloat(this.amount)) &&
        isFinite(this.amount) &&
        this.amount > this.item.highestBid
      );
    },
  },
  async mounted() {
    this.connectWebSocket();
    await this.updateItemData();
    await this.fetchBids(this.slug);
  },
  beforeDestroy() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  },

  props: {
    slug: {
      type: String,
      default: null,
    },
  },
  methods: {
    connectWebSocket() {
      this.socket = new WebSocket("ws://localhost:8000/ws/bids");

      this.socket.onopen = () => {
        console.log("WebSocket connected");
      };

      this.socket.onmessage = (event) => {
        this.updateItemData();
        this.fetchBids(this.slug);

        this.$emit("updateRanking");
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };

      this.socket.onclose = () => {
        console.warn("WebSocket closed. Reconnecting...");
        setTimeout(this.connectWebSocket, 5000);
      };
    },
    async fetchBids(itemId) {
      fetchBidsByItemId(itemId).then((response) => {
        const { data } = response;
        this.bids = data;
        this.bids.forEach((bid) => {
          if (bid.userId === this.user.id) {
            this.userId = bid.userId;
            this.bidId = bid.id;
          }
        });
      });
    },
    async updateItemData() {
      try {
        const response = await getItem(this.slug);
        this.item = response.data.topic;
        this.msg = `Current Highest Bid: $${this.item.highestBid}`;
      } catch (e) {
        this.$buefy.toast.open({
          message: `Failed to load item data: ${e.message}`,
          type: "is-danger",
        });
      }
    },
    async onSubmit() {
      this.isLoading = true;
      try {
        let itemData = {
          amount: this.amount,
          item_id: this.slug,
        };

        if (!this.bids.some((bid) => bid.userId === this.user.id)) {
          await pushBid(itemData);
          this.$message.success("Bid Success");
        } else {
          itemData.userId = this.userId;
          itemData.id = this.bidId;
          itemData.itemId = this.slug;
          await updateBid(itemData);
          this.$message.success("Update Successfully");
        }

        // Refresh item and bids data after a successful bid
        await this.updateItemData();
        await this.fetchBids(this.slug);

        this.$emit("updateRanking");
        this.amount = "";
      } catch (e) {
        console.log(e.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
