<template>
  <section>
    <el-card shadow="never" class="box-card">
      <template slot="header">
        <div class="header-content has-text-weight-bold is-size-5">
          <span>Favorite Items</span>
          <el-button
        type="danger"
        :disabled="!multipleSelection.length"
        @click="deleteSelected"
        class="delete-button"
      >
        Delete
      </el-button>
        </div>
      </template>
      
      <div class="shopping-cart">
        <el-table
          :data="items"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column label="Item Details">
            <template slot-scope="scope">
              <article class="media box my-4">
                <div class="media-left">
                  <figure class="image is-64x64">
                    <router-link
                      :to="{
                        name: 'item-detail',
                        params: { id: scope.row.id },
                      }"
                    >
                      <img
                        :src="`http://localhost:9000/uhauction/item/img/${scope.row.cover}`"
                        class="item-image"
                      />
                    </router-link>
                  </figure>
                </div>
                <div class="media-content">
                  <div class="content">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.title"
                      placement="top"
                    >
                      <router-link
                        :to="{
                          name: 'item-detail',
                          params: { id: scope.row.id },
                        }"
                      >
                        <span class="is-size-5 has-text-weight-bold">{{
                          scope.row.title
                        }}</span>
                      </router-link>
                    </el-tooltip>
                  </div>
                  <nav class="level has-text-grey is-size-6 mt-2">
                    <div class="level-left">
                      <span
                        >End Time:
                        {{
                          dayjs(scope.row.endTime).format("YYYY-MM-DD HH:mm:ss")
                        }}</span
                      >
                    </div>
                  </nav>
                </div>
              </article>
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
      multipleSelection: [],
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      getFavoriteItem(this.$route.params.username).then((response) => {
        this.items = response.data.items.records;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteSelected() {
      // Implement the delete function here
      console.log("Delete selected items: ", this.multipleSelection);
    },
  },
};
</script>

<style scoped>
.item-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
}

.shopping-cart {
  padding: 20px;
}

.el-card {
  margin: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem; /* equivalent to is-size-5 in Bulma */
  font-weight: bold;
}

.delete-button {
  margin-left: auto;
}

.el-table th,
.el-table td {
  text-align: center;
}
</style>
