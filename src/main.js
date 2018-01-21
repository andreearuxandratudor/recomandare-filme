// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// properties
Vue.prototype.$apiUrl = 'https://api.themoviedb.org/3/';
Vue.prototype.$apiKey = '6cbdfb4f71a52638fa2f4ccf099f76f0';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
