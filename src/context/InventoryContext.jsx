import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Inventory } from '../inventory'
import { getProducts as apiGetProducts, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '../api/productApi'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria as apiDeleteCategoria } from '../api/categoriaApi'
import { getAlmacenes, createAlmacen, updateAlmacen, deleteAlmacen as apiDeleteAlmacen } from '../api/almacenApi'
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario as apiDeleteUsuario } from '../api/usuarioApi'
import { getMovimientos, createMovimiento } from '../api/movimientoApi'

const InventoryContext = createContext(null)

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}

const DEFAULT_PRODUCT_FORM = {
  name: '',
  sku: '',
  categoryId: '',
  warehouseId: '',
  price: '',
  quantity: '',
  minStock: '',
  maxStock: '',
  description: ''
}

const DEFAULT_CATEGORY_FORM = {
  name: '',
  description: '',
  color: '#2563eb'
}

const DEFAULT_WAREHOUSE_FORM = {
  name: '',
  location: '',
  capacity: ''
}

const DEFAULT_MOVEMENT_FORM = {
  type: '',
  productId: '',
  warehouseId: '',
  quantity: '',
  description: ''
}

const DEFAULT_USER_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'cliente'
}

const DEMO_USERS = [
  { role: 'Admin',       email: 'admin@techstock.com',    password: 'admin123' },
  { role: 'Gerente',     email: 'gerente@techstock.com',  password: 'gerente123' },
  { role: 'Almacenero',  email: 'almacen@techstock.com',  password: 'almacen123' },
  { role: 'Vendedor',    email: 'vendedor@techstock.com', password: 'vendedor123' },
  { role: 'Cliente',     email: 'cliente@techstock.com',  password: 'cliente123' }
]

