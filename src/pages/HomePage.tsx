import React, { useState } from 'react'
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody, 
  StatGroup, 
  Stat, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  DataTable,
  Input,
  Badge,
  Persona
} from '@blinkdotnew/ui'
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Search, 
  Trophy, 
  User as UserIcon,
  ChevronRight,
  Target,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '../lib/useAuth'

export function HomePage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  // Datos de usuarios registrados del sistema
  const allUsers = [
    { 
      id: '1', 
      name: 'SO1 Juan Perez', 
      grade: 'SO1', 
      score: 98, 
      position: 1,
      daysStudied: 15,
      studyHours: 52.5,
      lastStudy: '02JUN2026',
      averageScore: 92,
      profilePicture: '👮'
    },
    { 
      id: '2', 
      name: 'SO2 Maria Garcia', 
      grade: 'SO2', 
      score: 95, 
      position: 2,
      daysStudied: 18,
      studyHours: 64.3,
      lastStudy: '02JUN2026',
      averageScore: 88,
      profilePicture: '👩‍💼'
    },
    { 
      id: '3', 
      name: 'SO3 Carlos Ruiz', 
      grade: 'SO3', 
      score: 92, 
      position: 3,
      daysStudied: 12,
      studyHours: 45.7,
      lastStudy: '01JUN2026',
      averageScore: 85,
      profilePicture: '👮‍♂️'
    },
    { 
      id: '4', 
      name: 'SO1 Ana Lopez', 
      grade: 'SO1', 
      score: 90, 
      position: 4,
      daysStudied: 20,
      studyHours: 72.0,
      lastStudy: '02JUN2026',
      averageScore: 87,
      profilePicture: '👩‍🔬'
    },
    { 
      id: '5', 
      name: 'SO2 Roberto Diaz', 
      grade: 'SO2', 
      score: 88, 
      position: 5,
      daysStudied: 14,
      studyHours: 51.2,
      lastStudy: '31MAY2026',
      averageScore: 84,
      profilePicture: '👨‍⚖️'
    }
  ]

  // Obtener datos del usuario actual o datos por defecto
  const currentUserData = allUsers.find(u => u.name.includes('Juan')) || allUsers[0]
  
  const mockRanking = allUsers

  const columns = [
    { 
      accessorKey: 'position', 
      header: 'Puesto',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          {row.original.position <= 3 ? (
            <Trophy size={16} className={
              row.original.position === 1 ? 'text-yellow-500' :
              row.original.position === 2 ? 'text-slate-400' :
              'text-amber-600'
            } />
          ) : null}
          <span className="font-semibold">{row.original.position}°</span>
        </div>
      )
    },
    { 
      accessorKey: 'name', 
      header: 'Suboficial',
      cell: ({ row }: any) => <Persona name={row.original.name} subtitle={row.original.grade} />
    },
    { 
      accessorKey: 'score', 
      header: 'Puntaje',
      cell: ({ row }: any) => (
        <Badge variant={row.original.score >= 90 ? 'default' : 'secondary'}>
          {row.original.score}%
        </Badge>
      )
    }
  ]

  return (
    <Page>
      <PageHeader>
        <div className="flex flex-col gap-1">
          <PageTitle className="font-serif text-3xl">Bienvenido, {(user as any)?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Oficial'}</PageTitle>
          <PageDescription>Panel de control y estadísticas de aprendizaje</PageDescription>
        </div>
      </PageHeader>
      
      <PageBody className="space-y-8">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat 
            label="Días Estudiados" 
            value={currentUserData.daysStudied.toString()} 
            icon={<Calendar className="text-primary" />} 
            description="Total acumulado"
          />
          <Stat 
            label="Horas de Estudio" 
            value={currentUserData.studyHours.toString()} 
            icon={<Clock className="text-primary" />} 
            description="Horas registradas"
          />
          <Stat 
            label="Último Estudio" 
            value={currentUserData.lastStudy} 
            icon={<Target className="text-primary" />} 
            description="Fecha del último acceso"
          />
          <Stat 
            label="Promedio Aprendizaje" 
            value={currentUserData.averageScore + '%'} 
            trend={12} 
            trendLabel="vs semana pasada"
            icon={<TrendingUp className="text-accent" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News & Top Scores */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
                    <Trophy size={14} className="text-accent" />
                    NOTICIAS DE ASCENSO
                  </div>
                  <h3 className="text-2xl font-bold">¡Felicidades al SO1 Juan Perez!</h3>
                  <p className="text-white/80 max-w-md">
                    Ha logrado el mayor puntaje de aprendizaje esta semana con un impresionante 98% en el simulador integral.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-white/60 uppercase">Grado</span>
                      <span className="font-bold">SO1</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-white/60 uppercase">Especialidad</span>
                      <span className="font-bold">Prevención</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                     src="/felicidades.png.jpeg" 
                     alt="Felicidades" 
                     className="w-32 h-32 object-cover rounded-lg shadow-lg"
                   />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-serif">Ranking por Grados</h3>
                <div className="w-64 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Buscar oficial..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <DataTable 
                columns={columns} 
                data={mockRanking.filter(item => 
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.grade.toLowerCase().includes(searchQuery.toLowerCase())
                )} 
                searchable={false}
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zona de Estudio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Leyes y Artículos</div>
                    <div className="text-xs text-muted-foreground">Repaso rápido</div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors group">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Target size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Preguntas Falladas</div>
                    <div className="text-xs text-muted-foreground">Refuerza tus errores</div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={20} className="text-accent" />
                  Progreso de {currentUserData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Temarios Completados</span>
                    <span className="font-bold">{currentUserData.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-accent/20 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${currentUserData.score}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Simulacros Realizados</span>
                    <span className="font-bold">{Math.floor(currentUserData.studyHours * 2)}/100</span>
                  </div>
                  <div className="h-2 w-full bg-accent/20 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${Math.floor(currentUserData.studyHours * 2)}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBody>
    </Page>
  )
}

// Icono personalizado de GraduationCap mejorado
function GraduationCapIcon({ size = 120, className = '' }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}