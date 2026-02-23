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
//Payment and Receive
import PaymentAndReceiveIndex from '../views/Contact/PaymentAndReceive/Index.vue'
import PaymentAndReceiveCreate from '../views/Contact/PaymentAndReceive/Create.vue'
import PaymentAndReceiveEdit from '../views/Contact/PaymentAndReceive/Edit.vue'
import PaymentAndReceiveShow from '../views/Contact/PaymentAndReceive/Show.vue'
import PaymentAndReceiveTrashed from '../views/Contact/PaymentAndReceive/Trashed.vue'

//---------------------------------------------------
// Sales
//---------------------------------------------------
import SaleHome from '../views/Sale/Home.vue'
// Retail Sale
import SaleIndex from '../views/Sale/Index.vue'
import SaleCreate from '../views/Sale/Create.vue'
import SaleEdit from '../views/Sale/Edit.vue'
import SaleShow from '../views/Sale/Show.vue'
import SaleTrashed from '../views/Sale/Trashed.vue'
// Retail Return Sale
import SaleReturnIndex from '../views/Sale/Return/Index.vue'
import SaleReturnCreate from '../views/Sale/Return/Create.vue'
import SaleReturnEdit from '../views/Sale/Return/Edit.vue'
import SaleReturnShow from '../views/Sale/Return/Show.vue'
import SaleReturnTrashed from '../views/Sale/Return/Trashed.vue'

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
import PurchaseSummary from '../views/Report/Purchase/PurchaseSummary.vue'
import SupplierWisePurchase from '../views/Report/Purchase/SupplierWisePurchase.vue'
import PurchaseReturn from '../views/Report/Purchase/PurchaseReturn.vue'

import SaleSummary from '../views/Report/Sale/SaleSummary.vue'
import CustomerWiseSale from '../views/Report/Sale/CustomerWiseSale.vue'
import SaleReturn from '../views/Report/Sale/SaleReturn.vue'

import CurrentStock from '../views/Report/Stock/CurrentStock.vue'
import StockAdjustment from '../views/Report/Stock/StockAdjustment.vue'

import CashReport from '../views/Report/Account/CashReport.vue'
import BankReport from '../views/Report/Account/BankReport.vue'
import ProfitLoss from '../views/Report/Account/ProfitLoss.vue'

import CustomerLedger from '../views/Report/Customer/CustomerLedger.vue'
import CustomerDue from '../views/Report/Customer/CustomerDue.vue'
import TopCustomer from '../views/Report/Customer/TopCustomer.vue'

import SupplierLedger from '../views/Report/Supplier/SupplierLedger.vue'
import SupplierDue from '../views/Report/Supplier/SupplierDue.vue'
import TopSupplier from '../views/Report/Supplier/TopSupplier.vue'



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

// Payment Methods 
import PaymentMethodIndex from '../views/Setting/PaymentMethod/Index.vue'
import PaymentMethodCreate from '../views/Setting/PaymentMethod/Create.vue'
import PaymentMethodEdit from '../views/Setting/PaymentMethod/Edit.vue'
import PaymentMethodShow from '../views/Setting/PaymentMethod/Show.vue'
import PaymentMethodTrashed from '../views/Setting/PaymentMethod/Trashed.vue'


// Adjustment Head
import AdjustmentHeadIndex from '../views/Setting/AdjustmentHead/Index.vue'
import AdjustmentHeadCreate from '../views/Setting/AdjustmentHead/Create.vue'
import AdjustmentHeadEdit from '../views/Setting/AdjustmentHead/Edit.vue'
import AdjustmentHeadShow from '../views/Setting/AdjustmentHead/Show.vue'
import AdjustmentHeadTrashed from '../views/Setting/AdjustmentHead/Trashed.vue'


// Price Groups 
import PriceGroupIndex from '../views/Setting/PriceGroup/Index.vue'
import PriceGroupCreate from '../views/Setting/PriceGroup/Create.vue'
import PriceGroupEdit from '../views/Setting/PriceGroup/Edit.vue'
import PriceGroupShow from '../views/Setting/PriceGroup/Show.vue'
import PriceGroupTrashed from '../views/Setting/PriceGroup/Trashed.vue'


