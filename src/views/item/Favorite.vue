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
import { getFavoriteItem, removeFavorite } from "@/api/favorite";
import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters(["user"]),
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
    async deleteSelected() {
      try {
        // Show confirmation dialog
        await this.$confirm(
          'Are you sure you want to remove these items from favorites?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        );

        // Create an array of promises for all delete operations
        const deletePromises = this.multipleSelection.map(item => 
          removeFavorite(this.user.id, item.id)
        );

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        // Show success message
        this.$message({
          type: 'success',
          message: 'Items removed from favorites successfully!'
        });

        // Refresh the list
        this.fetchList();
        
        // Clear selection
        this.multipleSelection = [];
      } catch (error) {
        // Handle user cancellation or error
        if (error !== 'cancel') {
          this.$message({
            type: 'error',
            message: 'Failed to remove items from favorites: ' + error.message
          });
        }
      }
    }
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
