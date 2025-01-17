<template>
  <section class="box comments">
    <hr />
    <h3 class="title is-5">Comments</h3>
    <lv-comments-form :slug="slug" v-if="token" @loadComments="fetchComments"/>
    <div v-else class="empty-state">
      <i><b>Please login to comment</b></i>
    </div>
    <lv-comments-item
      v-for="comment in comments"
      :key="`comment-${comment.id}`"
      :comment="comment"
    />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchCommentsByItemId } from '@/api/comment'
import LvCommentsForm from './CommentsForm'
import LvCommentsItem from './CommentsItem'

export default {
  name: 'LvComments',
  components: {
    LvCommentsForm,
    LvCommentsItem
  },
  data() {
    return {
      comments: []
    }
  },
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  async mounted() {
    await this.fetchComments(this.slug)
  },
  methods: {
    // initialize
    async fetchComments(item_id) {
      fetchCommentsByItemId(item_id).then(response => {
        const { data } = response
        this.comments = data
      })
    }
  }
}
</script>

<style scoped>
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>