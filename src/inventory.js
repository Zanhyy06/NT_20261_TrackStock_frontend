const STORAGE_KEYS = {
  users: 'ts_users',
  products: 'ts_products',
  categories: 'ts_categories',
  warehouses: 'ts_warehouses',
  movements: 'ts_movements',
  currentUser: 'ts_current_user',
  darkMode: 'ts_dark_mode'
};

const ROLES = {
  ADMIN: 'admin',
  GERENTE: 'gerente',
  ALMACENERO: 'almacenero',
  VENDEDOR: 'vendedor',
  CLIENTE: 'cliente'
};

const PERMISSIONS = {
  admin: ['view_dashboard', 'manage_users', 'manage_products', 'manage_categories', 'manage_warehouses', 'manage_movements', 'reports', 'settings', 'view_categories', 'purchase_products', 'view_products', 'view_movements'],
  gerente: ['view_dashboard', 'manage_products', 'manage_categories', 'manage_warehouses', 'manage_movements', 'reports', 'view_categories', 'purchase_products', 'view_products', 'view_movements'],
  almacenero: ['view_dashboard', 'view_products', 'view_movements', 'view_categories'],
  vendedor: ['view_dashboard', 'view_products', 'view_movements', 'view_categories', 'purchase_products'],
  cliente: ['view_dashboard', 'view_products', 'view_categories', 'purchase_products']
};

const DEFAULT_USERS = [
  { id: 1, name: 'Admin Sistema', email: 'admin@techstock.com', password: 'admin123', role: ROLES.ADMIN, createdAt: new Date().toISOString() },
  { id: 2, name: 'Gerente Tech', email: 'gerente@techstock.com', password: 'gerente123', role: ROLES.GERENTE, createdAt: new Date().toISOString() },
  { id: 3, name: 'Almacenero', email: 'almacen@techstock.com', password: 'almacen123', role: ROLES.ALMACENERO, createdAt: new Date().toISOString() },
  { id: 4, name: 'Vendedor Tech', email: 'vendedor@techstock.com', password: 'vendedor123', role: ROLES.VENDEDOR, createdAt: new Date().toISOString() },
  { id: 5, name: 'Cliente Demo', email: 'cliente@techstock.com', password: 'cliente123', role: ROLES.CLIENTE, createdAt: new Date().toISOString() }
];

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Laptops & PCs', description: 'Portátiles, sobremesa y workstations', color: '#22d3ee', createdAt: new Date().toISOString() },
  { id: 2, name: 'Periféricos', description: 'Teclados, ratones, monitores y accesorios', color: '#a78bfa', createdAt: new Date().toISOString() },
  { id: 3, name: 'Redes & Conectividad', description: 'Routers, switches, cables y networking', color: '#10b981', createdAt: new Date().toISOString() },
  { id: 4, name: 'Almacenamiento', description: 'SSD, HDD, memorias y NAS', color: '#f59e0b', createdAt: new Date().toISOString() },
  { id: 5, name: 'Audio & Video', description: 'Auriculares, cámaras, micrófonos y streaming', color: '#f43f5e', createdAt: new Date().toISOString() },
  { id: 6, name: 'Componentes', description: 'CPUs, GPUs, RAM y placas madre', color: '#fb923c', createdAt: new Date().toISOString() }
];

