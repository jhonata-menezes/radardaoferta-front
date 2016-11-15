var Vue = require('vue')
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')
var App = require('./App.vue')

Vue.use(VueRouter)
Vue.use(VueResource)

routes = []

router = new VueRouter({ routes })
const sopromocaoApp = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')