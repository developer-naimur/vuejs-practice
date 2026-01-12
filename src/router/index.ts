import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore';


//---------------------------------------------------------------
  //Frontend Part
//---------------------------------------------------------------
import Home from '../views/Frontend/Home.vue'


//---------------------------------------------------------------
  //Backend Part
//---------------------------------------------------------------
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'

import Dashboard from '../views/Dashboard.vue'
// Product
import ProductHome from '../views/Product/Home.vue'
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

// Category
import CategoryIndex from '../views/Product/Category/Index.vue'
import CategoryCreate from '../views/Product/Category/Create.vue'
import CategoryEdit from '../views/Product/Category/Edit.vue'
import CategoryShow from '../views/Product/Category/Show.vue'
import CategoryTrashed from '../views/Product/Category/Trashed.vue'

// Unit
import UnitIndex from '../views/Product/Unit/Index.vue'
import UnitCreate from '../views/Product/Unit/Create.vue'
import UnitEdit from '../views/Product/Unit/Edit.vue'
import UnitShow from '../views/Product/Unit/Show.vue'
import UnitTrashed from '../views/Product/Unit/Trashed.vue'

//---------------------------------------------------
// Contact
//---------------------------------------------------
import ContactHome from '../views/Contact/Home.vue'
//Customer
import CustomerIndex from '../views/Contact/Customer/Index.vue'
import CustomerCreate from '../views/Contact/Customer/Create.vue'
import CustomerEdit from '../views/Contact/Customer/Edit.vue'
import CustomerShow from '../views/Contact/Customer/Show.vue'
import CustomerTrashed from '../views/Contact/Customer/Trashed.vue'
import getCustomer from '../views/Contact/Customer/getCustomer.vue'
//Supplier
import SupplierIndex from '../views/Contact/Supplier/Index.vue'
import SupplierCreate from '../views/Contact/Supplier/Create.vue'
import SupplierEdit from '../views/Contact/Supplier/Edit.vue'
import SupplierShow from '../views/Contact/Supplier/Show.vue'
import SupplierTrashed from '../views/Contact/Supplier/Trashed.vue'
import getSupplier from '../views/Contact/Supplier/getSupplier.vue'

//---------------------------------------------------
// Sales
//---------------------------------------------------
import SaleHome from '../views/Sale/Home.vue'
// Retail Sale
import Index from '../views/Sale/Index.vue'
import Create from '../views/Sale/Create.vue'
import Edit from '../views/Sale/Edit.vue'
import Show from '../views/Sale/Show.vue'
import Trashed from '../views/Sale/Trashed.vue'
// Retail Return Sale
import ReturnIndex from '../views/Sale/Return/Index.vue'
import ReturnCreate from '../views/Sale/Return/Create.vue'
import ReturnEdit from '../views/Sale/Return/Edit.vue'
import ReturnShow from '../views/Sale/Return/Show.vue'
import ReturnTrashed from '../views/Sale/Return/Trashed.vue'

//---------------------------------------------------
// Purchase
//---------------------------------------------------
import PurchaseHome from '../views/Purchase/Home.vue'

import PurchaseIndex from '../views/Purchase/Index.vue'
import PurchaseCreate from '../views/Purchase/Create.vue'
import PurchaseEdit from '../views/Purchase/Edit.vue'
import PurchaseShow from '../views/Purchase/Show.vue'
import PurchaseTrashed from '../views/Purchase/Trashed.vue'
// Purchase Return 
import PurchaseReturnIndex from '../views/Purchase/Return/Index.vue'
import PurchaseReturnCreate from '../views/Purchase/Return/Create.vue'
import PurchaseReturnEdit from '../views/Purchase/Return/Edit.vue'
import PurchaseReturnShow from '../views/Purchase/Return/Show.vue'
import PurchaseReturnTrashed from '../views/Purchase/Return/Trashed.vue'

//---------------------------------------------------
// Accounts
//---------------------------------------------------
import AccountHome from '../views/Account/Home.vue'

import AccountIndex from '../views/Account/Index.vue'
import AccountCreate from '../views/Account/Create.vue'
import AccountEdit from '../views/Account/Edit.vue'
import AccountShow from '../views/Account/Show.vue'
import AccountTrashed from '../views/Account/Trashed.vue'

// FundTransfer 
import FundTransferIndex from '../views/Account/FundTransfer/Index.vue'
import FundTransferCreate from '../views/Account/FundTransfer/Create.vue'
import FundTransferEdit from '../views/Account/FundTransfer/Edit.vue'
import FundTransferShow from '../views/Account/FundTransfer/Show.vue'
import FundTransferTrashed from '../views/Account/FundTransfer/Trashed.vue'

