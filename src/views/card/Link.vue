<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>🥂 Links</span>
    </div>
    <div>
      <p v-for="(item, index) in list" :key="index" class="block">
        <a :href="item.link" target="_blank">{{ item.title }}</a>
      </p>
    </div>
  </el-card>
</template>

<script>
import { getList } from '@/api/link'

export default {
  name: 'Link',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      getList().then((response) => {
        const { data } = response
        this.list = data
      })
    }
  }
}
</script>

<style scoped>
</style>
