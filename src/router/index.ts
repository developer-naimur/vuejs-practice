import { createRouter, createWebHistory } from 'vue-router'


//---------------------------------------------------------------
  //Frontend Part
//---------------------------------------------------------------
import Home from '../views/Frontend/Home.vue'


//---------------------------------------------------------------
  //Backend Part
//---------------------------------------------------------------
import Dashboard from '../views/Dashboard.vue'
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

//---------------------------------------------------
// Contact
//---------------------------------------------------
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
// Retail Sale
import RetailSaleIndex from '../views/Sale/RetailSale/Index.vue'
import RetailSaleCreate from '../views/Sale/RetailSale/Create.vue'
import RetailSaleEdit from '../views/Sale/RetailSale/Edit.vue'
import RetailSaleShow from '../views/Sale/RetailSale/Show.vue'
import RetailSaleTrashed from '../views/Sale/RetailSale/Trashed.vue'
// Retail Return Sale
import RetailSaleReturnIndex from '../views/Sale/RetailSale/Return/Index.vue'
import RetailSaleReturnCreate from '../views/Sale/RetailSale/Return/Create.vue'
import RetailSaleReturnEdit from '../views/Sale/RetailSale/Return/Edit.vue'
import RetailSaleReturnShow from '../views/Sale/RetailSale/Return/Show.vue'
import RetailSaleReturnTrashed from '../views/Sale/RetailSale/Return/Trashed.vue'

//---------------------------------------------------
// Purchase
//---------------------------------------------------
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
// Stock Adjustment 
import StockAdjustmentIndex from '../views/Stock/Adjustment/Index.vue'
import StockAdjustmentCreate from '../views/Stock/Adjustment/Create.vue'
import StockAdjustmentEdit from '../views/Stock/Adjustment/Edit.vue'
import StockAdjustmentShow from '../views/Stock/Adjustment/Show.vue'
import StockAdjustmentTrashed from '../views/Stock/Adjustment/Trashed.vue'

//---------------------------------------------------
// Settings
//---------------------------------------------------
import GeneralSetting from '../views/Setting/GeneralSetting.vue'

import InventorySetting from '../views/Setting/InventorySetting.vue'
import SalesSetting from '../views/Setting/SalesSetting.vue'
import AccountingSetting from '../views/Setting/AccountingSetting.vue'
import PurchaseSetting from '../views/Setting/PurchaseSetting.vue'

