<template>
  <section class="box comments center-elements interesting-section">
    <div class="columns is-centered" style="margin: 100px 0 0 0 ">
      <figure>
        <img
          :src="require('@/assets/image/success.png')"
          height="100px"
          width="100px"
        />
      </figure>
    </div>
    <br />
<div class="has-text-centered">
  <div class="is-size-3 has-text-weight-bold" style="margin: 10px">
    <span>Payment Successful!</span>
  </div>
  <div class="is-size-6" style="margin:10px">
    <span>Your payment has been completed.</span>
  </div>
</div>

    <br />
    <div class="columns is-centered" style="margin: 0 0 100px 0">
      <!-- Example of binding a router-link -->
      <b-button type="is-info" tag="router-link" :to="{ path: '/#' }" outlined>
        Finish
      </b-button>
    </div>
  </section>
</template>
<script>
import { paySuccess } from "@/api/pay";

export default {
  mounted() {
    // Accessing the session_id parameter from the URL
    const sessionId = this.$route.query.session_id;
    const itemId = this.$route.query.item_id;
    console.log("Session ID:", sessionId);

    this.updatePaySuccess(sessionId, itemId);
  },

  methods: {
    updatePaySuccess(sessionId, itemId) {
      // Call paySuccess function with sessionId
      paySuccess(sessionId, itemId)
        .then((response) => {
          // Handle successful response if needed
          console.log("Payment marked as successful:", response);
        })
        .catch((error) => {
          // Handle error if request fails
          console.error("Error marking payment as successful:", error);
        });
    },
  },
};
</script>

