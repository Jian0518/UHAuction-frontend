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
                <td>{{$route.query.itemId}}</td>
              </tr>
              <tr>
                <th>Transaction Reference Number</th>
                <td>
                  <el-input
                    type="text"
                    maxlength="45"
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
            <b-button type="is-primary" outlined>Submit</b-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>

export default {
  name: "TopicPost",

  data() {
    return {

    };
  },
  methods: {},
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