import NotificationSetting from '../views/Setting/NotificationSetting.vue'
import SystemSetting from '../views/Setting/SystemSetting.vue'

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
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
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



  //-------------------------------------------------------
  // Contact 
  //-------------------------------------------------------
    // =============================
  // Customer (under contact)
  // =============================
    {
      path: '/customer',
      name: 'customer.index',
      component: CustomerIndex
    },
    {
      path: '/customer/create',
      name: 'customer.create',
      component: CustomerCreate
    },
    {
      path: '/customer/trashed',
      name: 'customer.trashed',
      component: CustomerTrashed
    },
    {
      path: '/customer/:id/edit',
      name: 'customer.edit',
      component: CustomerEdit
    },
    {
      path: '/customer/:id',
      name: 'customer.show',
      component: CustomerShow
    },
    {
      path: '/get-customer',
      name: 'customer.get-customer',
      component: getCustomer
    },

  // =============================
  // Supplier (under contact)
  // =============================
    {
      path: '/supplier',
      name: 'supplier.index',
      component: SupplierIndex
    },
    {
      path: '/supplier/create',
      name: 'supplier.create',
      component: SupplierCreate
    },
    {
      path: '/supplier/trashed',
      name: 'supplier.trashed',
      component: SupplierTrashed
    },
    {
      path: '/supplier/:id/edit',
      name: 'supplier.edit',
      component: SupplierEdit
    },
    {
      path: '/supplier/:id',
      name: 'supplier.show',
      component: SupplierShow
    },
    {
      path: '/get-supplier',
      name: 'supplier.get-supplier',
      component: getSupplier
    },


  //-------------------------------------------------------
  // Sale 
  //-------------------------------------------------------
    {
      path: '/sale/retail-sale',
      name: 'retail-sale.index',
      component: RetailSaleIndex
    },
    {
      path: '/sale/retail-sale/create/:customer_id',
      name: 'retail-sale.create',
      component: RetailSaleCreate
    },
    {
      path: '/sale/retail-sale/trashed',
      name: 'retail-sale.trashed',
      component: RetailSaleTrashed
    },
    {
      path: '/sale/retail-sale/:id/edit',
      name: 'retail-sale.edit',
      component: RetailSaleEdit
    },
    {
      path: '/sale/retail-sale/:id',
      name: 'retail-sale.show',
      component: RetailSaleShow
    },
    //Return
    {
      path: '/sale/retail-sale/return',
      name: 'retail-sale-return.index',
      component: RetailSaleReturnIndex
    },
    {
      path: '/sale/retail-sale/return/create',
      name: 'retail-sale-return.create',
      component: RetailSaleReturnCreate
    },
    {
      path: '/sale/retail-sale/return/trashed',
      name: 'retail-sale-return.trashed',
      component: RetailSaleReturnTrashed
    },
    {
      path: '/sale/retail-sale/return/:id/edit',
      name: 'retail-sale-return.edit',
      component: RetailSaleReturnEdit
    },
    {
      path: '/sale/retail-sale/return/:id',
      name: 'retail-sale-return.show',
      component: RetailSaleReturnShow
    },

  //-------------------------------------------------------
  // Purchase 
  //-------------------------------------------------------
    {
      path: '/purchase',
      name: 'purchase.index',
      component: PurchaseIndex
    },
    {
      path: '/purchase/create/:supplier_id',
      name: 'purchase.create',
      component: PurchaseCreate
    },
    {
      path: '/purchase/trashed',
      name: 'purchase.trashed',
      component: PurchaseTrashed
    },
    {
      path: '/purchase/:id/edit',
      name: 'purchase.edit',
      component: PurchaseEdit
    },
    {
      path: '/purchase/:id',
      name: 'purchase.show',
      component: PurchaseShow
    },
    //Return
    {
      path: '/purchase/return',
      name: 'purchase-return.index',
      component: PurchaseReturnIndex
    },
    {
      path: '/purchase-return/return/create',
      name: 'purchase-return.create',
      component: PurchaseReturnCreate
    },
    {
      path: '/purchase-return/return/trashed',
      name: 'purchase-return.trashed',
      component: PurchaseReturnTrashed
    },
    {
      path: '/purchase-return/return/:id/edit',
      name: 'purchase-return.edit',
      component: PurchaseReturnEdit
    },
    {
      path: '/purchase-return/return/:id',
      name: 'purchase-return.show',
      component: PurchaseReturnShow
    },

  //-------------------------------------------------------
  // Account 
  //-------------------------------------------------------
    {
      path: '/account',
      name: 'account.index',
      component: AccountIndex
    },
    {
      path: '/account/create',
      name: 'account.create',
      component: AccountCreate
    },
    {
      path: '/account/trashed',
      name: 'account.trashed',
      component: AccountTrashed
    },
    {
      path: '/account/:id/edit',
      name: 'account.edit',
      component: AccountEdit
    },
    {
      path: '/account/:id',
      name: 'account.show',
      component: AccountShow
    },
    //Fund Transfer
    {
      path: '/account/fund-transfer',
      name: 'account-fund-transfer.index',
      component: FundTransferIndex
    },
    {
      path: '/account/fund-transfer/create',
      name: 'account-fund-transfer.create',
      component: FundTransferCreate
    },
    {
      path: '/account/fund-transfer/trashed',
      name: 'account-fund-transfer.trashed',
      component: FundTransferTrashed
    },
    {
      path: '/account/fund-transfer/:id/edit',
      name: 'account-fund-transfer.edit',
      component: FundTransferEdit
    },
    {
      path: '/account/fund-transfer/:id',
      name: 'account-fund-transfer.show',
      component: FundTransferShow
    },
    //IncomeExpense
    {
      path: '/account/income-expense',
      name: 'account-income-expense.index',
      component: IncomeExpenseIndex
    },
    {
      path: '/account/income-expense/create',
      name: 'account-income-expense.create',
      component: IncomeExpenseCreate
    },
    {
      path: '/account/income-expense/trashed',
      name: 'account-income-expense.trashed',
      component: IncomeExpenseTrashed
    },
    {
      path: '/account/income-expense/:id/edit',
      name: 'account-income-expense.edit',
      component: IncomeExpenseEdit
    },
    {
      path: '/account/income-expense/:id',
      name: 'account-income-expense.show',
      component: IncomeExpenseShow
    },
    //IncomeExpenseType
    {
      path: '/account/income-expense/type',
      name: 'account-income-expense-type.index',
      component: IncomeExpenseTypeIndex
    },
    {
      path: '/account/income-expense/type/create',
      name: 'account-income-expense-type.create',
      component: IncomeExpenseTypeCreate
    },
    {
      path: '/account/income-expense/type/trashed',
      name: 'account-income-expense-type.trashed',
      component: IncomeExpenseTypeTrashed
    },
    {
      path: '/account/income-expense/type/:id/edit',
      name: 'account-income-expense-type.edit',
      component: IncomeExpenseTypeEdit
    },
    {
      path: '/account/income-expense/type/:id',
      name: 'account-income-expense-type.show',
      component: IncomeExpenseTypeShow
    },

  //-------------------------------------------------------
  // Payment 
  //-------------------------------------------------------

    //PaymentCustomer
    {
      path: '/payment/customer',
      name: 'payment-customer.index',
      component: PaymentCustomerIndex
    },
    {
      path: '/payment/customer/create',
      name: 'payment-customer.create',
      component: PaymentCustomerCreate
    },
    {
      path: '/payment/customer/trashed',
      name: 'payment-customer.trashed',
      component: PaymentCustomerTrashed
    },
    {
      path: '/payment/customer/:id/edit',
      name: 'payment-customer.edit',
      component: PaymentCustomerEdit
    },
    {
      path: '/payment/customer/:id',
      name: 'payment-customer.show',
      component: PaymentCustomerShow
    },

    //PaymentSupplier
    {
      path: '/payment/supplier',
      name: 'payment-supplier.index',
      component: PaymentSupplierIndex
    },
    {
      path: '/payment/supplier/create',
      name: 'payment-supplier.create',
      component: PaymentSupplierCreate
    },
    {
      path: '/payment/supplier/trashed',
      name: 'payment-supplier.trashed',
      component: PaymentSupplierTrashed
    },
    {
      path: '/payment/supplier/:id/edit',
      name: 'payment-supplier.edit',
      component: PaymentSupplierEdit
    },
    {
      path: '/payment/supplier/:id',
      name: 'payment-supplier.show',
      component: PaymentSupplierShow
    },

  //-------------------------------------------------------
  // Stock 
  //-------------------------------------------------------

    //Stock Adjustment
    {
      path: '/stock/operation',
      name: 'stock-operation.index',
      component: StockAdjustmentIndex
    },
    {
      path: '/stock/operation/create',
      name: 'stock-operation.create',
      component: StockAdjustmentCreate
    },
    {
      path: '/stock/operation/trashed',
      name: 'stock-operation.trashed',
      component: StockAdjustmentTrashed
    },
    {
      path: '/stock/operation/:id/edit',
      name: 'stock-operation.edit',
      component: StockAdjustmentEdit
    },
    {
      path: '/stock/operation/:id',
      name: 'stock-operation.show',
      component: StockAdjustmentShow
    },


  //-------------------------------------------------------
  // Settings 
  //-------------------------------------------------------
    {
      path: '/setting/general',
      name: 'general-setting.index',
      component: GeneralSetting
    },
    {
      path: '/setting/inventory-product',
      name: 'inventory-product-setting.index',
      component: InventorySetting
    },
    {
      path: '/setting/sale-transaction',
      name: 'sales-transaction-setting.index',
      component: SalesSetting
    },
    {
      path: '/setting/accounting-finance',
      name: 'accounting-finance-setting.index',
      component: AccountingSetting
    },
    {
      path: '/setting/purchase-supplier',
      name: 'purchase-supplier-setting.index',
      component: PurchaseSetting
    },

    {
      path: '/setting/notification',
      name: 'notification-setting.index',
      component: NotificationSetting
    },
    {
      path: '/setting/system',
      name: 'system-setting.index',
      component: SystemSetting
    },


    //User
    {
      path: '/setting/user',
      name: 'user.index',
      component: UserIndex
    },
    {
      path: '/setting/user/create',
      name: 'user.create',
      component: UserCreate
    },
    {
      path: '/setting/user/trashed',
      name: 'user.trashed',
      component: UserTrashed
    },
    {
      path: '/setting/user/:id/edit',
      name: 'user.edit',
      component: UserEdit
    },
    {
      path: '/setting/user/:id',
      name: 'user.show',
      component: UserShow
    },

    //Role
    {
      path: '/setting/user/role',
      name: 'user.role.index',
      component: RoleIndex
    },
    {
      path: '/setting/user/role/create',
      name: 'user.role.create',
      component: RoleCreate
    },
    {
      path: '/setting/user/role/trashed',
      name: 'user.role.trashed',
      component: RoleTrashed
    },
    {
      path: '/setting/user/role/:id/edit',
      name: 'user.role.edit',
      component: RoleEdit
    },
    {
      path: '/setting/user/role/:id',
      name: 'user.role.show',
      component: RoleShow
    },
    

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
