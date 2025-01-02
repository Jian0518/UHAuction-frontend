<template>
  <div id="tag" class="columns">
    <div class="column is-three-quarters">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="has-text-weight-bold is-size-5">
          🔍 Retrieved <span class="has-text-info">{{ topics.length }}</span> item(s) related to
          <span class="has-text-info">{{ this.$route.params.name }}</span>
        </div>

        <div class="text item">
          <article v-for="(item, index) in topics" :key="index" class="media box my-4">
            <div class="media-left">
              <figure class="image is-64x64">
                <img :src="`http://localhost:9000/uhauction/item/img/${item.cover}`">
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                  <router-link :to="{ name: 'item-detail',params:{id: item.id } }">
                    <span class="is-size-5 has-text-weight-bold">{{ item.title }}</span>
                  </router-link>
                </el-tooltip>
              </div>

              <nav class="level has-text-grey is-size-6 mt-2">
                <div class="level-left">
                  <span>End Time: {{ dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  <span class="mx-3">Views: {{ item.view }}</span>
                  <span>Bids: {{ item.bidCount }}</span>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </el-card>
    </div>

    <div class="column">
      <el-card shadow="hover">
        <div slot="header" class="has-text-weight-bold is-size-5">
          🏷 Hot Category
        </div>
        <div>
          <ul>
            <li v-for="(tag, index) in tags" :key="index" class="py-2">
              <router-link :to="{name:'tag',params:{name:tag.name}}">
                <span v-if="index < 9" class="tag">
                  0{{ parseInt(index) + 1 }}
                </span>
                <span v-else class="tag">
                  {{ parseInt(index) + 1 }}
                </span>
                {{ tag.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getItemsByTag } from '@/api/category'

export default {
  name: 'Tag',
  data() {
    return {
      topics: [],
      tags: [],
      paramMap: {
        name: this.$route.params.name,
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList: function() {
      getItemsByTag(this.paramMap).then(response => {
        console.log(response)
        this.topics = response.data.topics.records
        this.tags = response.data.hotTags.records
      })
    }
  }
}
</script>

<style scoped>
#tag {
  min-height: 500px;
}
.media {
  padding: 1.5rem;
  align-items: center;
}
.media-left {
  margin-right: 1.5rem;
}
</style>
