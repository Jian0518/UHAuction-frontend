<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card
        shadow="hover"
        :body-style="{ padding: '20px' }"
        class="dashboard-card"
      >
        <div class="card-content">
          <div class="card-right">
            <div class="card-num">{{ bidCount }}</div>
            <div><b>Total Participated Bids</b></div>
          </div>
        </div>
      </el-card>

      <el-card
        shadow="hover"
        :body-style="{ padding: '20px' }"
        class="dashboard-card"
      >
        <div class="card-content" @click="collectedFundModal">
          <div class="card-right">
            <div class="card-num">RM {{ totalFund }}</div>
            <div><b>Total Funds Raised</b></div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card
        shadow="hover"
        :body-style="{ padding: '20px' }"
        class="dashboard-card"
      >
        <div class="card-content">
          <div class="card-right">
            <div class="card-num">{{ itemCount }}</div>
            <div><b>Total Donated Items</b></div>
          </div>
        </div>
      </el-card>

      <el-card
        shadow="hover"
        :body-style="{ padding: '20px' }"
        class="dashboard-card"
      >
        <div class="card-content" @click="usedFundModal">
          <div class="card-right">
            <div class="card-num">RM {{ totalUsedFund }}</div>
            <div><b>Total Funds Utilized</b></div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card shadow="hover">
        <canvas
          id="fundTypeChart"
          style="max-width: 400px; height: 260px; margin: 0 auto"
        ></canvas>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card shadow="hover" :body-style="{ padding: '40px' }">
        <canvas
          id="fundMonthChart"
          style="max-width: 400px; height: 260px; margin: 0 auto"
        ></canvas>
      </el-card>

      <el-card
        shadow="hover"
        :body-style="{ padding: '30px' }"
        class="dashboard-card"
      >
        <div class="card-content" @click="trendModal">
          <div class="card-left"></div>
          <div class="card-right">
            <div class="card-num">{{ trendCategory }}</div>
            <div><b>Most Trending Category Item for Last Month </b></div>
          </div>
        </div>
      </el-card>

      <el-card
        shadow="hover"
        :body-style="{ padding: '30px' }"
        class="dashboard-card"
      >
        <div class="card-content">
          <div class="card-left"></div>
          <div class="card-right">
            <div class="card-num">{{ percentageChange }}%</div>
            <div><b>Increase in Collected Funds Compared to Last Month</b></div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card
        shadow="hover"
        :body-style="{ padding: '30px' }"
        class="dashboard-card"
      >
        <div class="card-content" @click="donorModal">
          <div class="card-left"></div>
          <div class="card-right">
            <div class="card-num">{{ topDonor }}</div>
            <div><b>Top Donor</b></div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card
        shadow="hover"
        :body-style="{ padding: '30px' }"
        class="dashboard-card"
      >
        <div class="card-content" @click="bidderModal">
          <div class="card-left"></div>
          <div class="card-right">
            <div class="card-num">{{ topBidder }}</div>
            <div><b>Top Bidder</b></div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card
        shadow="hover"
        :body-style="{ padding: '30px' }"
        class="dashboard-card"
      >
        <div class="card-content">
          <div class="card-right">
            <div class="card-num">{{ itemThisMonth }}</div>
            <div><b>Newly Added Items</b></div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="6">
      <el-card
        shadow="hover"
        :body-style="{ padding: '30px' }"
        class="dashboard-card"
      >
        <div class="card-content">
          <div class="card-left"></div>
          <div class="card-right">
            <div class="card-num">{{ AvgBid }}</div>
            <div><b>Average Bid Amount </b></div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card shadow="hover" :body-style="{ padding: '40px' }">
        <canvas
          id="itemsByMonthChart"
          style="max-width: 400px; height: 260px; margin: 0 auto"
        ></canvas>
      </el-card>
    </el-col>

    <el-col :span="24">
      <el-card shadow="hover" :body-style="{ padding: '40px' }">
        <canvas
          id="categoryChart"
          style="max-width: 800px; height: 400px; margin: 0 auto"
        ></canvas>
      </el-card>
    </el-col>

    <el-col :span="24"> </el-col>

    <!-- Collected Fund Modal -->
    <el-dialog :visible.sync="showCollectedFundModal" width="80%" center>
      <h2 slot="title"><b>Fund Collected Details</b></h2>
      <el-table :data="items" style="width: 100%">
        <el-table-column label="ID">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="{ row }">
            <span>{{ userNames[row.winnerId] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Item"></el-table-column>
        <el-table-column prop="highestBid" label="Amount"></el-table-column>
        <el-table-column label="Date">
          <template slot-scope="{ row }">
            <span>{{ formatDate(row.endTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadFundCollectedExcel"
          >Download Excel</el-button
        >
        <el-button @click="collectedFundModal">Close</el-button>
      </span>
    </el-dialog>

    <!-- Fund Used Modal -->
    <el-dialog :visible.sync="showUsedFundModal" width="80%" center>
      <h2 slot="title"><b>Fund Used Details</b></h2>
      <el-table :data="fund" style="width: 100%">
        <el-table-column label="ID">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Description"
        ></el-table-column>
        <el-table-column prop="amount" label="Amount"></el-table-column>
        <el-table-column label="Date">
          <template slot-scope="{ row }">
            <span>{{ formatDate(row.date) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Type"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadFundUsedAsExcel">Download Excel</el-button>
        <el-button @click="usedFundModal">Close</el-button>
      </span>
    </el-dialog>

    <!-- Donor Modal -->
    <el-dialog :visible.sync="showDonorModal" width="80%" center>
      <h2 slot="title"><b>Donor Ranking</b></h2>
      <el-table :data="donors" style="width: 100%">
        <el-table-column label="Rank">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="alias" label="Name"></el-table-column>
        <el-table-column
          prop="amount"
          label="Amount of Donated Item"
        ></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
       <el-button @click="downloadDonorRankingAsExcel">Download Excel</el-button>
        <el-button @click="donorModal">Close</el-button>
      </span>
    </el-dialog>

    <!-- Bidder Modal -->
    <el-dialog :visible.sync="showBidderModal" width="80%" center>
      <h2 slot="title"><b>Bidder Ranking</b></h2>
      <el-table :data="bidders" style="width: 100%">
        <el-table-column label="Rank">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="alias" label="Name"></el-table-column>
        <el-table-column prop="amount" label="Amount(RM)"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadBidderRankingAsExcel">Download Excel</el-button>
        <el-button @click="bidderModal">Close</el-button>
      </span>
    </el-dialog>

    <!-- Trend Modal -->
    <el-dialog :visible.sync="showTrendModal" width="80%" center>
      <h2 slot="title"><b>Most Trending Category Item for Last Month </b></h2>
      <el-table :data="trend" style="width: 100%">
        <el-table-column label="Rank">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="amount" label="Amount(Bid)"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="trendModal">Close</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { getFund } from "@/api/fund";
import {
  getTopBidder,
  getTopDonor,
  getFundByMonth,
  getTrend,
  getAllItem,
  getItemByMonth,
} from "@/api/item";
import { getCategory } from "@/api/category";
import { getUserName } from "@/api/user";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccount } from "@mdi/js";
import { getAllBid, getAvgBid } from "@/api/bid";
import {
  Chart,
  BarController,
  BarElement,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

export default {
  name: "Fund",
  data() {
    return {
      items: [],
      itemsByMonth: [],
      fund: [],
      donors: [],
      bidders: [],
      topDonor: "",
      topBidder: "",
      trendCategory: "",
      imgUrl: [],
      fundMonth: [],
      category: [],
      trend: [],
      percentageChange: 0,
      itemThisMonth: 0,
      AvgBid: 0,
      totalFund: 0.0,
      totalUsedFund: 0.0,
      value: {
        highestBid: 0,
      },
      userNames: {}, // This will store user names
      fundTypeData: {},
      showCollectedFundModal: false, // Control modal visibility
      showUsedFundModal: false,
      showBidderModal: false,
      showDonorModal: false,
      showTrendModal: false,
      path: mdiAccount,
      itemCount: 0,
      bidCount: 0,
    };
  },
  components: {
    SvgIcon,
  },
  created() {
    this.fetchFund();
    this.fetchItem();
    this.fetchBid();
    this.fetchTopBidder();
    this.fetchTopDonor();
    this.fetchFundMonth();
    this.fetchCategory();
    this.fetchTrend();
    this.fetchItemByMonth();
    this.fetchAvgBid();
  },
  methods: {
    collectedFundModal() {
      this.showCollectedFundModal = !this.showCollectedFundModal;
    },
    usedFundModal() {
      this.showUsedFundModal = !this.showUsedFundModal;
    },
    donorModal() {
      this.showDonorModal = !this.showDonorModal;
    },
    bidderModal() {
      this.showBidderModal = !this.showBidderModal;
    },
    trendModal() {
      this.showTrendModal = !this.showTrendModal;
    },
    showName(id) {
      getUserName(id).then((response) => {
        return response.data;
      });
    },
    fetchAvgBid() {
      getAvgBid().then((result) => {
        this.AvgBid = result.data;
      });
    },
    fetchCategory() {
      getCategory().then((result) => {
        this.category = result.data;
        this.renderCategoryChart();
      });
    },
    renderCategoryChart() {
      const ctx = document.getElementById("categoryChart").getContext("2d");
      const labels = this.category.map((item) => item.name);
      const data = this.category.map((item) => item.itemCount);
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Number of Items",
              data: data,
              backgroundColor: "#36A2EB",
              borderColor: "#36A2EB",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Number of Items per Category",
              font: {
                size: 18,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Category",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Items",
              },
              beginAtZero: true,
            },
          },
        },
      });
    },

    fetchItemByMonth() {
      getItemByMonth().then((result) => {
        this.itemsByMonth = result.data;
        this.itemThisMonth = result.data[result.data.length - 1].amount;
        this.renderItemsByMonthChart();
      });
    },
    downloadFundCollectedExcel() {
      // Prepare data for Excel
      const data = this.items.map((item, index) => ({
        ID: index + 1,
        Name: this.userNames[item.winnerId] || "Unknown",
        Item: item.title,
        Amount: item.highestBid,
        Date: this.formatDate(item.endTime),
      }));

      // Create a worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Collected Funds");

      // Generate and download Excel file
      XLSX.writeFile(workbook, "Collected_Funds.xlsx");
    },
    downloadFundUsedAsExcel() {
      const data = this.fund.map((item, index) => ({
        ID: index + 1,
        Description: item.description,
        Amount: item.amount,
        Date: this.formatDate(item.date),
        Type: item.type,
      }));

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create a workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Fund Used");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "Fund_Used_Details.xlsx");
    },
    downloadDonorRankingAsExcel() {
      const data = this.donors.map((donor, index) => ({
        Rank: index + 1,
        Name: donor.alias,
        "Amount of Donated Item": donor.amount,
      }));

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create a workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Donor Ranking");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "Donor_Ranking.xlsx");
    },
    downloadBidderRankingAsExcel() {
      const data = this.bidders.map((bidder, index) => ({
        Rank: index + 1,
        Name: bidder.alias,
        "Amount(RM)": bidder.amount,
      }));

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Create a workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bidder Ranking");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "Bidder_Ranking.xlsx");
    },
    renderItemsByMonthChart() {
      const ctx = document.getElementById("itemsByMonthChart").getContext("2d");
      const labels = this.itemsByMonth.map((item) => item.month_year);
      const data = this.itemsByMonth.map((item) => item.amount);
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Items Donated",
              data: data,
              backgroundColor: "#36A2EB",
              borderColor: "#36A2EB",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Items Donated by Month",
              font: {
                size: 18,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Month",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Items",
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
    fetchTrend() {
      getTrend()
        .then((result) => {
          if (result.data && result.data.length > 0) {
            this.trend = result.data;
            this.trendCategory = this.trend[0].name;
          } else {
            this.trend = [];
            this.trendCategory = "No category available";
          }
        })
        .catch((error) => {
          console.error("Error fetching trend data:", error);
          this.trend = [];
          this.trendCategory = "Error fetching data";
        });
    },

    fetchFund() {
      getFund().then((result) => {
        this.fund = result.data;
        const fundTypeCounts = {};
        this.fund.forEach((element) => {
          this.totalUsedFund += element.amount;
          if (fundTypeCounts[element.type]) {
            fundTypeCounts[element.type] += element.amount;
          } else {
            fundTypeCounts[element.type] = element.amount;
          }
        });
        this.fundTypeData = fundTypeCounts;
        this.renderChart();
      });
    },
    fetchItem() {
      getAllItem().then((response) => {
        this.itemCount = response.data.length;
        this.value = response.data;
        this.value.forEach((element) => {
          if (element.isPay >= 1) {
            this.totalFund += element.highestBid;
            this.items.push(element);
            // Fetch and store the user name
            getUserName(element.winnerId).then((resp) => {
              this.$set(this.userNames, element.winnerId, resp.data);
            });
          }
        });
      });
    },
    fetchTopBidder() {
      getTopBidder().then((response) => {
        this.bidders = response.data;
        this.topBidder = this.bidders[0].alias;
      });
    },
    fetchFundMonth() {
      getFundByMonth().then((response) => {
        this.fundMonth = response.data;
        this.calculatePercentageChange();
        this.renderFundMonthChart();
      });
    },
    calculatePercentageChange() {
      if (this.fundMonth.length < 2) {
        this.percentageChange = 0;
        return;
      }

      const currentMonth = this.fundMonth[this.fundMonth.length - 2].amount;
      const lastMonth = this.fundMonth[this.fundMonth.length - 3].amount;

      if (lastMonth === 0) {
        this.percentageChange = currentMonth === 0 ? 0 : 100;
      } else {
        this.percentageChange = (
          ((currentMonth - lastMonth) / lastMonth) *
          100
        ).toFixed(2);
      }
    },
    fetchTopDonor() {
      getTopDonor().then((response) => {
        this.donors = response.data;
        this.topDonor = this.donors[0].alias;
      });
    },
    fetchBid() {
      getAllBid().then((response) => {
        this.bidCount = response.data.length;
      });
    },
    renderChart() {
      const ctx = document.getElementById("fundTypeChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(this.fundTypeData),
          datasets: [
            {
              data: Object.values(this.fundTypeData),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#36CE84"],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#36CE84",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
            title: {
              display: true,
              text: "Distribution of Funds Utilization",
              font: {
                size: 18,
              },
            },
          },
        },
      });
    },
    renderFundMonthChart() {
      const ctx = document.getElementById("fundMonthChart").getContext("2d");
      const labels = this.fundMonth.map((item) => item.month_year);
      const data = this.fundMonth.map((item) => item.amount);
      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Funds Collected",
              data: data,
              borderColor: "#36A2EB",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Funds Collected by Month",
              font: {
                size: 18,
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Month",
              },
            },
            y: {
              title: {
                display: true,
                text: "Amount (RM)",
              },
            },
          },
        },
      });
    },
    formatDate(date) {
      const formattedDate = new Date(date);
      return formattedDate.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  text-align: center;
}

.card-left {
  display: flex;
  font-size: 3rem;
}

.card-right {
  flex: 1;
  text-align: left;
  font-size: 14px;
}

.card-num {
  font-size: 30px;
  font-weight: bold;
  color: #409eff;
}

.card-icon {
  width: 50px;
  height: 50px;
  color: #409eff;
}

h3 {
  margin: 10px 0;
  text-align: center;
}

.cav-info {
  border-radius: 6px;
  height: 400px;
  background-color: white;
}

.el-dialog__wrapper {
  z-index: 2000; /* Ensure modal appears above other elements */
}
</style>