const DEFAULT_WAREHOUSES = [
  { id: 1, name: 'HQ TechStock Bogotá', location: 'Bogotá D.C.', capacity: 15000, createdAt: new Date().toISOString() },
  { id: 2, name: 'Bodega Medellín', location: 'Medellín', capacity: 8000, createdAt: new Date().toISOString() },
  { id: 3, name: 'Sucursal Cali', location: 'Cali', capacity: 5000, createdAt: new Date().toISOString() }
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'MacBook Pro 16" M3', sku: 'MBP-M3-16', categoryId: 1, description: 'Apple MacBook Pro 16 pulgadas, chip M3 Pro, 18GB RAM, 512GB SSD', price: 8499900, quantity: 12, minStock: 3, maxStock: 30, warehouseId: 1, createdAt: new Date().toISOString() },
  { id: 2, name: 'Dell XPS 15 OLED', sku: 'DXP-15-OL', categoryId: 1, description: 'Intel Core i9 13ª gen, RTX 4070, 32GB DDR5, 1TB NVMe', price: 6299900, quantity: 8, minStock: 2, maxStock: 20, warehouseId: 1, createdAt: new Date().toISOString() },
  { id: 3, name: 'Monitor LG UltraWide 34"', sku: 'LG-UW-34', categoryId: 2, description: 'Panel IPS 144Hz, resolución 3440x1440, FreeSync Premium, USB-C 96W', price: 1890000, quantity: 20, minStock: 5, maxStock: 60, warehouseId: 1, createdAt: new Date().toISOString() },
  { id: 4, name: 'Teclado Keychron Q3 Pro', sku: 'KCH-Q3P', categoryId: 2, description: 'Mecánico TKL, switches Gateron Pro, RGB, inalámbrico Bluetooth 5.1', price: 620000, quantity: 35, minStock: 8, maxStock: 100, warehouseId: 2, createdAt: new Date().toISOString() },
  { id: 5, name: 'Logitech MX Master 3S', sku: 'LGT-MX3S', categoryId: 2, description: 'Ratón inalámbrico premium, 8000 DPI, recarga USB-C, Bolt receiver', price: 380000, quantity: 50, minStock: 10, maxStock: 150, warehouseId: 2, createdAt: new Date().toISOString() },
  { id: 6, name: 'Router ASUS WiFi 7 BE88U', sku: 'ASS-BE88U', categoryId: 3, description: 'WiFi 7 AXE16000, 8 puertos LAN 2.5G, AI Mesh, seguridad AiProtection', price: 1450000, quantity: 15, minStock: 3, maxStock: 40, warehouseId: 1, createdAt: new Date().toISOString() },
  { id: 7, name: 'Samsung 990 Pro 2TB NVMe', sku: 'SAM-990P-2T', categoryId: 4, description: 'PCIe 4.0 NVMe M.2, lectura 7450 MB/s, escritura 6900 MB/s, TLC NAND', price: 480000, quantity: 60, minStock: 15, maxStock: 200, warehouseId: 2, createdAt: new Date().toISOString() },
  { id: 8, name: 'Sony WH-1000XM5', sku: 'SNY-XM5', categoryId: 5, description: 'Auriculares NC inalámbricos, 30h batería, codecs LDAC/AAC, multipoint', price: 950000, quantity: 4, minStock: 5, maxStock: 50, warehouseId: 1, createdAt: new Date().toISOString() },
  { id: 9, name: 'NVIDIA RTX 4080 Super', sku: 'NV-4080S', categoryId: 6, description: '16GB GDDR6X, DLSS 3.5, Ray Tracing Gen 3, base 2295 MHz', price: 4200000, quantity: 7, minStock: 2, maxStock: 20, warehouseId: 1, createdAt: new Date().toISOString() },
  { id: 10, name: 'Elgato Stream Deck XL', sku: 'ELG-SDXL', categoryId: 5, description: '32 teclas LCD personalizables, integración streaming/productividad', price: 590000, quantity: 18, minStock: 4, maxStock: 50, warehouseId: 3, createdAt: new Date().toISOString() }
];

