<template>
  <section>
    <el-card shadow="never">
      <template slot="header">
        <span>Favorite Items</span>
      </template>

      <div class="shopping-cart">
        <el-table :data="items" style="width: 100%">
          <el-table-column prop="image" label="Image" >
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'item-detail', params: { id: scope.row.id } }"
              >
              <img
                :src="`http://localhost:9000/uhauction/item/img/${scope.row.cover}`"
                class="item-image"
              />
              </router-link>
              <!-- <img :src="scope.row.image" alt="Item Image" class="item-image"/> -->
            </template>
          </el-table-column>

          <el-table-column label="Item Name" >
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'item-detail', params: { id: scope.row.id } }"
              >
                {{ scope.row.title }}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="End Time" >
            <template slot-scope="scope">
              End Time: {{ dayjs(scope.row.endTime).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </section>
</template>

<script>
import { getFavoriteItem } from "@/api/favorite";

export default {
  name: "ShoppingCart",
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList: function () {
      getFavoriteItem(this.$route.params.username).then((response) => {
        this.items = response.data.items.records;
      });
    },
  },
};
</script>

<style scoped>
.item-image {
  width: 100px;
  height: auto;
}

.shopping-cart {
  padding: 20px;
}

.el-card {
  margin: 20px;
}

.el-card .header {
  font-size: 24px;
  font-weight: bold;
}
</style>
