<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Ongoing Events" name="ongoing">
            <article class="media">
              <div class="media-content">
                <div class="columns is-multiline">
                  <div
                    v-for="(item, index) in ongoingList"
                    :key="index"
                    class="column is-half"
                  >
                    <el-card
                      class="centered-card has-text-centered"
                      shadow="hover"
                    >
                      <!-- Wrap each column in el-card -->
                      <p class="ellipsis is-ellipsis-1">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="item.title"
                          placement="top"
                        >
                          <router-link
                            :to="{
                              name: 'item-detail',
                              params: { id: item.id },
                            }"
                          >
                            <div class="is-size-5 has-text-weight-bold mb-4 truncate">
                              {{ item.title }}
                            </div>
                            <div class="center-image-wrapper">
                              <!-- Center the image -->
                              <figure
                                class="image is-128x128"
                                v-if="item.image && item.image.name"
                                style="margin: 0 auto"
                              >
                                <img
                                  :src="`http://localhost:9000/uhauction/item/img/${item.image.name}`"
                                  style="border-radius: 5px"
                                />
                              </figure>
                            </div>
                          </router-link>
                        </el-tooltip>
                      </p>
                      <br />

                      <span
                        :style="{
                          color: 'red',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }"
                        >{{ countdownTimers[item.id]?.countdown }}</span
                      >

                      <nav class="level has-text-grey is-mobile is-size-7 mt-2">
                        <div class="level-left">
                          <span
                            v-for="(tag, index) in item.tags"
                            :key="index"
                            class="tag is-hidden-mobile is-success is-light mr-1"
                          >
                            <router-link
                              :to="{ name: 'tag', params: { name: tag.name } }"
                            >
                              {{ "#" + tag.name }}
                            </router-link>
                          </span>
                        </div>
                      </nav>
                    </el-card>
                  </div>
                </div>
              </div>

              <div class="media-right" />
            </article>
          </el-tab-pane>

          <el-tab-pane label="Past Events" name="past">
            <article class="media">
              <div class="media-content">
                <div class="columns is-multiline">
                  <div
                    v-for="(item, index) in pastList"
                    :key="index"
                    class="column is-half"
                  >
                    <el-card
                      class="centered-card has-text-centered"
                      shadow="hover"
                    >
                      <!-- Wrap each column in el-card -->
                      <p class="ellipsis is-ellipsis-1">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="item.title"
                          placement="top"
                        >
                          <router-link
                            :to="{
                              name: 'item-detail',
                              params: { id: item.id },
                            }"
                          >
                            <div class="is-size-5 has-text-weight-bold mb-4 truncate">
                              {{ item.title }}
                            </div>
                            <div class="center-image-wrapper">
                              <!-- Center the image -->
                              <figure
                                class="image is-128x128"
                                v-if="item.image && item.image.name"
                                style="margin: 0 auto"
                              >
                                <img
                                  :src="`http://localhost:9000/uhauction/item/img/${item.image.name}`"
                                  style="border-radius: 5px"
                                />
                              </figure>
                            </div>
                          </router-link>
                        </el-tooltip>
                      </p>
                      <br />

                      <span
                        :style="{
                          color: 'red',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }"
                        >{{ countdownTimers[item.id]?.countdown }}</span
                      >

                      <nav class="level has-text-grey is-mobile is-size-7 mt-2">
                        <div class="level-left">
                          <span
                            v-for="(tag, index) in item.tags"
                            :key="index"
                            class="tag is-hidden-mobile is-success is-light mr-1"
                          >
                            <router-link
                              :to="{ name: 'tag', params: { name: tag.name } }"
                            >
                              {{ "#" + tag.name }}
                            </router-link>
                          </span>
                        </div>
                      </nav>
                    </el-card>
                  </div>
                </div>
              </div>

              <div class="media-right" />
            </article>
          </el-tab-pane>
        </el-tabs>
      </div>

      <pagination
        v-show="false"
        :total="page.total"
        :page.sync="page.current"
        :limit.sync="page.size"
        @pagination="init"
      />
    </el-card>
  </div>
</template>

<script>
import { getList, setEnd, notify } from "@/api/item";
import Pagination from "@/components/Pagination";

export default {
  name: "TopicList",
  components: { Pagination },
  data() {
    return {
      activeName: "ongoing",
      ongoingList: [],
      expiredItems: [],
      pastList: [],
      page: {
        current: 1,
        size: 100,
        total: 0,
        tab: "ongoing",
      },
      countdownTimers: {}, // Object to store countdown timers for each item
    };
  },

  created() {
    this.init(this.tab);
  },
  methods: {
    init(tab) {
      getList(this.page.current, this.page.size, tab).then((response) => {
        const { data } = response;
        this.page.current = data.current;
        this.page.size = data.total;
        this.page.total = data.total;
        this.ongoingList = data.records;
        // Start countdown timers for each item
        this.ongoingList.forEach((item) => {
          this.startCountdownTimer(item);
        });
      });
    },
    handleClick(tab) {
      this.page.current = 1;
      this.init(tab.name);
    },
    // Method to start countdown timer for an item
    startCountdownTimer(item) {
      if (!item.endTime) return; // If endTime is not set, do nothing
      const itemId = item.id;
      // Skip starting the timer if the item has already expired
      if (this.expiredItems.includes(itemId)){
        this.ongoingList = this.ongoingList.filter((i) => i.id !== itemId);
        return;
      } 

      const endTime = new Date(item.endTime).getTime();

      // Clear existing timer if there is one
      if (this.countdownTimers[itemId]?.intervalId) {
        clearInterval(this.countdownTimers[itemId].intervalId);
      }

      // Update the countdown every second
      const intervalId = setInterval(() => {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
          if(item.isEnd==0){
            setEnd(item);
          }
          console.log("AAAAAAAAAAAAAAA")
          console.log(item)
          if(item.isNotify==0){
            notify(item);
          }

          clearInterval(intervalId);
          this.$set(this.countdownTimers, itemId, { countdown: "Ended" });

          this.pastList.push(item);
          
          this.ongoingList = this.ongoingList.filter((i) => i.id !== itemId);
          this.expiredItems.push(itemId); // Mark item as expired
          return;
        }

        // Calculate time parts
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update the countdown for this item
        this.$set(this.countdownTimers, itemId, {
          countdown: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          intervalId: intervalId,
        });
      }, 1000);

      // Initialize the countdown timer for the item
      this.$set(this.countdownTimers, itemId, {
        countdown: "Calculating...",
        intervalId: intervalId,
      });
    },

    beforeDestroy() {
      Object.values(this.countdownTimers).forEach(({ intervalId }) => {
        clearInterval(intervalId);
      });
    },
  },
};
</script>

<style scoped>
.center-image-wrapper {
  display: flex;
  justify-content: center;
}
.truncate {
  text-overflow: ellipsis;
  overflow: hidden;

}
</style>