function getStorage(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function setStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function getNextId(items) {
  return Math.max(0, ...items.map(i => i.id || 0)) + 1;
}

export const Inventory = {
  init() {
    if (!getStorage(STORAGE_KEYS.users)) setStorage(STORAGE_KEYS.users, DEFAULT_USERS);
    if (!getStorage(STORAGE_KEYS.categories)) setStorage(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
    if (!getStorage(STORAGE_KEYS.warehouses)) setStorage(STORAGE_KEYS.warehouses, DEFAULT_WAREHOUSES);
    if (!getStorage(STORAGE_KEYS.products)) setStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    if (!getStorage(STORAGE_KEYS.movements)) setStorage(STORAGE_KEYS.movements, []);
  },

  getCurrentUser() { return getStorage(STORAGE_KEYS.currentUser); },
  setCurrentUser(user) {
    if (user) setStorage(STORAGE_KEYS.currentUser, user);
    else localStorage.removeItem(STORAGE_KEYS.currentUser);
  },

  isDarkMode() { return getStorage(STORAGE_KEYS.darkMode) || false; },
  setDarkMode(v) { setStorage(STORAGE_KEYS.darkMode, v); },

  login(email, password) {
    const users = getStorage(STORAGE_KEYS.users) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { this.setCurrentUser(user); return { success: true, user }; }
    return { success: false, message: 'Credenciales incorrectas' };
  },

  logout() { this.setCurrentUser(null); },

  hasPermission(user, permission) {
    if (!user) return false;
    const perms = PERMISSIONS[user.role] || [];
    return perms.includes(permission);
  },

  getAllUsers() { return getStorage(STORAGE_KEYS.users) || []; },
  createUser(data) {
    const users = this.getAllUsers();
    const user = { id: getNextId(users), ...data, createdAt: new Date().toISOString() };
    setStorage(STORAGE_KEYS.users, [...users, user]);
    return user;
  },
  updateUser(id, data) {
    const users = this.getAllUsers().map(u => u.id === id ? { ...u, ...data } : u);
    setStorage(STORAGE_KEYS.users, users);
  },
  deleteUser(id) {
    setStorage(STORAGE_KEYS.users, this.getAllUsers().filter(u => u.id !== id));
  },

  getAllProducts() { return getStorage(STORAGE_KEYS.products) || []; },
  getProductById(id) { return this.getAllProducts().find(p => p.id === id); },
  createProduct(data) {
    const products = this.getAllProducts();
    const product = { id: getNextId(products), ...data, createdAt: new Date().toISOString() };
    setStorage(STORAGE_KEYS.products, [...products, product]);
    return product;
  },
  updateProduct(id, data) {
    const products = this.getAllProducts().map(p => p.id === id ? { ...p, ...data } : p);
    setStorage(STORAGE_KEYS.products, products);
  },
  deleteProduct(id) {
    setStorage(STORAGE_KEYS.products, this.getAllProducts().filter(p => p.id !== id));
  },

  getAllCategories() { return getStorage(STORAGE_KEYS.categories) || []; },
  createCategory(data) {
    const cats = this.getAllCategories();
    const cat = { id: getNextId(cats), ...data, createdAt: new Date().toISOString() };
    setStorage(STORAGE_KEYS.categories, [...cats, cat]);
    return cat;
  },
  updateCategory(id, data) {
    setStorage(STORAGE_KEYS.categories, this.getAllCategories().map(c => c.id === id ? { ...c, ...data } : c));
  },
  deleteCategory(id) {
    setStorage(STORAGE_KEYS.categories, this.getAllCategories().filter(c => c.id !== id));
  },

  getAllWarehouses() { return getStorage(STORAGE_KEYS.warehouses) || []; },
  createWarehouse(data) {
    const ws = this.getAllWarehouses();
    const w = { id: getNextId(ws), ...data, createdAt: new Date().toISOString() };
    setStorage(STORAGE_KEYS.warehouses, [...ws, w]);
    return w;
  },
  updateWarehouse(id, data) {
    setStorage(STORAGE_KEYS.warehouses, this.getAllWarehouses().map(w => w.id === id ? { ...w, ...data } : w));
  },
  deleteWarehouse(id) {
    setStorage(STORAGE_KEYS.warehouses, this.getAllWarehouses().filter(w => w.id !== id));
  },

  getAllMovements() { return getStorage(STORAGE_KEYS.movements) || []; },
  addStock(productId, qty, warehouseId, description) {
    const products = this.getAllProducts();
    const idx = products.findIndex(p => p.id === productId && p.warehouseId === warehouseId);
    if (idx === -1) return false;
    products[idx].quantity += qty;
    setStorage(STORAGE_KEYS.products, products);
    const movements = this.getAllMovements();
    movements.push({ id: getNextId(movements), type: 'entrada', productId, warehouseId, quantity: qty, description, createdAt: new Date().toISOString() });
    setStorage(STORAGE_KEYS.movements, movements);
    return true;
  },
  removeStock(productId, qty, warehouseId, description) {
    const products = this.getAllProducts();
    const idx = products.findIndex(p => p.id === productId && p.warehouseId === warehouseId);
    if (idx === -1 || products[idx].quantity < qty) return false;
    products[idx].quantity -= qty;
    setStorage(STORAGE_KEYS.products, products);
    const movements = this.getAllMovements();
    movements.push({ id: getNextId(movements), type: 'salida', productId, warehouseId, quantity: qty, description, createdAt: new Date().toISOString() });
    setStorage(STORAGE_KEYS.movements, movements);
    return true;
  },

  formatCurrency(v) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
  },
  formatDate(d) {
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
  }
};
