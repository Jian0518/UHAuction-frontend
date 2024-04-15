<template>
  <div class="columns mt-6">
    <div class="column mt-6">
      <div class="mt-6">
        <p class="content">UH OH! 404 Error</p>
        <p class="content subtitle mt-6">
          Page not found, return to main page: {{ times }} seconds!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "404",
  data() {
    return {
      times: 10
    }
  },
  created() {
    this.goHome();
  },
  methods: {
    goHome: function () {
      this.timer = setInterval(() => {
        this.times--
        if (this.times === 0) {
          clearInterval(this.timer)
          this.$router.push({path: '/'});
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
</style>