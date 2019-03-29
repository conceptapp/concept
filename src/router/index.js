import Vue from 'vue'
import Router from 'vue-router'
import Mainboard from '@/views/mainboard'
import Boards from '@/views/boards'
import Playboard from '@/views/playboard'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/boards',
      name: 'Boards',
      component: Boards
    },
    {
      path: '/playboard/:boardId',
      name: 'Playboard',
      component: Playboard,
    },
    {
      path: '/',
      name: 'Mainboard',
      component: Mainboard
    },
    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   component: Profile,
    //   meta: {
    //     authRequred: true
    //   }
    // },
    // {
    //   path: '*',
    //   redirect: { name: 'Mainboard' }
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