// IncomeExpense 
import IncomeExpenseIndex from '../views/Account/IncomeExpense/Index.vue'
import IncomeExpenseCreate from '../views/Account/IncomeExpense/Create.vue'
import IncomeExpenseEdit from '../views/Account/IncomeExpense/Edit.vue'
import IncomeExpenseShow from '../views/Account/IncomeExpense/Show.vue'
import IncomeExpenseTrashed from '../views/Account/IncomeExpense/Trashed.vue'
// IncomeExpenseType
import IncomeExpenseTypeIndex from '../views/Account/IncomeExpense/Type/Index.vue'
import IncomeExpenseTypeCreate from '../views/Account/IncomeExpense/Type/Create.vue'
import IncomeExpenseTypeEdit from '../views/Account/IncomeExpense/Type/Edit.vue'
import IncomeExpenseTypeShow from '../views/Account/IncomeExpense/Type/Show.vue'
import IncomeExpenseTypeTrashed from '../views/Account/IncomeExpense/Type/Trashed.vue'


//---------------------------------------------------
// Payment
//---------------------------------------------------
// Customer Payment 
import PaymentCustomerIndex from '../views/Payment/Customer/Index.vue'
import PaymentCustomerCreate from '../views/Payment/Customer/Create.vue'
import PaymentCustomerEdit from '../views/Payment/Customer/Edit.vue'
import PaymentCustomerShow from '../views/Payment/Customer/Show.vue'
import PaymentCustomerTrashed from '../views/Payment/Customer/Trashed.vue'
// Supplier Payment 
import PaymentSupplierIndex from '../views/Payment/Supplier/Index.vue'
import PaymentSupplierCreate from '../views/Payment/Supplier/Create.vue'
import PaymentSupplierEdit from '../views/Payment/Supplier/Edit.vue'
import PaymentSupplierShow from '../views/Payment/Supplier/Show.vue'
import PaymentSupplierTrashed from '../views/Payment/Supplier/Trashed.vue'

//---------------------------------------------------
// Stock
//---------------------------------------------------
import StockHome from '../views/Stock/Home.vue'

// Stock Adjustment 
import StockAdjustmentIndex from '../views/Stock/Adjustment/Index.vue'
import StockAdjustmentCreate from '../views/Stock/Adjustment/Create.vue'
import StockAdjustmentEdit from '../views/Stock/Adjustment/Edit.vue'
import StockAdjustmentShow from '../views/Stock/Adjustment/Show.vue'
import StockAdjustmentTrashed from '../views/Stock/Adjustment/Trashed.vue'

//---------------------------------------------------
// Reports
//---------------------------------------------------
import ReportHome from '../views/Report/Home.vue'



//---------------------------------------------------
// Settings
//---------------------------------------------------
import SettingHome from '../views/Setting/Home.vue'
import GeneralSetting from '../views/Setting/GeneralSetting.vue'

import InventorySetting from '../views/Setting/InventorySetting.vue'
import SalesSetting from '../views/Setting/SalesSetting.vue'
import AccountingSetting from '../views/Setting/AccountingSetting.vue'
import PurchaseSetting from '../views/Setting/PurchaseSetting.vue'

import NotificationSetting from '../views/Setting/NotificationSetting.vue'
import SystemSetting from '../views/Setting/SystemSetting.vue'

import Profile from '../views/Setting/Profile.vue'

//User&Role Permission
// User 
import UserIndex from '../views/Setting/User/Index.vue'
import UserCreate from '../views/Setting/User/Create.vue'
import UserEdit from '../views/Setting/User/Edit.vue'
import UserShow from '../views/Setting/User/Show.vue'
import UserTrashed from '../views/Setting/User/Trashed.vue'
// Role 
import RoleIndex from '../views/Setting/User/Role/Index.vue'
import RoleCreate from '../views/Setting/User/Role/Create.vue'
import RoleEdit from '../views/Setting/User/Role/Edit.vue'
import RoleShow from '../views/Setting/User/Role/Show.vue'
import RoleTrashed from '../views/Setting/User/Role/Trashed.vue'


