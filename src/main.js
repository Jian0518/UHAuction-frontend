import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/app.css'
import './assets/plugins/font-awesome-4.7.0/css/font-awesome.min.css'
import format from 'date-fns/format'
import '@/permission'
import relativeTime from 'dayjs/plugin/relativeTime';
import locale from '../node_modules/element-ui/lib/locale/lang/en'

import 'dayjs/locale/zh-cn'
const dayjs = require('dayjs');


dayjs.extend(relativeTime)

dayjs.locale('en') 
dayjs().locale('en').format() 

Vue.prototype.dayjs = dayjs;//use dayjs globally

Vue.filter('date', (date) => {
  return format(new Date(date), 'yyyy-MM-dd')
})

Vue.use(Buefy)
Vue.use(ElementUI,{locale});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
