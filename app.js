var Vue = require('vue')
var VueRouter = require('vue-router')
var App = require('./App.vue')

Vue.config.devtools = false; //desabilita mensagem no browser
Vue.use(VueRouter)

routes = []

router = new VueRouter({ routes })
const sopromocaoApp = new Vue({
    router,
    render: h => h(App)
}).$mount('#app')