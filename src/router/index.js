import Vue from 'vue'
import store from '../store'
import Router from 'vue-router'
import Home from '@/views/home'
import Mainboard from '@/views/mainboard'
import Boards from '@/views/boards'
import Playboard from '@/views/playboard'
import Profile from '@/views/profile'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/boards',
      name: 'BoardsTable',
      component: Boards
    },
    {
      path: '/playboard/:boardId',
      name: 'Playboard',
      component: Playboard,
    },
    {
      path: '/mainboard',
      name: 'Mainboard',
      component: Mainboard
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      // meta: {
      //   authRequired: true
      // }
    },
    // {
    //   path: '*',
    //   redirect: { name: 'Mainboard' }
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) { // if auth is required to access the page
    if (!store.state.user) {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
