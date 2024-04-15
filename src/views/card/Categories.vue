<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>🏷️ Category</span>
    </div>
    <div>
      
      <p v-for="(item, index) in categories" :key="index" class="block">
          <router-link :to="{ name: 'tag', params: { name: item.name } }">{{ item.name }}</router-link>
      </p> 
    </div>
  </el-card>
</template>

<script>
import {getCategory} from '@/api/category'

export default {
  name: 'Categories',
  data() {
    return {
      categories: []
    }
  },
  created() {
    this.fetchCategory()
  },
  methods: {
    fetchCategory() {
      getCategory().then(response => {
        const { data } = response
        this.categories = data
      })
    }
  }
}
</script>

<style scoped>

</style>