const routes = [

  {
    path: '/',
    name: 'home',
    component: Home
  },





  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guestOnly: true
    }
  },

  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      guestOnly: true
    }
  },



  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },

  //-------------------------------------------------------
  // Product 
  //-------------------------------------------------------

    {
      path: '/product/home',
      name: 'product-home',
      component: ProductHome,
      meta: {
        requiresAuth: true, 
        permission: 'product.*'
      }
    },

    {
      path: '/product',
      name: 'product.index',
      component: ProductIndex,
      meta: {
        requiresAuth: true, 
        permission: 'product.read'
      }
    },
    {
      path: '/product/create',
      name: 'product.create',
      component: ProductCreate,
      meta: {
        requiresAuth: true, 
        permission: 'product.create'
      }
    },
    {
      path: '/product/trashed',
      name: 'product.trashed',
      component: ProductTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'product.read'
      }
    },
    {
      path: '/product/:id/edit',
      name: 'product.edit',
      component: ProductEdit,
      meta: {
        requiresAuth: true, 
        permission: 'product.update'
      }
    },
    {
      path: '/product/:id',
      name: 'product.show',
      component: ProductShow,
      meta: {
        requiresAuth: true, 
        permission: 'product.read'
      }
    },

  // =============================
  // Brand (under product)
  // =============================
    {
      path: '/product/brand',
      name: 'brand.index',
      component: BrandIndex,
      meta: {
        requiresAuth: true, 
        permission: 'brand.read'
      }
    },
    {
      path: '/product/brand/create',
      name: 'brand.create',
      component: BrandCreate,
      meta: {
        requiresAuth: true, 
        permission: 'brand.create'
      }
    },
    {
      path: '/product/brand/trashed',
      name: 'brand.trashed',
      component: BrandTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'brand.read'
      }
    },
    {
      path: '/product/brand/:id/edit',
      name: 'brand.edit',
      component: BrandEdit,
      meta: {
        requiresAuth: true, 
        permission: 'brand.update'
      }
    },
    {
      path: '/product/brand/:id',
      name: 'brand.show',
      component: BrandShow,
      meta: {
        requiresAuth: true, 
        permission: 'brand.read'
      }
    },

  // =============================
  // Category (under product)
  // =============================
    {
      path: '/product/category',
      name: 'category.index',
      component: CategoryIndex,
      meta: {
        requiresAuth: true, 
        permission: 'category.read'
      }
    },
    {
      path: '/product/category/create',
      name: 'category.create',
      component: CategoryCreate,
      meta: {
        requiresAuth: true, 
        permission: 'category.create'
      }
    },
    {
      path: '/product/category/trashed',
      name: 'category.trashed',
      component: CategoryTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'category.read'
      }
    },
    {
      path: '/product/category/:id/edit',
      name: 'category.edit',
      component: CategoryEdit,
      meta: {
        requiresAuth: true, 
        permission: 'category.update'
      }
    },
    {
      path: '/product/category/:id',
      name: 'category.show',
      component: CategoryShow,
      meta: {
        requiresAuth: true, 
        permission: 'category.read'
      }
    },

  // =============================
  // Unit (under product)
  // =============================
    {
      path: '/product/unit',
      name: 'unit.index',
      component: UnitIndex,
      meta: {
        requiresAuth: true, 
        permission: 'unit.read'
      }
    },
    {
      path: '/product/unit/create',
      name: 'unit.create',
      component: UnitCreate,
      meta: {
        requiresAuth: true, 
        permission: 'unit.create'
      }
    },
    {
      path: '/product/unit/trashed',
      name: 'unit.trashed',
      component: UnitTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'unit.read'
      }
    },
    {
      path: '/product/unit/:id/edit',
      name: 'unit.edit',
      component: UnitEdit,
      meta: {
        requiresAuth: true, 
        permission: 'unit.update'
      }
    },
    {
      path: '/product/unit/:id',
      name: 'unit.show',
      component: UnitShow,
      meta: {
        requiresAuth: true, 
        permission: 'unit.read'
      }
    },



  //-------------------------------------------------------
  // Contact 
  //-------------------------------------------------------

    {
      path: '/contact/home',
      name: 'contact-home',
      component: ContactHome,
      meta: {
        requiresAuth: true, 
        permission: 'contact.*'
      }
    },

    // =============================
  // Customer (under contact)
  // =============================
    {
      path: '/customer',
      name: 'customer.index',
      component: CustomerIndex,
      meta: {
        requiresAuth: true, 
        permission: 'customer.read'
      }
    },
    {
      path: '/customer/create',
      name: 'customer.create',
      component: CustomerCreate,
      meta: {
        requiresAuth: true, 
        permission: 'customer.create'
      }
    },
    {
      path: '/customer/trashed',
      name: 'customer.trashed',
      component: CustomerTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'customer.read'
      }
    },
    {
      path: '/customer/:id/edit',
      name: 'customer.edit',
      component: CustomerEdit,
      meta: {
        requiresAuth: true, 
        permission: 'customer.update'
      }
    },
    {
      path: '/customer/:id',
      name: 'customer.show',
      component: CustomerShow,
      meta: {
        requiresAuth: true, 
        permission: 'customer.read'
      }
    },
    {
      path: '/get-customer',
      name: 'customer.get-customer',
      component: getCustomer,
      meta: {
        requiresAuth: true, 
        permission: 'customer.read'
      }
    },

  // =============================
  // Supplier (under contact)
  // =============================
    {
      path: '/supplier',
      name: 'supplier.index',
      component: SupplierIndex,
      meta: {
        requiresAuth: true, 
        permission: 'supplier.read'
      }
    },
    {
      path: '/supplier/create',
      name: 'supplier.create',
      component: SupplierCreate,
      meta: {
        requiresAuth: true, 
        permission: 'supplier.create'
      }
    },
    {
      path: '/supplier/trashed',
      name: 'supplier.trashed',
      component: SupplierTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'supplier.read'
      }
    },
    {
      path: '/supplier/:id/edit',
      name: 'supplier.edit',
      component: SupplierEdit,
      meta: {
        requiresAuth: true, 
        permission: 'supplier.update'
      }
    },
    {
      path: '/supplier/:id',
      name: 'supplier.show',
      component: SupplierShow,
      meta: {
        requiresAuth: true, 
        permission: 'supplier.read'
      }
    },
    {
      path: '/get-supplier',
      name: 'supplier.get-supplier',
      component: getSupplier,
      meta: {
        requiresAuth: true, 
        permission: 'supplier.read'
      }
    },


  //-------------------------------------------------------
  // Sale 
  //-------------------------------------------------------
    {
      path: '/sale/home',
      name: 'sale-home',
      component: SaleHome,
      meta: {
        requiresAuth: true, 
        permission: 'sale.*'
      }
    },
    {
      path: '/sale',
      name: 'sale.index',
      component: Index,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/create/:customer_id',
      name: 'sale.create',
      component: Create,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/trashed',
      name: 'sale.trashed',
      component: Trashed,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/:id/edit',
      name: 'sale.edit',
      component: Edit,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/:id',
      name: 'sale.show',
      component: Show,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    //Return
    {
      path: '/sale/return',
      name: 'sale-return.index',
      component: ReturnIndex,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.read'
      }
    },
    {
      path: '/sale/return/create',
      name: 'sale-return.create',
      component: ReturnCreate,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.create'
      }
    },
    {
      path: '/sale/return/trashed',
      name: 'sale-return.trashed',
      component: ReturnTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.read'
      }
    },
    {
      path: '/sale/return/:id/edit',
      name: 'sale-return.edit',
      component: ReturnEdit,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.update'
      }
    },
    {
      path: '/sale/return/:id',
      name: 'sale-return.show',
      component: ReturnShow,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.read'
      }
    },

  //-------------------------------------------------------
  // Purchase 
  //-------------------------------------------------------
    {
      path: '/purchase/home',
      name: 'purchase-home',
      component: PurchaseHome,
      meta: {
        requiresAuth: true, 
        permission: 'purchase.*'
      }
    },
    {
      path: '/purchase',
      name: 'purchase.index',
      component: PurchaseIndex,
      meta: {
        requiresAuth: true, 
        permission: 'purchase.read'
      }
    },
    {
      path: '/purchase/create/:supplier_id',
      name: 'purchase.create',
      component: PurchaseCreate,
      meta: {
        requiresAuth: true, 
        permission: 'purchase.create'
      }
    },
    {
      path: '/purchase/trashed',
      name: 'purchase.trashed',
      component: PurchaseTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'purchase.read'
      }
    },
    {
      path: '/purchase/:id/edit',
      name: 'purchase.edit',
      component: PurchaseEdit,
      meta: {
        requiresAuth: true, 
        permission: 'purchase.update'
      }
    },
    {
      path: '/purchase/:id',
      name: 'purchase.show',
      component: PurchaseShow,
      meta: {
        requiresAuth: true, 
        permission: 'purchase.read'
      }
    },
    //Return
    {
      path: '/purchase/return',
      name: 'purchase-return.index',
      component: PurchaseReturnIndex,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.read'
      }
    },
    {
      path: '/purchase-return/return/create',
      name: 'purchase-return.create',
      component: PurchaseReturnCreate,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.create'
      }
    },
    {
      path: '/purchase-return/return/trashed',
      name: 'purchase-return.trashed',
      component: PurchaseReturnTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.read'
      }
    },
    {
      path: '/purchase-return/return/:id/edit',
      name: 'purchase-return.edit',
      component: PurchaseReturnEdit,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.update'
      }
    },
    {
      path: '/purchase-return/return/:id',
      name: 'purchase-return.show',
      component: PurchaseReturnShow,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.read'
      }
    },

  //-------------------------------------------------------
  // Account 
  //-------------------------------------------------------
    {
      path: '/account/home',
      name: 'account-home',
      component: AccountHome,
      meta: {
        requiresAuth: true, 
        permission: 'account.*'
      }
    },
    {
      path: '/account',
      name: 'account.index',
      component: AccountIndex,
      meta: {
        requiresAuth: true, 
        permission: 'account.read'
      }
    },
    {
      path: '/account/create',
      name: 'account.create',
      component: AccountCreate,
      meta: {
        requiresAuth: true, 
        permission: 'account.create'
      }
    },
    {
      path: '/account/trashed',
      name: 'account.trashed',
      component: AccountTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'account.read'
      }
    },
    {
      path: '/account/:id/edit',
      name: 'account.edit',
      component: AccountEdit,
      meta: {
        requiresAuth: true, 
        permission: 'account.update'
      }
    },
    {
      path: '/account/:id',
      name: 'account.show',
      component: AccountShow,
      meta: {
        requiresAuth: true, 
        permission: 'account.read'
      }
    },
    //Fund Transfer
    {
      path: '/account/fund-transfer',
      name: 'account-fund-transfer.index',
      component: FundTransferIndex,
      meta: {
        requiresAuth: true, 
        permission: 'fund_transfer.read'
      }
    },
    {
      path: '/account/fund-transfer/create',
      name: 'account-fund-transfer.create',
      component: FundTransferCreate,
      meta: {
        requiresAuth: true, 
        permission: 'fund_transfer.create'
      }
    },
    {
      path: '/account/fund-transfer/trashed',
      name: 'account-fund-transfer.trashed',
      component: FundTransferTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'fund_transfer.read'
      }
    },
    {
      path: '/account/fund-transfer/:id/edit',
      name: 'account-fund-transfer.edit',
      component: FundTransferEdit,
      meta: {
        requiresAuth: true, 
        permission: 'fund_transfer.update'
      }
    },
    {
      path: '/account/fund-transfer/:id',
      name: 'account-fund-transfer.show',
      component: FundTransferShow,
      meta: {
        requiresAuth: true, 
        permission: 'fund_transfer.read'
      }
    },
    //IncomeExpense
    {
      path: '/account/income-expense',
      name: 'account-income-expense.index',
      component: IncomeExpenseIndex,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense.read'
      }
    },
    {
      path: '/account/income-expense/create',
      name: 'account-income-expense.create',
      component: IncomeExpenseCreate,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense.create'
      }
    },
    {
      path: '/account/income-expense/trashed',
      name: 'account-income-expense.trashed',
      component: IncomeExpenseTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense.read'
      }
    },
    {
      path: '/account/income-expense/:id/edit',
      name: 'account-income-expense.edit',
      component: IncomeExpenseEdit,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense.update'
      }
    },
    {
      path: '/account/income-expense/:id',
      name: 'account-income-expense.show',
      component: IncomeExpenseShow,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense.read'
      }
    },
    //IncomeExpenseType
    {
      path: '/account/income-expense/type',
      name: 'account-income-expense-type.index',
      component: IncomeExpenseTypeIndex,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense_type.read'
      }
    },
    {
      path: '/account/income-expense/type/create',
      name: 'account-income-expense-type.create',
      component: IncomeExpenseTypeCreate,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense_type.create'
      }
    },
    {
      path: '/account/income-expense/type/trashed',
      name: 'account-income-expense-type.trashed',
      component: IncomeExpenseTypeTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense_type.read'
      }
    },
    {
      path: '/account/income-expense/type/:id/edit',
      name: 'account-income-expense-type.edit',
      component: IncomeExpenseTypeEdit,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense_type.update'
      }
    },
    {
      path: '/account/income-expense/type/:id',
      name: 'account-income-expense-type.show',
      component: IncomeExpenseTypeShow,
      meta: {
        requiresAuth: true, 
        permission: 'income_expense_type.read'
      }
    },

  //-------------------------------------------------------
  // Payment 
  //-------------------------------------------------------
    //PaymentCustomer
    {
      path: '/payment/customer',
      name: 'payment-customer.index',
      component: PaymentCustomerIndex,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/customer/create',
      name: 'payment-customer.create',
      component: PaymentCustomerCreate,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/customer/trashed',
      name: 'payment-customer.trashed',
      component: PaymentCustomerTrashed,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/customer/:id/edit',
      name: 'payment-customer.edit',
      component: PaymentCustomerEdit,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/customer/:id',
      name: 'payment-customer.show',
      component: PaymentCustomerShow,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    //PaymentSupplier
    {
      path: '/payment/supplier',
      name: 'payment-supplier.index',
      component: PaymentSupplierIndex,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/supplier/create',
      name: 'payment-supplier.create',
      component: PaymentSupplierCreate,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/supplier/trashed',
      name: 'payment-supplier.trashed',
      component: PaymentSupplierTrashed,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/supplier/:id/edit',
      name: 'payment-supplier.edit',
      component: PaymentSupplierEdit,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/payment/supplier/:id',
      name: 'payment-supplier.show',
      component: PaymentSupplierShow,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

  //-------------------------------------------------------
  // Stock 
  //-------------------------------------------------------

    {
      path: '/stock/home',
      name: 'stock-home',
      component: StockHome,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    //Stock Adjustment
    {
      path: '/stock/operation',
      name: 'stock-operation.index',
      component: StockAdjustmentIndex,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/stock/operation/create',
      name: 'stock-operation.create',
      component: StockAdjustmentCreate,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/stock/operation/trashed',
      name: 'stock-operation.trashed',
      component: StockAdjustmentTrashed,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/stock/operation/:id/edit',
      name: 'stock-operation.edit',
      component: StockAdjustmentEdit,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/stock/operation/:id',
      name: 'stock-operation.show',
      component: StockAdjustmentShow,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },


  //-------------------------------------------------------
  // Reports 
  //-------------------------------------------------------
    {
      path: '/report/home',
      name: 'report-home',
      component: ReportHome,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

  //-------------------------------------------------------
  // Settings 
  //-------------------------------------------------------
    {
      path: '/setting/home',
      name: 'setting-home',
      component: SettingHome,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/general',
      name: 'general-setting.index',
      component: GeneralSetting,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/inventory-product',
      name: 'inventory-product-setting.index',
      component: InventorySetting,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/sale-transaction',
      name: 'sales-transaction-setting.index',
      component: SalesSetting,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/accounting-finance',
      name: 'accounting-finance-setting.index',
      component: AccountingSetting,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/purchase-supplier',
      name: 'purchase-supplier-setting.index',
      component: PurchaseSetting,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    {
      path: '/setting/notification',
      name: 'notification-setting.index',
      component: NotificationSetting,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/system',
      name: 'system-setting.index',
      component: SystemSetting,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    // Profile
    {
      path: '/setting/profile',
      name: 'profile-setting.index',
      component: Profile,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },


    //User
    {
      path: '/setting/user',
      name: 'user.index',
      component: UserIndex,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/create',
      name: 'user.create',
      component: UserCreate,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/trashed',
      name: 'user.trashed',
      component: UserTrashed,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/:id/edit',
      name: 'user.edit',
      component: UserEdit,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/:id',
      name: 'user.show',
      component: UserShow,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    //Role
    {
      path: '/setting/user/role',
      name: 'user.role.index',
      component: RoleIndex,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/role/create',
      name: 'user.role.create',
      component: RoleCreate,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/role/trashed',
      name: 'user.role.trashed',
      component: RoleTrashed,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/role/:id/edit',
      name: 'user.role.edit',
      component: RoleEdit,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/setting/user/role/:id',
      name: 'user.role.show',
      component: RoleShow,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    

]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// 🔐 Navigation Guard
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  const userStore = useUserStore()

  // 🔒 Auth required route
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // 🚫 Guest only route
  if (to.meta.guestOnly && isAuthenticated) {
    return next('/dashboard')
  }

  // 🧠 Load user on refresh
  if (isAuthenticated && !userStore.user) {
    try {
      await userStore.fetchUser()
    } catch (error) {
      userStore.logout()
      return next('/login')
    }
  }

  // 🚀 Permission check
  if (to.meta.permission) {
    if (!userStore.userCan(to.meta.permission as string)) {
      return next('/403') // or /dashboard
    }
  }

  next()
})



export default router
