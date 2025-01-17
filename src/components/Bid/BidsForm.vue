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
          <span v-if="!isValidAmount && amount !== ''"  class="help is-danger"
            >Please enter a valid number. Your bid must be higher than: ${{item.highestBid}}</span
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
import {getItem} from "@/api/item";
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
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
    isValidAmount() {
      // Check if amount is a valid number
      return !isNaN(parseFloat(this.amount)) && isFinite(this.amount) && this.amount > this.item.highestBid;
    },
  },
  async mounted() {
    this.item = await getItem(this.slug);
    this.item = this.item.data.topic;
    this.msg = `Current Highest Bid: $${this.item.highestBid}`;
    await this.fetchBids(this.slug);
  },
  props: {
    slug: {
      type: String,
      default: null,
    },
  },
  methods: {
    async fetchBids(itemId){
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
    async onSubmit() {
      this.isLoading = true;
      try {
        let itemData = {};
        itemData["amount"] = this.amount;
        itemData["item_id"] = this.slug;
        if(!this.bids.some((bid) => bid.userId === this.user.id)){
          await pushBid(itemData);
          this.$emit("updateRanking");
          this.$message.success("Bid Success");
          this.fetchBids(this.slug);
        }
        else{
          itemData["userId"] = this.userId;
          itemData["id"] = this.bidId;
          itemData["itemId"] = this.slug;
          await updateBid(itemData);
          this.$emit("updateRanking");
          this.$message.success("Update successfully");
        }
        
      } catch (e) {
        this.$buefy.toast.open({
          message: `Cannot bid this item. ${e}`,
          type: "is-danger",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
