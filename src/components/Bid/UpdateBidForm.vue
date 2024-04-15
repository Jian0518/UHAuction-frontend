<template>
  <article class="media">
    <div class="media-content">
      <form @submit.prevent="onSubmit">
        <b-field>
          <el-input
            v-model.lazy="localAmount"
            :disabled="isLoading"
            :validateEvent=false
          ></el-input>
          <span v-if="!isValidAmount && localAmount !== ''" class="help is-danger"
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
              Update
            </b-button>
          </div>
        </nav>
      </form>
    </div>
  </article>
</template>

<script>
import { updateBid } from "@/api/bid";

export default {
  name: "LvUpdateBidsForm",
  data() {
    return {
      isLoading: false,
      localAmount: this.amount // Initialize local data property based on the prop
    };
  },
  computed: {
    isValidAmount() {
      // Check if localAmount is a valid number
      return !isNaN(parseFloat(this.localAmount)) && isFinite(this.localAmount);
    }
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
    bidId: {
      type: String,
      default: null,
    },
    itemId: {
      type: String, 
      default: null,
    }
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        let itemData = {};
        console.log(this.localAmount);
        console.log(this.userId);
        itemData["amount"] = this.localAmount; // Use localAmount instead of amount
        itemData["userId"] = this.userId;
        itemData["id"] = this.bidId; 
        itemData["itemId"] = this.itemId;

        console.log("Item data: " + itemData.amount)
        console.log(itemData.userId)
        console.log("Item id" + itemData.itemId)
        await updateBid(itemData);
        this.$emit("loadBids", this.slug);
        this.$message.success("Update successfully");
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
