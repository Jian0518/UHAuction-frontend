<template>
  <section class="box comments">
    <hr />
    <h3 class="title is-5">Place a Bid</h3>

    <template v-if="token">
      <lv-bids-form 
        :slug="slug" 
        @updateRanking="$emit('updateRanking')"
      />
    </template>
    <div v-else class="empty-state">
      <i><b>Please login to place a bid</b></i>
    </div>
  </section>
</template>
 

<script>
import { mapGetters } from "vuex";
import LvBidsForm from "./BidsForm";

export default {
  name: "LvBids",
  components: {
    LvBidsForm,
  },
  props: {
    slug: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapGetters(["token"]),
  },
  emits: ['updateRanking']
};
</script>

<style scoped>
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>
