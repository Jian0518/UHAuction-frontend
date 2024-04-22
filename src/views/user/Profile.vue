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
      </div>

      <div class="column">
        <!--item donated by user-->
        <el-card class="box-card content" shadow="never">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="Donated Item" name="donated">
              <div v-if="items.length === 0">No item</div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in items"
                  :key="index"
                  class="media"
                >
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
                        >
                          {{ item.title }}
                        </router-link>
                      </el-tooltip>
                    </div>
                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          Created:{{
                            dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss")
                          }}
                        </span>
                        <div v-if="token">
                          <div
                            v-if="topicUser.username === user.username"
                            class="level"
                          >
                            <div class="level-item mr-1">
                              <router-link
                                :to="{
                                  name: 'item-edit',
                                  params: { id: item.id },
                                }"
                              >
                                <span class="tag is-warning">Edit</span>
                              </router-link>
                            </div>
                            <div class="level-item">
                              <a @click="confirmDelete(item.id)">
                                <span class="tag is-danger">Delete</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>

                  <div class="level-item mr-2">
                    <router-link
                      :to="{
                        name: 'item-detail',
                        params: { id: item.id },
                      }"
                    >
                      <span
                        v-if="item.isPay == 0"
                        :href="item.payLink"
                        class="button is-link"
                        outlined
                      >
                        Pending
                      </span>
                    </router-link>

                    <b-button
                      v-if="item.isPay == 1"
                      class="button is-warning"
                      tag="router-link"
                      :to="{ path: '/winner/info/' + item.id }"
                      outlined
                    >
                      To Be Delivered
                    </b-button>

                    <b-button
                      v-if="item.isPay == 2"
                      class="button is-info"
                      tag="router-link"
                      :to="{ path: '/winner/info/' + item.id }"
                      
                    >
                      Delivered
                    </b-button>
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

            <el-tab-pane label="Bided Item" name="bided">
              <div v-if="bids.length === 0">No item</div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in bids"
                  :key="index"
                  class="media"
                >
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
                        >
                          {{ item.title }}
                        </router-link>
                      </el-tooltip>
                    </div>
                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          Created:{{
                            dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss")
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
                          class="level-item mr-2"
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
                            <span
                              class="tag is-medium"
                              :class="{
                                'is-warning': item.winnerId == user.id,
                                'is-danger': item.winnerId != user.id,
                              }"
                            >
                              {{ item.winnerId == user.id ? "Win" : "Lost" }}
                            </span>
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
                            <span class="tag is-info is-medium">Pending</span>
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

            <el-tab-pane label="Won Item" name="won">
              <div v-if="wons.length === 0">No item</div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in wons"
                  :key="index"
                  class="media"
                >
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
                        >
                          {{ item.title }}
                        </router-link>
                      </el-tooltip>
                    </div>
                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-1">
                          Created:{{
                            dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss")
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
                        <a
                          v-if="item.isPay == 0"
                          :href="item.payLink"
                          class="button is-success"
                        >
                          Pay
                        </a>

                        <button
                          v-if="item.isPay == 1"
                          class="button is-success"
                          disabled
                        >
                          Paid
                        </button>

                        <b-button
                          v-if="item.isPay == 2"
                          class="button is-primary"
                          tag="router-link"
                          :to="{ path: '/winner/info/' + item.id }"
                          
                        >
                          To Receive
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
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getInfoByName } from "@/api/user";
import pagination from "@/components/Pagination/index";
import { mapGetters } from "vuex";
import { deleteItem } from "@/api/item";

export default {
  name: "Profile",
  components: { pagination },
  data() {
    return {
      currentDate: new Date().toISOString().slice(0, 10),
      activeName: "donated",
      topicUser: {},
      items: [],
      bids: [],
      wons: [],
      page: {
        donated: { current: 1, size: 5, total: 0 },
        bided: { current: 1, size: 5, total: 0 },
        won: { current: 1, size: 5, total: 0 },
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
    fetchUserById() {
      const activePage = this.page[this.activeName];
      getInfoByName(
        this.$route.params.username,
        activePage.current,
        activePage.size
      ).then((res) => {
        const { data } = res;
        this.topicUser = data.user;
        //this[`${this.activeName}s`] = data.items.records;
        if (this.activeName == "donated") {
          this.items = data.items.records;
          this.page[this.activeName].current = data.items.current;
          this.page[this.activeName].size = data.items.size;
          this.page[this.activeName].total = data.items.total;
        } else if (this.activeName == "bided") {
          this.bids = data.bidPage.records;
          this.page[this.activeName].current = data.bidPage.current;
          this.page[this.activeName].size = data.bidPage.size;
          this.page[this.activeName].total = data.bidPage.total;
        } else {
          this.wons = data.wonPage.records;
          this.page[this.activeName].current = data.wonPage.current;
          this.page[this.activeName].size = data.wonPage.size;
          this.page[this.activeName].total = data.wonPage.total;
        }
      });
    },
    handleClick(tab) {
      this.activeName = tab.name;
      this.fetchUserById();
    },
    confirmDelete(id) {
      if (window.confirm("Are you sure you want to delete this item?")) {
        this.handleDelete(id);
      }
    },
    handleDelete(id) {
      deleteItem(id).then((value) => {
        const { code, message } = value;
        alert(message);

        if (code === 200) {
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 500);
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
