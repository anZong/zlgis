import Vue from 'vue'
import VueRouter from 'vue-router'
import zlmap from '../../arcgis/examples/map'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'map',
    component: zlmap
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
