<template>
  <header class="header has-background-white has-text-black">
    <b-navbar
      class="container is-white"
      :fixed-top="true"
    >
      <template slot="brand">
        <b-navbar-item tag="div">
          <img :src="uhImg" alt="logo">
        </b-navbar-item>

        <b-navbar-item
          class="is-hidden-desktop"
          tag="router-link"
          :to="{ path: '/' }"
        >
          Home
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/' }"
        >
          🌐 Home
        </b-navbar-item>


        <b-navbar-item
          tag="router-link"
          :to="{ path: '/statistics/fund' }"
        >
          💵 Fund Distribution
        </b-navbar-item>


      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <b-field position="is-centered">
            <b-input
              v-model="searchKey"
              class="s_input"
              width="80%"
              placeholder="Search Item"
              rounded
              clearable
              @keyup.enter.native="search()"
            />

            <p class="control">
              <b-button
                class="is-light"
                @click="search()"
              >🔍
              </b-button>
            </p>
          </b-field>
        </b-navbar-item>

        <b-navbar-item tag="div">
          <b-switch
            v-model="darkMode"
            passive-type="is-warning"
            type="is-dark"
          >
            {{ darkMode ? "Dark" : "Bright" }}
          </b-switch>
        </b-navbar-item>

        <b-navbar-item
          v-if="token == null || token === ''"
          tag="div"
        >
          <div class="buttons">
            <b-button
              class="is-light"
              tag="router-link"
              :to="{ path: '/register' }"
            >
              Register
            </b-button>
            <b-button
              class="is-light"
              tag="router-link"
              :to="{ path: '/login' }"
            >
              Login
            </b-button>
          </div>
        </b-navbar-item>

        <b-navbar-dropdown
          v-else
          :label="user.alias"
        >
          <b-navbar-item
            tag="router-link"
            :to="{ path: `/member/${user.username}/home` }"
          >
          👤 My Item
          </b-navbar-item>
          <hr class="dropdown-divider">
          <b-navbar-item
            tag="router-link"
            :to="{ path: `/member/${user.username}/setting` }"
          >
            ⚙ Setting
          </b-navbar-item>
          <hr class="dropdown-divider">
          <b-navbar-item
            tag="a"
            @click="logout"
          > 👋 Logout
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </b-navbar>
  </header>
</template>

<script>
import { disable as disableDarkMode, enable as enableDarkMode } from 'darkreader'
import { getDarkMode, setDarkMode } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      logoUrl: require('@/assets/logo3.png'),
      uhImg: require('@/assets/image/UH_logo.png'),
      searchKey: '',
      darkMode: false
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  watch: {
    // listen to theme mode 
    darkMode(val) {
      if (val) {
        enableDarkMode({})
      } else {
        disableDarkMode()
      }
      setDarkMode(this.darkMode)
    }
  },
  created() {
    // get mode from cookie
    this.darkMode = getDarkMode()
    if (this.darkMode) {
      enableDarkMode({})
    } else {
      disableDarkMode()
    }
  },
  methods: {
    async logout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$message.info('Logout Successfully')
        setTimeout(() => {
          this.$router.push({ path: this.redirect || '/' })
        }, 500)
      })
    },
    search() {
      console.log(this.token)
      if (this.searchKey.trim() === null || this.searchKey.trim() === '') {
        this.$message.info({
          showClose: true,
          message: 'Please enter keyword to search！',
          type: 'warning'
        })
        return false
      }
      this.$router.push({ path: '/search?key=' + this.searchKey })
    }
  }
}
</script>

<style scoped>
input {
  width: 80%;
  height: 86%;
}
</style>
