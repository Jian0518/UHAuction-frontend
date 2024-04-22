<template>
  <div class="columns is-centered">
    <div class="column is-half">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="card-header-title">Make Payment</span>
        </div>
        <div class="table-container">
          <table class="table is-bordered is-striped is-hoverable is-fullwidth">
            <tbody>
              <tr>
                <th>Bank Name</th>
                <td>Public Bank Berhad</td>
              </tr>
              <tr>
                <th>Bank Account Number</th>
                <td>3171115615</td>
              </tr>
              <tr>
                <th>Account Holder Name</th>
                <td>UTAR EDUCATION FOUNDATION</td>
              </tr>
              <tr>
                <th>Transfer Reference</th>
                <td>{{ $route.query.itemId }}</td>
              </tr>
              <tr>
                <th>Transaction Reference Number</th>
                <td>
                  <el-input
                    type="text"
                    maxlength="45"
                    v-model="payForm.refId"
                    name="paymentReference"
                    autocomplete="chrome-off"
                    required
                  ></el-input>
                </td>
              </tr>
              <tr>
                <th>Payment Amount (RM)</th>
                <td>
                  <el-input
                    type="number"
                    :value="$route.query.amount"
                    readonly
                  ></el-input>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="has-text-centered">
            <a
              :href="payLink"
              class="button is-primary is-outlined"
            >
              Pay
            </a>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { postPay } from "@/api/pay";

export default {
  name: "TopicPost",

  data() {
    return {
      payForm: {
        itemId: "",
        refId: "",
        userId: "",
        amount: "",
        status: "",
      },
    };
  },

  props: {
    payLink: {
      type: String,
      default: null,
    },
  },
  methods: {
    submitForm(formName) {
      if (this.payForm.refId.length == 0) {
        alert("Reference number cannot be empty");
        return false;
      }

      this.payForm.itemId = this.$route.query.itemId;
      this.payForm.amount = this.$route.query.amount;
      this.payForm.userId = this.$route.query.userId;
      this.payForm.status = "To be approved";

      postPay(this.payForm).then((response) => {
        const { data } = response;
        setTimeout(() => {
          this.$router.push({
            name: "user",
            params: { username: this.$route.query.name },
          });
        }, 800);
      });
    },
  },
};
</script>

<style scoped>
.card-header-title {
  font-size: 1.5rem;
}

.table-container {
  overflow-x: auto;
}
</style>




