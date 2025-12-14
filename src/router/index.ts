import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'



// Product
import ProductIndex from '../views/Product/Index.vue'
import ProductCreate from '../views/Product/Create.vue'
import ProductEdit from '../views/Product/Edit.vue'
import ProductShow from '../views/Product/Show.vue'
import ProductTrashed from '../views/Product/Trashed.vue'

// Brand
import BrandIndex from '../views/Product/Brand/Index.vue'
import BrandCreate from '../views/Product/Brand/Create.vue'
import BrandEdit from '../views/Product/Brand/Edit.vue'
import BrandShow from '../views/Product/Brand/Show.vue'
import BrandTrashed from '../views/Product/Brand/Trashed.vue'

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

    {
      path: '/product',
      name: 'product.index',
      component: ProductIndex
    },
    {
      path: '/product/create',
      name: 'product.create',
      component: ProductCreate
    },
    {
      path: '/product/trashed',
      name: 'product.trashed',
      component: ProductTrashed
    },
    {
      path: '/product/:id/edit',
      name: 'product.edit',
      component: ProductEdit
    },
    {
      path: '/product/:id',
      name: 'product.show',
      component: ProductShow
    },

  // =============================
  // Brand (under product)
  // =============================
    {
      path: '/product/brand',
      name: 'brand.index',
      component: BrandIndex
    },
    {
      path: '/product/brand/create',
      name: 'brand.create',
      component: BrandCreate
    },
    {
      path: '/product/brand/trashed',
      name: 'brand.trashed',
      component: BrandTrashed
    },
    {
      path: '/product/brand/:id/edit',
      name: 'brand.edit',
      component: BrandEdit
    },
    {
      path: '/product/brand/:id',
      name: 'brand.show',
      component: BrandShow
    },

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
    },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
