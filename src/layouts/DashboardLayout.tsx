import React from 'react'
import { AppShell, AppShellSidebar, AppShellMain, MobileSidebarTrigger, SidebarItem, Button } from '@blinkdotnew/ui'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Settings, 
  LogOut, 
  Newspaper, 
  MessageSquare, 
  AlertTriangle, 
  Phone, 
  Map, 
  HelpCircle,
  Volume2,
  Moon,
  Sun,
  Search
} from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { useTheme } from '../lib/hooks/useTheme'
import { Footer } from '../components/Footer'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  
  const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/'
}

  return (
    <AppShell>
      <AppShellSidebar className="shrink-0">
        <div className="flex flex-col h-full w-[260px] bg-sidebar border-r border-sidebar-border overflow-hidden">
          <div className="shrink-0 border-b border-sidebar-border px-6 py-4 flex items-center gap-3">
            <img src="/logo-portada.png" alt="AscensoCim Perú" className="h-6 w-6 object-contain" />
            <span className="font-bold text-lg text-sidebar-foreground">AscensoCim Perú</span>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              label="Inicio" 
              href="/" 
              active={location.pathname === '/'} 
            />
            
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Estudio
            </div>
            
            <SidebarItem 
              icon={<Newspaper size={20} />} 
              label="Noticias" 
              href="/temarios" 
              active={location.pathname === '/temarios'} 
            />
            <SidebarItem 
              icon={<FileText size={20} />} 
              label="Banco de Preguntas" 
              href="/exam" 
              active={location.pathname === '/exam'} 
            />
            <SidebarItem 
              icon={<Volume2 size={20} />} 
              label="Audio Preguntas" 
              href="/audio" 
              active={location.pathname === '/audio'} 
            />
            
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Práctica
            </div>
            
            <SidebarItem 
              icon={<BookOpen size={20} />} 
              label="Práctica por Temas" 
              href="/practica" 
              active={location.pathname === '/practica'} 
            />
            
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Herramientas
            </div>
            
            <SidebarItem 
              icon={<MessageSquare size={20} />} 
              label="Inteligencia Artificial" 
              href="/ia" 
              active={location.pathname === '/ia'} 
            />
            <SidebarItem 
              icon={<AlertTriangle size={20} />} 
              label="Tabla Infracciones" 
              href="/infracciones" 
              active={location.pathname === '/infracciones'} 
            />
            <SidebarItem 
              icon={<Phone size={20} />} 
              label="Directorio Telefónico" 
              href="/directorio" 
              active={location.pathname === '/directorio'} 
            />
            <SidebarItem 
              icon={<Map size={20} />} 
              label="Mapa Jurisdiccional" 
              href="/mapa" 
              active={location.pathname === '/mapa'} 
            />
            <SidebarItem 
              icon={<Search size={20} />} 
              label="Buscar Papeletas ATU" 
              href="/papeletas-atu" 
              active={location.pathname === '/papeletas-atu'} 
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Usuarios" 
              href="/admin-users" 
              active={location.pathname === '/admin-users'} 
            />
          </div>
          
          <div className="shrink-0 border-t border-sidebar-border p-4 space-y-2">
            <SidebarItem 
              icon={<HelpCircle size={20} />} 
              label="Ayuda" 
              href="/ayuda" 
              active={location.pathname === '/ayuda'} 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10"
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </AppShellSidebar>
      
      <AppShellMain>
        <div className="md:hidden flex items-center justify-between px-6 h-16 border-b bg-card">
          <div className="flex items-center gap-3">
            <MobileSidebarTrigger />
            <div className="flex items-center gap-2">
              <img src="/logo-portada.png" alt="AscensoCim Perú" className="h-5 w-5 object-contain" />
              <span className="font-bold">AscensoCim Perú</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        <main className="flex-1 overflow-y-auto bg-background flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </AppShellMain>
    </AppShell>
  )
}
