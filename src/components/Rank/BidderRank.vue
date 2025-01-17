<template>
  <section class="box comments center-elements interesting-section">
    <el-divider direction="horizontal" />
    <h3 class="title is-5">Bidder Ranking</h3>
    <div v-if="bidders.length === 0" class="empty-state">
      <i><b>No bids have been placed yet</b></i>
    </div>
    <div v-else class="table-container">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th></th>
            <th>RANK</th>
            <th>NAME</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bidder, index) in bidders" :key="index">
            <td>
              <div>
                <figure class="image is-48x48">
                  <img :src="`https://cn.gravatar.com/avatar/${bidder.userId}?s=164&d=monsterid`" class="is-rounded">
                </figure>
              </div>
            </td>
            <td>
              {{ index + 1 }}
            </td>
            <td>
              <div>
                <div>
                  <p>{{ bidder.username }}</p>
                </div>
              </div>
            </td>
            <td>
              ${{ bidder.amount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { getBidder } from "@/api/bid";

export default {
  name: "LVBidderRank",
  data() {
    return {
      bidders: []
    }
  },
  methods: {
    async refreshRanking() {
      try {
        const response = await getBidder(this.slug);
        this.bidders = response.data;
      } catch (error) {
        console.error("Error refreshing bidder ranking:", error);
      }
    }
  },
  mounted() {
    this.refreshRanking();
  },
  props: {
    slug: {
      type: String,
      default: null,
    },
    maxHeight: {
      type: String,
      default: '300px' // Default height for the scrollable area
    }
  }
}
</script>

<style scoped>
.bidder-ranking {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 1rem 0;
}


.table-container {
  max-height: v-bind(maxHeight);
  overflow-y: auto;
  /* border: 1px solid #eee;
  border-radius: 4px; */
}

/* Keep header fixed while scrolling */
.table thead {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.table th {
  padding: 1rem;
  font-weight: 600;
  font-size: 13px;
  color: #666;
  border-bottom: 2px solid #eee;
}

/* Add some padding to the bottom of the table for better scrolling */
.table tbody tr:last-child td {
  border-bottom: none;
  padding-bottom: 1rem;
}

/* Customize scrollbar appearance */
.table-container::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>