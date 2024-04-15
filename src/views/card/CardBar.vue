<template>
  <section>
    <!--if login-->
    <login-welcome />


    <CategoriesCard />


    <LinkCard />
  </section>
</template>

<script>
import CategoriesCard from '@/views/card/Categories'
import LinkCard from '@/views/card/Link'
import LoginWelcome from '@/views/card/LoginWelcome'

export default {
  name: 'CardBar',
  components: { LoginWelcome, LinkCard, CategoriesCard }
}
</script>

<style scoped>
</style>
