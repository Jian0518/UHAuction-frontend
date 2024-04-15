<template>
  <el-card class="" shadow="never">
    <div slot="header">
      <span class="has-text-weight-bold">🩷 You may like it</span>
    </div>
    <div>
      <p v-for="(item,index) in recommend" :key="index" :title="item.title" class="block ellipsis is-ellipsis-1">
        <router-link :to="{name:'item-detail',params: { id: item.id }}">
          <span v-if="index<9" class="tag">
            0{{ parseInt(index) + 1 }}
          </span>
          <span v-else class="tag">
            {{ parseInt(index) + 1 }}
          </span>
          {{ item.title }}
        </router-link>
      </p>
    </div>
  </el-card>
</template>

<script>
import { getRecommendItems } from '@/api/item'

export default {
  name: 'Recommend',
  props: {
    itemId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      recommend: []
    }
  },
  created() {
    this.fetchRecommendItems()
  },
  methods: {
    fetchRecommendItems() {
      getRecommendItems(this.itemId).then(value => {
        const { data } = value
        this.recommend = data
      })
    }
  }
}
</script>

<style scoped>

</style>
