import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Foo from './components/Foo.vue'
import Bar from './components/Bar.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
]

const router = new VueRouter({
    routes
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')