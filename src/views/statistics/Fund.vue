<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="card-content">
            <div class="card-left">
              <i class="fa fa-heart"></i>
            </div>
            <div class="card-right">
              <div class="card-num">RM {{ totalFund }}</div>
              <div>Total Fund Collected</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="card-content">
            <div class="card-left">
              <i class="fa fa-cloud"></i>
            </div>
            <div class="card-right">
              <div class="card-num">RM {{ totalUsedFund }}</div>
              <div>Total Fund Used</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-col :span="24">
      <el-card shadow="hover" :body-style="{ padding: '40px' }">
         <canvas id="fundTypeChart" style="max-width: 400px; margin: 0 auto;"></canvas>
      </el-card>
    </el-col>

    <el-table :data="fund" style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column prop="amount" label="Amount"></el-table-column>
      <el-table-column label="Date">
        <template slot-scope="{ row }">
          <span>{{ formatDate(row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFund } from "@/api/fund";
import { getAllItem } from "@/api/item";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(PieController, ArcElement, Tooltip, Legend);

export default {
  name: "Fund",

  data() {
    return {
      imgUrl: [],
      totalFund: 0.0,
      totalUsedFund: 0.0,
      fund: [],
      value: {
        highestBid: 0,
      },
      fundTypeData: {},
    };
  },
  created() {
    this.fetchFund();
    this.fetchItem();
  },
  methods: {
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
        this.value = response.data;
        this.value.forEach((element) => {
          this.totalFund += element.highestBid;
        });
      });
    },
    renderChart() {
      const ctx = document.getElementById('fundTypeChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(this.fundTypeData),
          datasets: [{
            data: Object.values(this.fundTypeData),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          }
        }
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
.card-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100px;
  padding-left: 20%;
  text-align: center;
}

.card-left {
  display: flex;
  font-size: 3rem;
}

.card-right {
  flex: 1;
  font-size: 14px;
}

.card-num {
  font-size: 30px;
  font-weight: bold;
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
</style>
