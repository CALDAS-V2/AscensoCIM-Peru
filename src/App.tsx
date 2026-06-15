import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router'
import { DashboardLayout } from './layouts/DashboardLayout'
import { HomePage } from './pages/HomePage'
import { ExamPage } from './pages/ExamPage'
import { IAPage } from './pages/IAPage'
import { InfraccionesPage } from './pages/InfraccionesPage'
import { DirectorioPage } from './pages/DirectorioPage'
import { TemariosPage } from './pages/TemariosPage'
import { AudioPage } from './pages/AudioPage'
import { MapaPage } from './pages/MapaPage'
import { AyudaPage } from './pages/AyudaPage'
import { PracticaPage } from './pages/PracticaPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { LoginPageV2 } from './pages/LoginPageV2'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { PapeletasAtuPage } from './pages/PapeletasAtuPage'
import { useAuth } from './lib/useAuth'
import { useState, useEffect } from 'react'

// Root route principal
const rootRoute = createRootRoute({
  component: () => {
    const { user, loading } = useAuth()
    const [isResetting, setIsResetting] = useState(false)

    useEffect(() => {
      setIsResetting(window.location.pathname === '/reset-password')
    }, [])

    // Si está cargando, mostrar pantalla de carga
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      )
    }

    // Si es reset-password, mostrar solo el outlet
    if (isResetting) {
      return <Outlet />
    }

    // Si no hay usuario autenticado, mostrar login
    if (!user) {
      return <LoginPageV2 />
    }

    // Si hay usuario, mostrar dashboard
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    )
  }
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
})

const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam',
  component: ExamPage
})

const iaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ia',
  component: IAPage
})

const infraccionesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/infracciones',
  component: InfraccionesPage
})

const directorioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/directorio',
  component: DirectorioPage
})

const temariosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/temarios',
  component: TemariosPage
})

const audioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio',
  component: AudioPage
})

const mapaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mapa',
  component: MapaPage
})

const ayudaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ayuda',
  component: AyudaPage
})

const practicaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/practica',
  component: PracticaPage
})

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-users',
  component: AdminUsersPage
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordPage
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage
})

const papeletasAtuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/papeletas-atu',
  component: PapeletasAtuPage
})

const routeTree = rootRoute.addChildren([
  indexRoute, 
  examRoute, 
  iaRoute, 
  infraccionesRoute, 
  directorioRoute,
  temariosRoute,
  audioRoute,
  mapaRoute,
  ayudaRoute,
  practicaRoute,
  adminUsersRoute,
  resetPasswordRoute,
  forgotPasswordRoute,
  papeletasAtuRoute
])
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}