// Area/Route 
import RouteIndex from '../views/Setting/Route/Index.vue'
import RouteCreate from '../views/Setting/Route/Create.vue'
import RouteEdit from '../views/Setting/Route/Edit.vue'
import RouteShow from '../views/Setting/Route/Show.vue'
import RouteTrashed from '../views/Setting/Route/Trashed.vue'


// Warehouse
import WarehouseIndex from '../views/Setting/Warehouse/Index.vue'
import WarehouseCreate from '../views/Setting/Warehouse/Create.vue'
import WarehouseEdit from '../views/Setting/Warehouse/Edit.vue'
import WarehouseShow from '../views/Setting/Warehouse/Show.vue'
import WarehouseTrashed from '../views/Setting/Warehouse/Trashed.vue'

// Tax
import TaxIndex from '../views/Setting/Tax/Index.vue'
import TaxCreate from '../views/Setting/Tax/Create.vue'
import TaxEdit from '../views/Setting/Tax/Edit.vue'
import TaxShow from '../views/Setting/Tax/Show.vue'
import TaxTrashed from '../views/Setting/Tax/Trashed.vue'


const routes = [

  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      guestOnly: true
    }
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
        requiresAuth: true
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
        requiresAuth: true
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

  // =============================
  // Payment and Receive (under contact)
  // =============================
    {
      path: '/payment-and-receive',
      name: 'payment-receive.index',
      component: PaymentAndReceiveIndex,
      meta: {
        requiresAuth: true, 
        permission: 'payment_and_receive.read'
      }
    },
    {
      path: '/payment-and-receive/create',
      name: 'payment-receive.create',
      component: PaymentAndReceiveCreate,
      meta: {
        requiresAuth: true, 
        permission: 'payment_and_receive.create'
      }
    },
    {
      path: '/payment-and-receive/trashed',
      name: 'payment-receive.trashed',
      component: PaymentAndReceiveTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'payment_and_receive.read'
      }
    },
    {
      path: '/payment-and-receive/:id/edit',
      name: 'payment-receive.edit',
      component: PaymentAndReceiveEdit,
      meta: {
        requiresAuth: true, 
        permission: 'payment_and_receive.update'
      }
    },
    {
      path: '/payment-and-receive/:id',
      name: 'payment-receive.show',
      component: PaymentAndReceiveShow,
      meta: {
        requiresAuth: true, 
        permission: 'payment_and_receive.read'
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
        requiresAuth: true
      }
    },
    {
      path: '/sale',
      name: 'sale.index',
      component: SaleIndex,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/create/:customer_id',
      name: 'sale.create',
      component: SaleCreate,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/trashed',
      name: 'sale.trashed',
      component: SaleTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/:id/edit',
      name: 'sale.edit',
      component: SaleEdit,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    {
      path: '/sale/:id',
      name: 'sale.show',
      component: SaleShow,
      meta: {
        requiresAuth: true, 
        permission: 'sale.read'
      }
    },
    //Return
    {
      path: '/sale-return',
      name: 'sale-return.index',
      component: SaleReturnIndex,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.read'
      }
    },
    {
      path: '/sale-return/create/:sale_id',
      name: 'sale-return.create',
      component: SaleReturnCreate,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.create'
      }
    },
    {
      path: '/sale-return/trashed',
      name: 'sale-return.trashed',
      component: SaleReturnTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.read'
      }
    },
    {
      path: '/sale-return/:id/edit',
      name: 'sale-return.edit',
      component: SaleReturnEdit,
      meta: {
        requiresAuth: true, 
        permission: 'sale_return.update'
      }
    },
    {
      path: '/sale-return/:id',
      name: 'sale-return.show',
      component: SaleReturnShow,
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
        requiresAuth: true
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
      path: '/purchase-return',
      name: 'purchase-return.index',
      component: PurchaseReturnIndex,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.read'
      }
    },
    {
      path: '/purchase-return/create/:purchase_id',
      name: 'purchase-return.create',
      component: PurchaseReturnCreate,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.create'
      }
    },
    {
      path: '/purchase-return/trashed',
      name: 'purchase-return.trashed',
      component: PurchaseReturnTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.read'
      }
    },
    {
      path: '/purchase-return/:id/edit',
      name: 'purchase-return.edit',
      component: PurchaseReturnEdit,
      meta: {
        requiresAuth: true, 
        permission: 'purchase_return.update'
      }
    },
    {
      path: '/purchase-return/:id',
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
        requiresAuth: true
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
  // Stock 
  //-------------------------------------------------------

    {
      path: '/stock/home',
      name: 'stock-home',
      component: StockHome,
      meta: {
        requiresAuth: true
      }
    },

    //Stock Adjustment
    {
      path: '/stock/operation',
      name: 'stock-operation.index',
      component: StockAdjustmentIndex,
      meta: {
        requiresAuth: true, 
        permission: 'stock_operation.read'
      }
    },
    {
      path: '/stock/operation/create',
      name: 'stock-operation.create',
      component: StockAdjustmentCreate,
      meta: {
        requiresAuth: true, 
        permission: 'stock_operation.create'
      }
    },
    {
      path: '/stock/operation/trashed',
      name: 'stock-operation.trashed',
      component: StockAdjustmentTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'stock_operation.read'
      }
    },
    {
      path: '/stock/operation/:id/edit',
      name: 'stock-operation.edit',
      component: StockAdjustmentEdit,
      meta: {
        requiresAuth: true, 
        permission: 'stock_operation.update'
      }
    },
    {
      path: '/stock/operation/:id',
      name: 'stock-operation.show',
      component: StockAdjustmentShow,
      meta: {
        requiresAuth: true, 
        permission: 'stock_operation.read'
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
    {
      path: '/report/purchase-summary',
      name: 'purchase-summary',
      component: PurchaseSummary,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/supplier-purchase',
      name: 'supplier-purchase',
      component: SupplierWisePurchase,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/purchase-return',
      name: 'purchase-return',
      component: PurchaseReturn,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    {
      path: '/report/sales-summary',
      name: 'sales-summary',
      component: SaleSummary,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/customer-sale',
      name: 'customer-sale',
      component: CustomerWiseSale,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/sales-return',
      name: 'sales-return',
      component: SaleReturn,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    {
      path: '/report/current-stock',
      name: 'current-stock',
      component: CurrentStock,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/stock-adjustment',
      name: 'stock-adjustment',
      component: StockAdjustment,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    

    {
      path: '/report/cash-report',
      name: 'cash-report',
      component: CashReport,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/bank-report',
      name: 'bank-report',
      component: BankReport,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/profit-loss',
      name: 'profit-loss',
      component: ProfitLoss,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    {
      path: '/report/customer-ledger',
      name: 'customer-ledger',
      component: CustomerLedger,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/customer-due',
      name: 'customer-due',
      component: CustomerDue,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/top-customer',
      name: 'top-customer',
      component: TopCustomer,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },

    {
      path: '/report/supplier-ledger',
      name: 'supplier-ledger',
      component: SupplierLedger,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/supplier-due',
      name: 'supplier-due',
      component: SupplierDue,
      meta: {
        requiresAuth: true, 
        permission: ''
      }
    },
    {
      path: '/report/top-supplier',
      name: 'top-supplier',
      component: TopSupplier,
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
        requiresAuth: true
      }
    },
    {
      path: '/setting/general',
      name: 'general-setting.index',
      component: GeneralSetting,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/inventory-product',
      name: 'inventory-product-setting.index',
      component: InventorySetting,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/sale-transaction',
      name: 'sales-transaction-setting.index',
      component: SalesSetting,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/accounting-finance',
      name: 'accounting-finance-setting.index',
      component: AccountingSetting,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/purchase-supplier',
      name: 'purchase-supplier-setting.index',
      component: PurchaseSetting,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },

    {
      path: '/setting/notification',
      name: 'notification-setting.index',
      component: NotificationSetting,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/system',
      name: 'system-setting.index',
      component: SystemSetting,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },

    // Profile
    {
      path: '/setting/profile',
      name: 'profile-setting.index',
      component: Profile,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },


    //User
    {
      path: '/setting/user',
      name: 'user.index',
      component: UserIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/create',
      name: 'user.create',
      component: UserCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/trashed',
      name: 'user.trashed',
      component: UserTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/:id/edit',
      name: 'user.edit',
      component: UserEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/:id',
      name: 'user.show',
      component: UserShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },

    //Role
    {
      path: '/setting/user/role',
      name: 'user.role.index',
      component: RoleIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/role/create',
      name: 'user.role.create',
      component: RoleCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/role/trashed',
      name: 'user.role.trashed',
      component: RoleTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/role/:id/edit',
      name: 'user.role.edit',
      component: RoleEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/user/role/:id',
      name: 'user.role.show',
      component: RoleShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },

    //Payment Method
    {
      path: '/setting/payment-method',
      name: 'payment-method.index',
      component: PaymentMethodIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/payment-method/create',
      name: 'payment-method.create',
      component: PaymentMethodCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/payment-method/trashed',
      name: 'payment-method.trashed',
      component: PaymentMethodTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/payment-method/:id/edit',
      name: 'payment-method.edit',
      component: PaymentMethodEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/payment-method/:id',
      name: 'payment-method.show',
      component: PaymentMethodShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },

    //Adjustment Head
    {
      path: '/setting/adjustment-head',
      name: 'adjustment-head.index',
      component: AdjustmentHeadIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/adjustment-head/create',
      name: 'adjustment-head.create',
      component: AdjustmentHeadCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/adjustment-head/trashed',
      name: 'adjustment-head.trashed',
      component: AdjustmentHeadTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/adjustment-head/:id/edit',
      name: 'adjustment-head.edit',
      component: AdjustmentHeadEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/adjustment-head/:id',
      name: 'adjustment-head.show',
      component: AdjustmentHeadShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    

    //Price Groups
    {
      path: '/setting/price-group',
      name: 'price-group.index',
      component: PriceGroupIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/price-group/create',
      name: 'price-group.create',
      component: PriceGroupCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/price-group/trashed',
      name: 'price-group.trashed',
      component: PriceGroupTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/price-group/:id/edit',
      name: 'price-group.edit',
      component: PriceGroupEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/price-group/:id',
      name: 'price-group.show',
      component: PriceGroupShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    
    //Area/Route
    {
      path: '/setting/route',
      name: 'route.index',
      component: RouteIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/route/create',
      name: 'route.create',
      component: RouteCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/route/trashed',
      name: 'route.trashed',
      component: RouteTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/route/:id/edit',
      name: 'route.edit',
      component: RouteEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/route/:id',
      name: 'route.show',
      component: RouteShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    
    //Warehouse
    {
      path: '/setting/warehouse',
      name: 'warehouse.index',
      component: WarehouseIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/warehouse/create',
      name: 'warehouse.create',
      component: WarehouseCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/warehouse/trashed',
      name: 'warehouse.trashed',
      component: WarehouseTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/warehouse/:id/edit',
      name: 'warehouse.edit',
      component: WarehouseEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/warehouse/:id',
      name: 'warehouse.show',
      component: WarehouseShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    
    //Tax
    {
      path: '/setting/tax',
      name: 'tax.index',
      component: TaxIndex,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/tax/create',
      name: 'tax.create',
      component: TaxCreate,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/tax/trashed',
      name: 'tax.trashed',
      component: TaxTrashed,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/tax/:id/edit',
      name: 'tax.edit',
      component: TaxEdit,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
      }
    },
    {
      path: '/setting/tax/:id',
      name: 'tax.show',
      component: TaxShow,
      meta: {
        requiresAuth: true, 
        permission: 'setting.create'
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
