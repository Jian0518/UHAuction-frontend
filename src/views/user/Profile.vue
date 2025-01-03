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
            <el-tab-pane label="All Donated Items" name="donated">
              <div v-if="items.length === 0">No item</div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in items"
                  :key="index"
                  class="media box"
                >
                  <!-- <div class="media-left"> -->
                  <router-link
                    :to="{ name: 'item-detail', params: { id: item.id } }"
                  >
                    <figure class="image is-96x96">
                      <img
                        :src="`http://localhost:9000/uhauction/item/img/${item.cover}`"
                      />
                    </figure>
                  </router-link>
                  <!-- </div> -->
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
                        <span
                          v-if="item.isPay == 0"
                          :href="item.payLink"
                          class="button is-info is-light fixed-width-button is-light"
                        >
                          Pending
                        </span>
                      </router-link>

                      <b-button
                        v-if="item.isPay == 1"
                        class="button is-success fixed-width-button is-light"
                        tag="router-link"
                        :to="{ path: '/winner/info/' + item.id }"
                      >
                        To Deliver
                      </b-button>

                      <b-button
                        v-if="item.isPay == 2"
                        class="button is-warning fixed-width-button is-light"
                        tag="router-link"
                        :to="{ path: '/winner/info/' + item.id }"
                      >
                        Delivered
                      </b-button>

                      <b-button
                        v-if="item.isPay == 3"
                        class="button is-black is-primary fixed-width-button is-light"
                        tag="router-link"
                        :to="{ path: '/winner/info/' + item.id }"
                      >
                        Completed
                      </b-button>
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

            <el-tab-pane
              label="To Deliver"
              name="deliver"
              v-if="topicUser.username === user.username"
            >
              <div
                v-if="delivers.length === 0"
                class="notification is-warning has-text-centered"
              >
                No item
              </div>

              <div v-else class="topicUser-info">
                <article
                  v-for="(item, index) in delivers"
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
                          class="button is-success is-outlined fixed-width-button"
                          tag="router-link"
                          :to="{ path: '/winner/info/' + item.id }"
                        >
                          Deliver
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

            <el-tab-pane
              label="Pending"
              name="pending"
              v-if="topicUser.username === user.username"
            >
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
                        <span class="mr-1"> Bid: RM**** </span>
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
                            v-if="item.isPay == 0"
                            :href="item.payLink"
                            outlined
                            class="button is-info is-outlined fixed-width-button"
                          >
                            Pending
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

            <el-tab-pane
              label="Completed"
              name="complete"
              v-if="topicUser.username === user.username"
            >
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
                          class="button is-primary is-outlined fixed-width-button"
                          tag="router-link"
                          :to="{ path: '/winner/info/' + item.id }"
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
      completes: [],
      delivers: [],
      pendings: [],
      page: {
        donated: { current: 1, size: 5, total: 0 },
        complete: { current: 1, size: 5, total: 0 },
        deliver: { current: 1, size: 5, total: 0 },
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
    fetchUserById() {
      const activePage = this.page[this.activeName];
      getInfoByName(
        this.$route.params.username,
        activePage.current,
        activePage.size
      ).then((res) => {
        const { data } = res;
        this.topicUser = data.user;

        if (this.activeName == "donated") {
          this.items = data.items.records;
          this.page[this.activeName].current = data.items.current;
          this.page[this.activeName].size = data.items.size;
          this.page[this.activeName].total = data.items.total;
        } else if (this.activeName == "complete") {

          this.completes = data.completes.records;
          this.page[this.activeName].current = data.completes.current;
          this.page[this.activeName].size = data.completes.size;
          this.page[this.activeName].total = data.completes.total;

        } else if (this.activeName == "deliver") {
          this.delivers = data.delivers.records;
          this.page[this.activeName].current = data.delivers.current;
          this.page[this.activeName].size = data.delivers.size;
          this.page[this.activeName].total = data.delivers.total;

        } else if (this.activeName == "pending") {

          this.pendings = data.pendings.records;
          this.page[this.activeName].current = data.pendings.current;
          this.page[this.activeName].size = data.pendings.size;
          this.page[this.activeName].total = data.pendings.total;

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
.fixed-width-button {
  width: 120px; /* Set the desired width */
  height: 35px;
  text-align: center; /* Center the text inside the button */
}
</style>
