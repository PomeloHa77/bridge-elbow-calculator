import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('./views/Home.vue') },
  { path: '/climb', component: () => import('./views/ClimbCalc.vue') },
  { path: '/horizontal', component: () => import('./views/HorizontalCalc.vue') },
  { path: '/special', component: () => import('./views/Special.vue') },
  { path: '/multilayer', component: () => import('./views/MultiLayerCalc.vue') },
  { path: '/reducer', component: () => import('./views/ReducerCalc.vue') },
  { path: '/avoidance', component: () => import('./views/AvoidCalc.vue') },
  { path: '/about', component: () => import('./views/About.vue') }
]

const router = createRouter({ history: createWebHashHistory(), routes })
export default router
