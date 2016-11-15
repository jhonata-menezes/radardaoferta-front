var Vue = require('vue')
var VueRouter = require('vue-router')
var App = require('./App.vue')
var axios = require('axios')
var VueAxios = require('vue-axios')

Vue.use(VueAxios, axios)
Vue.use(VueRouter)

routes = []

router = new VueRouter({ routes })
const sopromocaoApp = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')