export function InventoryProvider({ children }) {
  const [initialized, setInitialized]           = useState(false)
  const [currentUser, setCurrentUser]           = useState(null)
  const [darkMode, setDarkMode]                 = useState(false)
  const [users, setUsers]                       = useState([])
  const [products, setProducts]                 = useState([])
  const [categories, setCategories]             = useState([])
  const [warehouses, setWarehouses]             = useState([])
  const [movements, setMovements]               = useState([])
  const [notifications, setNotifications]       = useState([])
  const [authTab, setAuthTab]                   = useState('login')
  const [loginValues, setLoginValues]           = useState({ email: '', password: '' })
  const [registerValues, setRegisterValues]     = useState({ ...DEFAULT_USER_FORM })
  const [isProductModalOpen, setIsProductModalOpen]     = useState(false)
  const [productEditId, setProductEditId]               = useState(null)
  const [productForm, setProductForm]                   = useState({ ...DEFAULT_PRODUCT_FORM })
  const [isCategoryModalOpen, setIsCategoryModalOpen]   = useState(false)
  const [categoryEditId, setCategoryEditId]             = useState(null)
  const [categoryForm, setCategoryForm]                 = useState({ ...DEFAULT_CATEGORY_FORM })
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false)
  const [warehouseEditId, setWarehouseEditId]           = useState(null)
  const [warehouseForm, setWarehouseForm]               = useState({ ...DEFAULT_WAREHOUSE_FORM })
  const [isMovementModalOpen, setIsMovementModalOpen]   = useState(false)
  const [movementForm, setMovementForm]                 = useState({ ...DEFAULT_MOVEMENT_FORM })
  const [isUserModalOpen, setIsUserModalOpen]           = useState(false)
  const [userEditId, setUserEditId]                     = useState(null)
  const [userForm, setUserForm]                         = useState({ ...DEFAULT_USER_FORM })
  const [isPurchaseModalOpen, setIsPurchaseModalOpen]   = useState(false)
  const [purchaseProduct, setPurchaseProduct]           = useState(null)
  const [purchaseQuantity, setPurchaseQuantity]         = useState('1')

  useEffect(() => {
    Inventory.init()
    refreshState()
    const storedUser = Inventory.getCurrentUser()
    setCurrentUser(storedUser)
    setDarkMode(Inventory.isDarkMode())
    setInitialized(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode)
    Inventory.setDarkMode(darkMode)
  }, [darkMode])

  // ─── REFRESH STATE: todo desde la API ────────────────────────────────────────
  const refreshState = () => {
    apiGetProducts()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts(Inventory.getAllProducts()))

    getCategorias()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories(Inventory.getAllCategories()))

    getAlmacenes()
      .then(data => setWarehouses(Array.isArray(data) ? data : []))
      .catch(() => setWarehouses(Inventory.getAllWarehouses()))

    getUsuarios()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers(Inventory.getAllUsers()))

    // ✅ Movimientos desde la API (no desde local)
    getMovimientos()
      .then(data => setMovements(Array.isArray(data) ? data : []))
      .catch(() => setMovements([]))
  }

  const notify = (message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const hasPermission = permission => Inventory.hasPermission(currentUser, permission)

  // ─── AUTH ─────────────────────────────────────────────────────────────────────
  const handleLogin = event => {
    event.preventDefault()
    const result = Inventory.login(loginValues.email.trim(), loginValues.password)
    if (result.success) {
      setCurrentUser(result.user)
      setLoginValues({ email: '', password: '' })
      refreshState()
      notify(`Bienvenido ${result.user.name}`)
    } else {
      notify(result.message, 'error')
    }
  }

  const handleRegister = event => {
    event.preventDefault()
    const existing = Inventory.getAllUsers().some(u => u.email === registerValues.email.trim())
    if (existing) {
      notify('El email ya está registrado', 'error')
      return
    }
    Inventory.createUser({
      name:     registerValues.name,
      email:    registerValues.email.trim(),
      password: registerValues.password,
      role:     registerValues.role
    })
    setRegisterValues({ ...DEFAULT_USER_FORM })
    refreshState()
    notify('Registro exitoso. Ahora puedes iniciar sesión.', 'success')
    setAuthTab('login')
  }

  const handleLogout = () => {
    Inventory.logout()
    setCurrentUser(null)
    notify('Sesión cerrada', 'success')
  }

  const toggleDarkMode = () => setDarkMode(mode => !mode)

  // ─── PRODUCTOS ────────────────────────────────────────────────────────────────
  const openProductModal = product => {
    if (!hasPermission('manage_products')) {
      notify('No tiene permiso para administrar productos', 'error')
      return
    }
    setProductEditId(product?.id ?? null)
    setProductForm(product ? {
      name:        product.name,
      sku:         product.sku,
      categoryId:  String(product.categoryId),
      warehouseId: String(product.warehouseId),
      price:       String(product.price),
      quantity:    String(product.quantity),
      minStock:    String(product.minStock),
      maxStock:    String(product.maxStock),
      description: product.description || ''
    } : { ...DEFAULT_PRODUCT_FORM })
    setIsProductModalOpen(true)
  }

  const handleProductSave = async event => {
    event.preventDefault()
    if (!productForm.name?.trim()) {
      notify('El nombre del producto es obligatorio', 'error')
      return
    }
    if (!productForm.sku?.trim()) {
      notify('El SKU del producto es obligatorio', 'error')
      return
    }
    if (!productForm.categoryId) {
      notify('Debe seleccionar una categoría', 'error')
      return
    }
    if (!productForm.warehouseId) {
      notify('Debe seleccionar un almacén', 'error')
      return
    }
    const nextProduct = {
      name:        productForm.name.trim(),
      sku:         productForm.sku.trim(),
      categoryId:  parseInt(productForm.categoryId, 10),
      warehouseId: parseInt(productForm.warehouseId, 10),
      price:       parseFloat(productForm.price)    || 0,
      quantity:    parseInt(productForm.quantity,  10) || 0,
      minStock:    parseInt(productForm.minStock,  10) || 0,
      maxStock:    parseInt(productForm.maxStock,  10) || 0,
      description: productForm.description.trim()
    }
    try {
      if (productEditId) {
        await apiUpdateProduct(productEditId, nextProduct)
        notify('Producto actualizado correctamente', 'success')
      } else {
        await apiCreateProduct(nextProduct)
        notify('Producto creado correctamente', 'success')
      }
      refreshState()
      setIsProductModalOpen(false)
    } catch (err) {
      console.error(err)
      notify('Error al guardar el producto', 'error')
    }
  }

  const deleteProduct = async product => {
    if (!hasPermission('manage_products')) {
      notify('No tiene permiso para eliminar productos', 'error')
      return
    }
    if (window.confirm(`¿Está seguro de que desea eliminar el producto "${product.name}"?`)) {
      try {
        await apiDeleteProduct(product.id)
        try { Inventory.deleteProduct(product.id) } catch (e) { }
        refreshState()
        notify('Producto eliminado correctamente', 'success')
      } catch (err) {
        console.error(err)
        notify('Error al eliminar el producto', 'error')
      }
    }
  }

  const openPurchaseModal = product => {
    if (!hasPermission('purchase_products')) {
      notify('No tiene permiso para comprar productos', 'error')
      return
    }
    setPurchaseProduct(product)
    setPurchaseQuantity('1')
    setIsPurchaseModalOpen(true)
  }

  const handlePurchaseSubmit = async () => {
    const quantity = parseInt(purchaseQuantity, 10)
    if (!purchaseProduct) {
      notify('No se seleccionó ningún producto', 'error')
      return
    }
    if (!quantity || quantity <= 0) {
      notify('Cantidad inválida', 'error')
      return
    }
    if (quantity > purchaseProduct.quantity) {
      notify('No hay stock suficiente', 'error')
      return
    }
    try {
      Inventory.removeStock(purchaseProduct.id, quantity, purchaseProduct.warehouseId, 'Compra de cliente')
      refreshState()
      setIsPurchaseModalOpen(false)
      setPurchaseProduct(null)
      setPurchaseQuantity('1')
      notify('Compra realizada correctamente', 'success')
    } catch (err) {
      console.error(err)
      notify('Error al procesar la compra', 'error')
    }
  }

  const handlePurchaseCancel = () => {
    setIsPurchaseModalOpen(false)
    setPurchaseProduct(null)
    setPurchaseQuantity('1')
  }

  // ─── CATEGORÍAS ───────────────────────────────────────────────────────────────
  const openCategoryModal = category => {
    if (!hasPermission('manage_categories')) {
      notify('No tiene permiso para administrar categorías', 'error')
      return
    }
    setCategoryEditId(category?.id ?? null)
    setCategoryForm(category ? {
      name:        category.name,
      description: category.description,
      color:       category.color
    } : { ...DEFAULT_CATEGORY_FORM })
    setIsCategoryModalOpen(true)
  }

  const handleCategorySave = async event => {
    event.preventDefault()
    if (!categoryForm.name?.trim()) {
      notify('El nombre de la categoría es obligatorio', 'error')
      return
    }
    const payload = {
      nombre:      categoryForm.name.trim(),
      descripcion: categoryForm.description.trim(),
      color:       categoryForm.color
    }
    try {
      if (categoryEditId) {
        await updateCategoria(categoryEditId, payload)
        notify('Categoría actualizada correctamente', 'success')
      } else {
        await createCategoria(payload)
        notify('Categoría creada correctamente', 'success')
      }
      refreshState()
      setIsCategoryModalOpen(false)
    } catch (err) {
      console.error(err)
      notify('Error al guardar la categoría', 'error')
    }
  }

  const deleteCategory = async category => {
    if (!hasPermission('manage_categories')) {
      notify('No tiene permiso para eliminar categorías', 'error')
      return
    }
    if (window.confirm(`¿Está seguro de que desea eliminar la categoría "${category.name}"?`)) {
      try {
        await apiDeleteCategoria(category.id)
        refreshState()
        notify('Categoría eliminada correctamente', 'success')
      } catch (err) {
        console.error(err)
        notify('Error al eliminar la categoría', 'error')
      }
    }
  }

  // ─── ALMACENES ────────────────────────────────────────────────────────────────
  const openWarehouseModal = warehouse => {
    if (!hasPermission('manage_warehouses')) {
      notify('No tiene permiso para administrar almacenes', 'error')
      return
    }
    setWarehouseEditId(warehouse?.id ?? null)
    setWarehouseForm(warehouse ? {
      name:     warehouse.name,
      location: warehouse.location,
      capacity: String(warehouse.capacity)
    } : { ...DEFAULT_WAREHOUSE_FORM })
    setIsWarehouseModalOpen(true)
  }

  const handleWarehouseSave = async event => {
    event.preventDefault()
    if (!warehouseForm.name?.trim()) {
      notify('El nombre del almacén es obligatorio', 'error')
      return
    }
    if (!warehouseForm.capacity || parseInt(warehouseForm.capacity, 10) <= 0) {
      notify('La capacidad debe ser mayor a 0', 'error')
      return
    }
    const payload = {
      nombre:    warehouseForm.name.trim(),
      direccion: warehouseForm.location.trim(),
      capacidad: parseInt(warehouseForm.capacity, 10)
    }
    try {
      if (warehouseEditId) {
        await updateAlmacen(warehouseEditId, payload)
        notify('Almacén actualizado correctamente', 'success')
      } else {
        await createAlmacen(payload)
        notify('Almacén creado correctamente', 'success')
      }
      refreshState()
      setIsWarehouseModalOpen(false)
    } catch (err) {
      console.error(err)
      notify('Error al guardar el almacén', 'error')
    }
  }

  const deleteWarehouse = async warehouse => {
    if (!hasPermission('manage_warehouses')) {
      notify('No tiene permiso para eliminar almacenes', 'error')
      return
    }
    if (window.confirm(`¿Está seguro de que desea eliminar el almacén "${warehouse.name}"?`)) {
      try {
        await apiDeleteAlmacen(warehouse.id)
        refreshState()
        notify('Almacén eliminado correctamente', 'success')
      } catch (err) {
        console.error(err)
        notify('Error al eliminar el almacén', 'error')
      }
    }
  }

  // ─── MOVIMIENTOS ──────────────────────────────────────────────────────────────
  const openMovementModal = () => {
    if (!hasPermission('manage_movements')) {
      notify('No tiene permiso para registrar movimientos', 'error')
      return
    }
    setMovementForm({ ...DEFAULT_MOVEMENT_FORM })
    setIsMovementModalOpen(true)
  }

  // ✅ CORREGIDO: ahora llama a la API en lugar de usar Inventory local
  const handleMovementSave = async event => {
    event.preventDefault()
    if (!movementForm.type) {
      notify('Debe seleccionar un tipo de movimiento', 'error')
      return
    }
    if (!movementForm.productId) {
      notify('Debe seleccionar un producto', 'error')
      return
    }
    if (!movementForm.warehouseId) {
      notify('Debe seleccionar una bodega', 'error')
      return
    }
    const qty = parseInt(movementForm.quantity, 10) || 0
    if (qty <= 0) {
      notify('La cantidad debe ser mayor a 0', 'error')
      return
    }

    try {
      await createMovimiento({
        idUsuario:   currentUser?.id ?? 1,
        tipo:        movementForm.type.toUpperCase(),        // "ENTRADA" o "SALIDA"
        idProducto:  parseInt(movementForm.productId, 10),
        cantidad:    qty,
        descripcion: movementForm.description?.trim() || ''
      })

      refreshState()
      setIsMovementModalOpen(false)
      notify('Movimiento registrado correctamente', 'success')
    } catch (err) {
      console.error(err)
      notify('Stock insuficiente o selección incorrecta', 'error')
    }
  }

  // ─── USUARIOS ─────────────────────────────────────────────────────────────────
  const openUserModal = user => {
    if (!hasPermission('manage_users')) {
      notify('No tiene permiso para administrar usuarios', 'error')
      return
    }
    setUserEditId(user?.id ?? null)
    setUserForm(user ? {
      name:     user.name,
      email:    user.email,
      password: user.password || '',
      role:     user.role
    } : { ...DEFAULT_USER_FORM })
    setIsUserModalOpen(true)
  }

  const handleUserSave = async event => {
    event.preventDefault()
    if (!userForm.name?.trim()) {
      notify('El nombre de la empresa es obligatorio', 'error')
      return
    }
    if (!userForm.email?.trim()) {
      notify('El email es obligatorio', 'error')
      return
    }
    if (!userForm.role) {
      notify('Debe seleccionar un rol', 'error')
      return
    }
    const payload = {
      nombreEmpresa: userForm.name.trim(),
      correo:        userForm.email.trim(),
      tipo:          userForm.role
    }
    try {
      if (userEditId) {
        await updateUsuario(userEditId, payload)
        notify('Usuario actualizado correctamente', 'success')
      } else {
        await createUsuario(payload)
        notify('Usuario creado correctamente', 'success')
      }
      refreshState()
      setIsUserModalOpen(false)
    } catch (err) {
      console.error(err)
      notify('Error al guardar el usuario', 'error')
    }
  }

  const deleteUser = async user => {
    if (!hasPermission('manage_users')) {
      notify('No tiene permiso para eliminar usuarios', 'error')
      return
    }
    if (currentUser?.id === user.id) {
      notify('No puede eliminar el usuario con sesión activa', 'error')
      return
    }
    if (window.confirm(`¿Está seguro de que desea eliminar el usuario "${user.name}"?`)) {
      try {
        await apiDeleteUsuario(user.id)
        refreshState()
        notify('Usuario eliminado correctamente', 'success')
      } catch (err) {
        console.error(err)
        notify('Error al eliminar el usuario', 'error')
      }
    }
  }

  // ─── CONTEXT VALUE ────────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    initialized,
    currentUser,
    darkMode,
    users,
    products,
    categories,
    warehouses,
    movements,
    notifications,
    authTab,
    loginValues,
    registerValues,
    isProductModalOpen,
    productEditId,
    productForm,
    isCategoryModalOpen,
    categoryEditId,
    categoryForm,
    isWarehouseModalOpen,
    warehouseEditId,
    warehouseForm,
    isMovementModalOpen,
    movementForm,
    isUserModalOpen,
    userEditId,
    userForm,
    demoUsers: DEMO_USERS,
    setAuthTab,
    setLoginValues,
    setRegisterValues,
    handleLogin,
    handleRegister,
    handleLogout,
    toggleDarkMode,
    hasPermission,
    openProductModal,
    setIsProductModalOpen,
    setProductForm,
    handleProductSave,
    deleteProduct,
    openPurchaseModal,
    handlePurchaseSubmit,
    handlePurchaseCancel,
    purchaseProduct,
    purchaseQuantity,
    setPurchaseQuantity,
    isPurchaseModalOpen,
    openCategoryModal,
    setIsCategoryModalOpen,
    setCategoryForm,
    handleCategorySave,
    deleteCategory,
    openWarehouseModal,
    setIsWarehouseModalOpen,
    setWarehouseForm,
    handleWarehouseSave,
    deleteWarehouse,
    openMovementModal,
    setIsMovementModalOpen,
    setMovementForm,
    handleMovementSave,
    openUserModal,
    setIsUserModalOpen,
    setUserForm,
    handleUserSave,
    deleteUser,
    notify
  }), [
    initialized,
    currentUser,
    darkMode,
    users,
    products,
    categories,
    warehouses,
    movements,
    notifications,
    authTab,
    loginValues,
    registerValues,
    isProductModalOpen,
    productEditId,
    productForm,
    isCategoryModalOpen,
    categoryEditId,
    categoryForm,
    isWarehouseModalOpen,
    warehouseEditId,
    warehouseForm,
    isMovementModalOpen,
    movementForm,
    isUserModalOpen,
    userEditId,
    userForm,
    isPurchaseModalOpen,
    purchaseProduct,
    purchaseQuantity
  ])

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}