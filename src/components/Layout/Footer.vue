<template>
  <footer class="footer has-text-grey-light has-background-grey-darker">
    <div class="container">
      <div class="">
        <span> Supporting UTAR Hospital through Every Auction!</span>

        <span style="float: right">
          <a href="http://localhost:8081/" target="_blank">Login for Admin</a>
        </span>
      </div>

      <div>
        <span>{{ title }} ALL RIGHTS RESERVED</span>
        <div style="float: right">
          <template>
            <b-taglist attached>
              <b-tag type="is-dark" size="is-normal">Design</b-tag>
              <b-tag type="is-info" size="is-normal">{{ author }}</b-tag>
            </b-taglist>
          </template>
        </div>
      </div>
    </div>
    <back-top></back-top>
  </footer>
</template>

<script>
import BackTop from "@/components/Backtop/BackTop";

export default {
  name: "Footer",
  components: {
    BackTop,
  },
  data() {
    return {
      title: "© " + new Date().getFullYear() + " UH Auction",
      author: "TJW",
    };
  },
};
</script>

<style scoped>
footer {
  margin-top: 120px;
  height: 150px;
}
footer a {
  color: #bfbfbf;
}
</style>