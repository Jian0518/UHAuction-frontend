<template>
  <div class="column">
    <el-card class="box-card content" shadow="never">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="To Pay" name="pay">
          <div
            v-if="pays.length === 0"
            class="notification is-warning has-text-centered"
          >
            No item
          </div>

          <div v-else class="topicUser-info">
            <article
              v-for="(item, index) in pays"
              :key="index"
              class="media box"
            >
              <router-link
                :to="{ name: 'item-detail', params: { id: item.id } }"
              >
                <figure class="media-left">
                  <p class="image is-96x96">
                    <img
                      :src="`http://localhost:9000/uhauction/item/img/${item.cover}`"
                    />
                  </p>
                </figure>
              </router-link>
              <div class="media-content">
                <div class="content">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.title"
                    placement="top"
                  >
                    <router-link
                      :to="{ name: 'item-detail', params: { id: item.id } }"
                      class="has-text-weight-bold is-size-5"
                    >
                      {{ item.title }}
                    </router-link>
                  </el-tooltip>
                </div>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <div
                      class="level-item has-text-danger is-size-6 has-text-weight-bold"
                    >
                      Bid: RM{{ item.highestBid }}
                    </div>
                  </div>
                </nav>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <div class="level-item has-text-grey is-size-7">
                      End Time:
                      {{ dayjs(item.endTime).format("YYYY/MM/DD HH:mm:ss") }}
                    </div>
                  </div>
                </nav>
              </div>
              <div v-if="token" class="media-right">
                <div v-if="topicUser.username === user.username">
                  <div class="level-item">
                    <button
                      class="button is-success is-outlined fixed-width-button"
                      @click="openPayModal(item)"
                    >
                      Pay
                    </button>
                    <el-dialog
                      title="Select Payment Method"
                      :visible.sync="showPay"
                    >
                      <el-radio-group v-model="selectedPayment">
                        <el-radio label="Credit Card">
                          <img
                            src="https://i.pinimg.com/736x/9b/e8/c1/9be8c161a6df9e7c9f8f1f760b9638f1.jpg"
                            alt="Credit Card"
                            style="width: 40px; vertical-align: middle"
                          />
                          Credit Card
                        </el-radio>
                        <el-radio label="UH Wallet">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6yE8mVI1xRWWkq3A4qLcxfF2tqLLSR64SaA&s"
                            alt="UH Wallet"
                            style="width: 40px; vertical-align: middle"
                          />
                          UH Wallet
                        </el-radio>
                      </el-radio-group>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="showPay = false">Cancel</el-button>
                        <el-button
                          type="primary"
                          @click="payFunction(currentItem.payLink, currentItem.highestBid)"
                          >Pay</el-button
                        >
                      </span>
                    </el-dialog>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <pagination
            v-show="page[activeName].total > 0"
            class="mt-5"
            :total="page[activeName].total"
            :page.sync="page[activeName].current"
            :limit.sync="page[activeName].size"
            @pagination="fetchUserById"
          />
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="Top Up Funds" :visible.sync="showTopUp">
        <el-input v-model="topUpAmount" placeholder="Enter amount"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showTopUp = false">Cancel</el-button>
          <el-button type="primary" @click="topUp">Top Up</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
import { getInfoByName, update } from "@/api/user";
import pagination from "@/components/Pagination/index";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: { pagination },
  data() {
    return {
      currentDate: new Date().toISOString().slice(0, 10),
      activeName: "bided",
      topicUser: {},
      items: [],
      bids: [],
      showPay: false,
      selectedPayment: "",
      pays: [],
      topUpAmount: 0.0,
      showTopUp: false,
      page: {
        bided: { current: 1, size: 5, total: 0 },
        pay: { current: 1, size: 10, total: 0 },
      },
      currentItem: null, // Add currentItem to store the item being paid for
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  created() {
    this.fetchUserById();
    // Update currentDate every second
    setInterval(() => {
      this.currentDate = new Date().toISOString().slice(0, 10);
    }, 1000);
  },
  methods: {
    openPayModal(item) {
      this.currentItem = item;
      this.showPay = true;
    },
    payFunction(paylink, highestBid) {
      if (this.selectedPayment == "Credit Card") {
        window.location.href = paylink; // Redirect to payment link
      } else if (this.selectedPayment === "UH Wallet") {
        if (parseFloat(this.topicUser.balance) >= parseFloat(highestBid)) {
          this.topicUser.balance =
            parseFloat(this.topicUser.balance) - parseFloat(highestBid);
          this.topicUser.isPay = parseInt("1");
          update(this.topicUser).then((res) => {
            this.$message.success("Payment Successful");
          });
          // Implement wallet payment logic here, e.g., update balance in the backend
        } else {
          // Display a warning message for insufficient balance
          this.$message.error("Insufficient balance");
        }
      } else {
        this.$message.error("Please select a payment method");
      }
    },
    topUp() {
      // Convert balance and topUpAmount to numbers before addition
      this.topicUser.balance =
        parseFloat(this.topicUser.balance) + parseFloat(this.topUpAmount);

      update(this.topicUser).then((res) => {
        this.$message.success("Top Up Successfully");
      });
    },

    fetchUserById() {
      const activePage = this.page[this.activeName];
      getInfoByName(
        this.$route.params.username,
        activePage.current,
        activePage.size
      ).then((res) => {
        const { data } = res;
        this.topicUser = data.user;

        if (this.activeName == "bided") {
          this.bids = data.bidPage.records;
          this.page[this.activeName].current = data.bidPage.current;
          this.page[this.activeName].size = data.bidPage.size;
          this.page[this.activeName].total = data.bidPage.total;
        } else if (this.activeName == "pay") {
          this.wons = data.wonPage.records;
          var i = 0;
          this.wons.forEach((item) => {
            if (item.isPay == 0) {
              this.pays[i++] = item;
            }
          });
          this.page[this.activeName].current = data.wonPage.current;
          this.page[this.activeName].size = data.wonPage.size;
          this.page[this.activeName].total = this.pays.length;
        }
      });
    },
    handleClick(tab) {
      this.activeName = tab.name;
      this.fetchUserById();
    },
  },
};
</script>
