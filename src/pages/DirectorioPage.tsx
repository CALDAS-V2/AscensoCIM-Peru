import React, { useState } from 'react'
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody, 
  DataTable, 
  SearchInput,
  Card,
  CardContent,
  Badge
} from '@blinkdotnew/ui'
import { Phone, Building2, MapPin, Search } from 'lucide-react'

export function DirectorioPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const mockDirectory = [
    { id: '1', unit: 'Comisaría de Miraflores', phone: '987-654-321', category: 'Comisaría', location: 'Miraflores, Lima' },
    { id: '2', unit: 'DIVOPUS Centro 1', phone: '912-345-678', category: 'DIVOPUS', location: 'Lima Cercado' },
    { id: '3', unit: 'Comisaría de San Isidro', phone: '999-888-777', category: 'Comisaría', location: 'San Isidro, Lima' },
    { id: '4', unit: 'DEPINCRI Surco', phone: '944-555-666', category: 'DEPINCRI', location: 'Surco, Lima' },
    { id: '5', unit: 'Comisaría PNP Familia Ayacucho "M"', phone: '966-831-065', category: 'Comisaría', location: 'Jr. Libertad N° 1200, Ayacucho – Huamanga – Ayacucho' },
  ]

  const columns = [
    { 
      accessorKey: 'unit', 
      header: 'Unidad / Comisaría',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Building2 size={16} />
          </div>
          <span className="font-bold">{row.original.unit}</span>
        </div>
      )
    },
    { 
      accessorKey: 'category', 
      header: 'Categoría',
      cell: ({ row }: any) => <Badge variant="secondary">{row.original.category}</Badge>
    },
    { 
      accessorKey: 'phone', 
      header: 'Teléfono / Celular',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 font-mono text-primary font-bold">
          <Phone size={14} />
          {row.original.phone}
        </div>
      )
    },
    { 
      accessorKey: 'location', 
      header: 'Jurisdicción',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} />
          {row.original.location}
        </div>
      )
    }
  ]

  return (
    <Page>
      <PageHeader>
        <div className="flex flex-col gap-1">
          <PageTitle className="font-serif">Prontuario Telefónico</PageTitle>
          <PageDescription>Directorio de celulares por comisarías, DIVOPUS y unidades especializadas</PageDescription>
        </div>
      </PageHeader>
      
      <PageBody className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full max-w-md">
            <SearchInput 
              placeholder="Buscar por nombre o jurisdicción..." 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">A - Z</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">Por DIVOPUS</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">Por Unidad</Badge>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={mockDirectory} 
          searchable={false}
        />

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4 text-sm text-primary">
            <Info size={20} />
            <p>
              Este directorio se actualiza periódicamente. Si encuentras algún número desactualizado, por favor repórtalo en la sección de ayuda.
            </p>
          </CardContent>
        </Card>
      </PageBody>
    </Page>
  )
}

function Info({ size, className }: { size: number, className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
