<template>
 <section class="box comments center-elements interesting-section">

  <div class="columns is-centered">
      <figure>
        <img :src="require('@/assets/image/cancel.png')" height="200px" width="200px" />
      </figure>
</div>
<br/>
  <div class="columns is-centered">
      <h3>Payment Cancelled</h3>

</div>
<br/>
  <div class="columns is-centered">
      <!-- Example of binding a router-link -->
      <b-button type="is-primary" tag="router-link" :to="{ path: '/#' }" outlined>
        Home
      </b-button>
</div>
  </section>
</template>
