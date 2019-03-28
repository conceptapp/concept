import Vue from 'vue'
import Router from 'vue-router'
import Mainboard from '@/views/mainboard'
import Boards from '@/views/boards'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Mainboard',
      component: Mainboard
    },
    {
      path: '/boards',
      name: 'Boards',
      component: Boards
    },
    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   component: Profile,
    //   meta: {
    //     authRequred: true
    //   }
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequred)) {
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
