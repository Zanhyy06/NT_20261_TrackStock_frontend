import { useState } from 'react'
import { useLocation, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { InventoryProvider, useInventory } from './context/InventoryContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Notifications from './components/Notifications'
import DashboardPage from './pages/Dashboard'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import WarehousesPage from './pages/WarehousesPage'
import MovementsPage from './pages/MovementsPage'
import UsersPage from './pages/UsersPage'
import LoginPage from './pages/LoginPage'
import './index.css'

const pageRoutes = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', permission: 'view_dashboard' },
  { path: '/products', label: 'Productos', icon: '📦', permission: 'view_products' },
  { path: '/categories', label: 'Categorías', icon: '🏷️', permission: 'view_categories' },
  { path: '/warehouses', label: 'Almacenes', icon: '🏢', permission: 'manage_warehouses' },
  { path: '/movements', label: 'Movimientos', icon: '🔄', permission: 'manage_movements' },
  { path: '/users', label: 'Usuarios', icon: '👥', permission: 'manage_users' }
]

function AppLayout() {
  const { currentUser, notifications, darkMode, handleLogout, toggleDarkMode, hasPermission } = useInventory()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const activePath = location.pathname === '/' ? '/dashboard' : location.pathname
  const pageTitle = pageRoutes.find(route => route.path === activePath)?.label || 'Dashboard'

  return (
    <div className="dashboard-container">
      <Sidebar
        pages={pageRoutes}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(open => !open)}
      />
      <main className="main-content">
        <Topbar
          pageTitle={pageTitle}
          currentUser={currentUser}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(open => !open)}
        />
        <section className="page-content">
          <Outlet />
        </section>
      </main>
      <Notifications notifications={notifications} />
    </div>
  )
}

function ProtectedRoute({ permission, children }) {
  const { currentUser, hasPermission } = useInventory()
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  if (!hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { currentUser } = useInventory()
  return currentUser ? <Navigate to="/dashboard" replace /> : children
}

function ProtectedLayout() {
  const { currentUser } = useInventory()
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  return <AppLayout />
}

function AppContent() {
  const { initialized, currentUser } = useInventory()

  if (!initialized) {
    return <div className="page-content"><p>Cargando aplicación...</p></div>
  }

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute permission="view_dashboard"><DashboardPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute permission="view_products"><ProductsPage /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute permission="view_categories"><CategoriesPage /></ProtectedRoute>} />
        <Route path="/warehouses" element={<ProtectedRoute permission="manage_warehouses"><WarehousesPage /></ProtectedRoute>} />
        <Route path="/movements" element={<ProtectedRoute permission="manage_movements"><MovementsPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute permission="manage_users"><UsersPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  )
}

export default App
