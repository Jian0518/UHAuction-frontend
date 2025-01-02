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
    <span>Top Up Successful!</span>
  </div>
  <div class="is-size-6" style="margin:10px">
    <span>Your payment has been completed.</span>
  </div>
</div>

    <br />
    <div class="columns is-centered" style="margin: 0 0 100px 0">
      <b-button type="is-info" tag="router-link" :to="{ path: `/member/${username}/bid` }" outlined>
        Finish
      </b-button>
    </div>
  </section>
</template>
<script>
import { topupSuccess } from "@/api/pay";
import { getUserName,getInfo } from "@/api/user"; 

export default {
  name:"topup-success",
  data() {
    return {
        alias: "",
        username: ""
    };
  },
  async mounted() {
    // Accessing the session_id parameter from the URL
    const amount = this.$route.query.amount;
    const userId = this.$route.query.userId;
    const response = await getUserName(userId); 
    this.alias = response.data;
    const user = await getInfo(this.alias); 
    this.username = user.data.username;
    this.updateTopupSuccess(amount, userId);
  },

  methods: {
    updateTopupSuccess(amount, userId) {
      topupSuccess(amount, userId)
        .then((response) => {
          // Handle successful response if needed
          console.log("Top up marked as successful:", response);
        })
        .catch((error) => {
          // Handle error if request fails
          console.error("Error marking top up as successful:", error);
        });
    }
  },
};
</script>

