<template>
  <article class="media">
    <div class="media-content">
      <form @submit.prevent="onSubmit">
        <b-field>
          <el-input
            v-model.lazy="amount"
            placeholder="Please enter amount to bid"
            :disabled="isLoading"
            :validateEvent="false"
          ></el-input>
          <span v-if="!isValidAmount && amount !== ''" class="help is-danger"
            >Please enter a valid number</span
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
import { pushBid } from "@/api/bid";

export default {
  name: "LvBidsForm",
  data() {
    return {
      amount: "",
      isLoading: false,
    };
  },
  computed: {
    isValidAmount() {
      // Check if amount is a valid number
      return !isNaN(parseFloat(this.amount)) && isFinite(this.amount);
    },
  },
  props: {
    slug: {
      type: String,
      default: null,
    },
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        let itemData = {};
        itemData["amount"] = this.amount;
        itemData["item_id"] = this.slug;
        console.log("Item data: " + itemData.amount);
        console.log(itemData.item_id);
        await pushBid(itemData);
        this.$emit("loadBids", this.slug);
        this.$message.success("Bid Success");
        // Wait for 1 second before refreshing the page
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
