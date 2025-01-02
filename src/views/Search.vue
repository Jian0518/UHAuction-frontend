<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span class="is-size-5 has-text-weight-bold">Retrieved <code>{{ list.length }}</code> item(s) related to <code class="has-text-info">{{ query.keyword }}</code></span>
      </div>
      <div>
        <article v-for="(item, index) in list" :key="index" class="media box my-4">
          <div class="media-left">
            <figure class="image is-64x64">
              <img :src="`http://localhost:9000/uhauction/item/img/${item.cover}`">
            </figure>
          </div>
          <div class="media-content">
            <div>
              <p class="ellipsis is-ellipsis-1">
                <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                  <router-link :to="{name:'item-detail',params:{id:item.id}}">
                    <span class="is-size-5 has-text-weight-bold">{{ item.title }}</span>
                  </router-link>
                </el-tooltip>
              </p>
            </div>
            <nav class="level has-text-grey is-mobile is-size-6 mt-2">
              <div class="level-left">
                <span class="mr-2">Bids: {{ item.bidCount }}</span>
                <span class="mr-2">End time: {{ dayjs(item.endTime).format("YYYY/MM/DD") }}</span>
                <span v-for="(tag, index) in item.tags" :key="index" class="tag is-hidden-mobile is-success is-light mr-1">
                  <router-link :to="{ name: 'tag', params: { name: tag.name } }">
                    {{ "#" + tag.name }}
                  </router-link>
                </span>
              </div>
            </nav>
          </div>
        </article>
      </div>
      <pagination
        v-show="query.total > 0"
        :total="query.total"
        :page.sync="query.pageNum"
        :limit.sync="query.pageSize"
        @pagination="fetchList"
      />
    </el-card>
  </div>
</template>

<script>
import { searchByKeyword } from '@/api/search'
import Pagination from '@/components/Pagination'

export default {
  name: 'Search',
  components: { Pagination },
  data() {
    return {
      list: [],
      query: {
        keyword: this.$route.query.key,
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      searchByKeyword(this.query).then(value => {
        const { data } = value
        this.list = data.records
        this.query.total = data.total
        this.query.pageSize = data.size
        this.query.pageNum = data.current
      })
    }
  }
}
</script>

<style scoped>
.media {
  padding: 1.5rem;
  align-items: center;
}
.media-left {
  margin-right: 1.5rem;
}
</style>
