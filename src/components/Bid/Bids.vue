<template>
  <section class="box comments">
    <hr />
    <h3 class="title is-5">Silent Bid</h3>

    <template v-if="token">
      <lv-bids-form :slug="slug" v-if="showBidsForm" />
      <lv-update-bids-form
        :userId="userId"
        :amount="amount"
        :bidId="bidId"
        :itemId="itemId"
        v-else
      />
    </template>
  </section>
</template>
 
    
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchBidsByItemId } from "@/api/bid";
import LvBidsForm from "./BidsForm";
import LvUpdateBidsForm from "./UpdateBidForm.vue";

export default {
  name: "LvBids",
  components: {
    LvBidsForm,
    LvUpdateBidsForm,
  },
  data() {
    return {
      bids: [],
      amount: "",
      userId: "",
      bidId: "",
      itemId: "",
    };
  },
  props: {
    slug: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["token", "user"]),
    showBidsForm() {
      return !this.bids.some((bid) => bid.userId === this.user.id);
    },
  },
  async mounted() {
    await this.fetchBids(this.slug);
  },
  methods: {
    async fetchBids(item_id) {
      console.log("Item id =" + item_id);
      fetchBidsByItemId(item_id).then((response) => {
        const { data } = response;
        this.bids = data;
        this.bids.forEach((bid) => {
          if (bid.userId === this.user.id) {
            this.userId = bid.userId;
            this.amount = bid.amount;
            this.bidId = bid.id;
            this.itemId = bid.itemId;
          }
        });
      });
    },
  },
};
</script>