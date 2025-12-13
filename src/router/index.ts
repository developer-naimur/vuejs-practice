import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'



// Unit
import UnitIndex from '../views/Product/Unit/Index.vue'
import UnitCreate from '../views/Product/Unit/Create.vue'
import UnitEdit from '../views/Product/Unit/Edit.vue'
import UnitShow from '../views/Product/Unit/Show.vue'
import UnitTrashed from '../views/Product/Unit/Trashed.vue'

const routes = [

  {
    path: '/',
    name: 'Home',
    component: Home
  },

  //-------------------------------------------------------
  // Product 
  //-------------------------------------------------------

  // =============================
  // Unit (under product)
  // =============================
    {
      path: '/product/unit',
      name: 'unit.index',
      component: UnitIndex
    },
    {
      path: '/product/unit/create',
      name: 'unit.create',
      component: UnitCreate
    },
    {
      path: '/product/unit/trashed',
      name: 'unit.trashed',
      component: UnitTrashed
    },
    {
      path: '/product/unit/:id/edit',
      name: 'unit.edit',
      component: UnitEdit
    },
    {
      path: '/product/unit/:id',
      name: 'unit.show',
      component: UnitShow
    }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
