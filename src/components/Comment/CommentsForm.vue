<template>
  <article class="media">
    <div class="media-content">
      <form @submit.prevent="onSubmit">
        <b-field>
          <b-input
            v-model.lazy="commentText"
            type="textarea"
            maxlength="400"
            placeholder="Add a comment..."
            :disabled="isLoading"
          ></b-input>
        </b-field>
        <nav class="level">
          <div class="level-left">
            <b-button
              type="is-primary"
              native-type="submit"
              class="level-item"
              :disabled="isLoading"
            >
              Comment
            </b-button>
          </div>
        </nav>
      </form>
    </div>
  </article>
</template>

<script>
import { pushComment } from '@/api/comment'

export default {
  name: 'LvCommentsForm',
  data() {
    return {
      commentText: '',
      isLoading: false
    }
  },
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  methods: {
    async onSubmit() {
      this.isLoading = true
      try {
        let postData = {}
        console.log(this.commentText)
        console.log(this.slug);
        postData['content'] = this.commentText
        postData['item_id'] = this.slug
        console.log("Post data: " + postData)
        await pushComment(postData)
        this.$emit('loadComments', this.slug)
        this.$message.success('Comment Success')
      } catch (e) {
        this.$buefy.toast.open({
          message: `Cannot comment this story. ${e}`,
          type: 'is-danger'
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
