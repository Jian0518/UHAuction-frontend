<template>
  <section class="box comments center-elements interesting-section">
    <div class="columns is-centered">
      <figure>
        <img
          :src="require('@/assets/image/success.png')"
          height="200px"
          width="200px"
        />
      </figure>
    </div>
    <br />
    <div class="columns is-centered">
      <h3>Payment Success</h3>
    </div>
    <br />
    <div class="columns is-centered">
      <!-- Example of binding a router-link -->
      <b-button
        type="is-primary"
        tag="router-link"
        :to="{ path: '/#' }"
        outlined
      >
        Home
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

    this.updatePaySuccess(sessionId,itemId);
  },

  methods: {
    updatePaySuccess(sessionId,itemId) {
      // Call paySuccess function with sessionId
      paySuccess(sessionId,itemId)
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

