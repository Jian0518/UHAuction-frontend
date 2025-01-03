<template>
  <div class="member">
    <div class="columns">
      <div class="column is-one-quarter">
        <el-card shadow="never">
          <div slot="header" class="has-text-centered">
            <el-avatar
              :size="64"
              :src="`https://cn.gravatar.com/avatar/${topicUser.id}?s=164&d=monsterid`"
            />
            <p class="mt-3">{{ topicUser.alias || topicUser.username }}</p>
          </div>
          <div>
            <p class="content">
              Points：<code>{{ topicUser.score }}</code>
            </p>
            <p class="content">
              Signup：{{
                dayjs(topicUser.createTime).format("YYYY/MM/DD HH:MM:ss")
              }}
            </p>
          </div>
        </el-card>

        <el-card shadow="never" class="box has-text-centered p-4">
          <div class="content">
            <div class="is-size-5 has-text-weight-bold mb-3">Total Balance</div>
            <div class="is-size-4 has-text-primary mb-5">
              $ {{ topicUser.balance }}
            </div>
            <button
              class="button is-info is-medium is-dark"
              @click="showTopUp = true"
            >
              Add Funds
            </button>
          </div>
        </el-card>
      </div>

      <div class="column">
        <el-card class="box-card content" shadow="never">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="All Bids" name="bided">
              <div
                v-if="bids.length === 0"
                class="notification is-warning has-text-centered"
              >
                No item
              </div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in bids"
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
                    <div class="content ellipsis is-ellipsis-1">
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

                    <nav
                      class="level has-text-danger is-size-6 has-text-weight-bold"
                    >
                      <div class="level-left">
                        <span class="mr-1"> Bid: RM{{ item.highestBid }} </span>
                      </div>
                    </nav>

                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          End Time:{{
                            dayjs(item.endTime).format("YYYY/MM/DD HH:mm:ss")
                          }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <div v-if="token" class="media-right">
                    <div
                      v-if="topicUser.username === user.username"
                      class="level"
                    >
                      <div
                        v-if="new Date(item.endTime) < new Date(currentDate)"
                      >
                        <div
                          class="level-item mr-2 is-outlined"
                          :class="{
                            'is-warning': item.winnerId != user.id,
                            'is-danger': item.winnerId == user.id,
                          }"
                        >
                          <router-link
                            :to="{
                              name: 'item-detail',
                              params: { id: item.id },
                            }"
                          >
                            <b-button
                              class="tag is-medium fixed-width-button is-light"
                              :class="{
                                'is-warning': item.winnerId == user.id,
                                'is-danger': item.winnerId != user.id,
                              }"
                            >
                              {{ item.winnerId == user.id ? "Win" : "Lost" }}
                            </b-button>
                          </router-link>
                        </div>
                      </div>
                      <div v-else>
                        <div class="level-item mr-2">
                          <router-link
                            :to="{
                              name: 'item-detail',
                              params: { id: item.id },
                            }"
                          >
                            <b-button
                              class="tag is-info is-medium fixed-width-button is-light"
                              >Pending</b-button
                            >
                          </router-link>
                        </div>
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
                          {{
                            dayjs(item.endTime).format("YYYY/MM/DD HH:mm:ss")
                          }}
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
                            <el-button @click="showPay = false"
                              >Cancel</el-button
                            >
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

            <el-tab-pane label="To Receive" name="receive">
              <div
                v-if="receives.length === 0"
                class="notification is-warning has-text-centered"
              >
                No item
              </div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in receives"
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
                    <div class="content ellipsis is-ellipsis-1">
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
                    <nav
                      class="level has-text-danger is-size-6 has-text-weight-bold"
                    >
                      <div class="level-left">
                        <span class="mr-1"> Bid: RM{{ item.highestBid }} </span>
                      </div>
                    </nav>

                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          End Time:{{
                            dayjs(item.endTime).format("YYYY/MM/DD HH:mm:ss")
                          }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <div v-if="token" class="media-right">
                    <div
                      v-if="topicUser.username === user.username"
                      class="level"
                    >
                      <div class="level-item mr-2">
                        <b-button
                          class="button is-warning is-outlined fixed-width-button"
                          tag="router-link"
                          :to="{ path: '/winner/receive/' + item.id }"
                        >
                          Receive
                        </b-button>
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

            <el-tab-pane label="Pending" name="pending">
              <div
                v-if="pendings.length === 0"
                class="notification is-warning has-text-centered"
              >
                No item
              </div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in pendings"
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
                    <div class="content ellipsis is-ellipsis-1">
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
                    <nav
                      class="level has-text-danger is-size-6 has-text-weight-bold"
                    >
                      <div class="level-left">
                        <span class="mr-1"> Bid: RM{{ item.highestBid }} </span>
                      </div>
                    </nav>

                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          End Time:{{
                            dayjs(item.endTime).format("YYYY/MM/DD HH:mm:ss")
                          }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <div v-if="token" class="media-right">
                    <div
                      v-if="topicUser.username === user.username"
                      class="level"
                    >
                      <div class="level-item mr-2">
                        <router-link
                          :to="{
                            name: 'item-detail',
                            params: { id: item.id },
                          }"
                        >
                          <b-button
                            class="tag is-info is-medium is-outlined fixed-width-button"
                            >Pending</b-button
                          >
                        </router-link>
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

            <el-tab-pane label="Completed" name="completed">
              <div
                v-if="completes.length === 0"
                class="notification is-warning has-text-centered"
              >
                No item
              </div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in completes"
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
                    <div class="content ellipsis is-ellipsis-1">
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
                    <nav
                      class="level has-text-danger is-size-6 has-text-weight-bold"
                    >
                      <div class="level-left">
                        <span class="mr-1"> Bid: RM{{ item.highestBid }} </span>
                      </div>
                    </nav>

                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          End Time:{{
                            dayjs(item.endTime).format("YYYY/MM/DD HH:mm:ss")
                          }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <div v-if="token" class="media-right">
                    <div
                      v-if="topicUser.username === user.username"
                      class="level"
                    >
                      <div class="level-item mr-2">
                        <b-button
                          v-if="item.isPay == 3"
                          class="button is-primary is-outlined fixed-width-button"
                          tag="router-link"
                          :to="{ path: '/winner/receive/' + item.id }"
                        >
                          Completed
                        </b-button>
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

            <el-tab-pane label="Lost" name="lost">
              <div
                v-if="losts.length === 0"
                class="notification is-warning has-text-centered"
              >
                No item
              </div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in losts"
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
                    <div class="content ellipsis is-ellipsis-1">
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
                    <nav
                      class="level has-text-danger is-size-6 has-text-weight-bold"
                    >
                      <div class="level-left">
                        <span class="mr-1"> Bid: RM{{ item.highestBid }} </span>
                      </div>
                    </nav>

                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          End Time:{{
                            dayjs(item.endTime).format("YYYY/MM/DD HH:mm:ss")
                          }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <div v-if="token" class="media-right">
                    <div
                      v-if="topicUser.username === user.username"
                      class="level"
                    >
                      <div class="level-item mr-2">
                        <router-link
                          :to="{
                            name: 'item-detail',
                            params: { id: item.id },
                          }"
                        >
                          <b-button
                            class="tag is-medium is-danger is-outlined fixed-width-button"
                          >
                            {{ "Lost" }}
                          </b-button>
                        </router-link>
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
            <el-input
              v-model="topUpAmount"
              placeholder="Enter amount"
            ></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showTopUp = false">Cancel</el-button>
              <el-button type="primary" @click="topUpFunc">Top Up</el-button>
            </span>
          </el-dialog>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getBidPage, update, topup } from "@/api/user";
import { updateItem } from "@/api/item"; 
import pagination from "@/components/Pagination/index";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: { pagination },
  data() {
    return {
      currentDate: new Date().toISOString().slice(0, 10),
      activeName: "bided",
      currentItem: null,
      topicUser: {},
      items: [],
      bids: [],
      wons: [],
      receives: [],
      completes: [],
      showPay: false,
      selectedPayment: "",
      pays: [],
      losts: [],
      topUpAmount: 0.0,
      showTopUp: false,
      pendings: [],
      page: {
        bided: { current: 1, size: 5, total: 0 },
        won: { current: 1, size: 5, total: 0 },
        receive: { current: 1, size: 5, total: 0 },
        completed: { current: 1, size: 5, total: 0 },
        pay: { current: 1, size: 5, total: 0 },
        lost: { current: 1, size: 5, total: 0 },
        pending: { current: 1, size: 5, total: 0 },
      },
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
          update(this.topicUser).then((res) => {
            this.$message.success("Payment Successful");
          });
          this.currentItem.isPay = parseInt("1");
          updateItem(this.currentItem).then((res)=>{
            this.$message.success("Updated Successful"); 
          })
          setTimeout(() => {
          window.location.reload();
        }, 1000);

        } else {
          // Display a warning message for insufficient balance
          this.$message.error("Insufficient balance");
        }
      } else {
        this.$message.error("Please select a payment method");
      }
    },
    topUpFunc() {
      // Convert balance and topUpAmount to numbers before addition
      // this.topicUser.balance =
      //   parseFloat(this.topicUser.balance) + parseFloat(this.topUpAmount);

      topup(this.topicUser.id,this.topUpAmount).then((res) => {
        // console.log("Here is the topup link:",res.data); 
        window.location.href = res.data;
      });
    },

    fetchUserById() {
      const activePage = this.page[this.activeName];
      getBidPage(
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
        } else if (this.activeName == "lost") {
          this.losts = data.lostPage.records; 
          this.page[this.activeName].current = data.lostPage.current;
          this.page[this.activeName].size = data.lostPage.size;
          this.page[this.activeName].total = data.lostPage.total;
        } else if (this.activeName == "pending") {
          this.pendings = data.pendingPage.records; 
          this.page[this.activeName].current = data.pendingPage.current;
          this.page[this.activeName].size = data.pendingPage.size;
          this.page[this.activeName].total = data.pendingPage.total;
        } else if (this.activeName == "won") {
          this.wons = data.wonPage.records;
          this.page[this.activeName].current = data.wonPage.current;
          this.page[this.activeName].size = data.wonPage.size;
          this.page[this.activeName].total = data.wonPage.total;
        } else if (this.activeName == "receive") {
          this.receives = data.receivePage.records; 
          this.page[this.activeName].current = data.receivePage.current;
          this.page[this.activeName].size = data.receivePage.size;
          this.page[this.activeName].total = data.receivePage.total;
        } else if (this.activeName == "completed") {
          this.completes = data.completedPage.records; 
          this.page[this.activeName].current = data.completedPage.current;
          this.page[this.activeName].size = data.completedPage.size;
          this.page[this.activeName].total = data.completedPage.total;
        } else if (this.activeName == "pay") {
          this.pays = data.payPage.records; 
          this.page[this.activeName].current = data.payPage.current;
          this.page[this.activeName].size = data.payPage.size;
          this.page[this.activeName].total = data.payPage.total;
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

<style scoped>
.fixed-width-button {
  width: 120px; /* Set the desired width */
  height: 35px;
  text-align: center; /* Center the text inside the button */
}
</style>
