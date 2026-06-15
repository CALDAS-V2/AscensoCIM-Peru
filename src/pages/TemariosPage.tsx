import React from 'react'
import { Page, PageHeader, PageTitle, PageDescription, PageBody, EmptyState } from '@blinkdotnew/ui'
import { BookOpen } from 'lucide-react'

export function TemariosPage() {
  const recursos = [
    {
      id: 1,
      titulo: "Ley Orgánica de la Policía Nacional del Perú",
      tipo: "Ley",
      fecha: "2024-01-15",
      descripcion: "Normativa fundamental que rige la organización y funcionamiento de la PNP"
    },
    {
      id: 2,
      titulo: "Manual de Procedimientos Policiales",
      tipo: "Libro",
      fecha: "2024-02-20",
      descripcion: "Guía completa de protocolos y procedimientos operativos"
    },
    {
      id: 3,
      titulo: "Reglamento de Uso de la Fuerza",
      tipo: "Artículo",
      fecha: "2024-03-10",
      descripcion: "Normas sobre el uso proporcional y legal de la fuerza policial"
    },
    {
      id: 4,
      titulo: "Código de Ética Policial",
      tipo: "Ley",
      fecha: "2024-04-05",
      descripcion: "Principios éticos y conducta profesional de los policías"
    },
    {
      id: 5,
      titulo: "Derechos Humanos y Seguridad Pública",
      tipo: "Libro",
      fecha: "2024-05-12",
      descripcion: "Equilibrio entre seguridad y protección de derechos fundamentales"
    },
    {
      id: 6,
      titulo: "Artículo sobre Modernización Policial",
      tipo: "Artículo",
      fecha: "2024-06-01",
      descripcion: "Iniciativas de tecnología y mejora continua en la institución"
    }
  ];

  const getTipoBadge = (tipo: string) => {
    const colores = {
      "Ley": "bg-blue-100 text-blue-800",
      "Libro": "bg-green-100 text-green-800",
      "Artículo": "bg-purple-100 text-purple-800"
    };
    return colores[tipo as keyof typeof colores] || "bg-gray-100 text-gray-800";
  };

  return (
    <Page>
      <PageHeader>
        <PageTitle>Noticias</PageTitle>
        <PageDescription>Libros, artículos y leyes de la PNP</PageDescription>
      </PageHeader>
      <PageBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursos.map((recurso) => (
            <div key={recurso.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-foreground flex-1 pr-2">{recurso.titulo}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getTipoBadge(recurso.tipo)}`}>
                  {recurso.tipo}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{recurso.descripcion}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">{recurso.fecha}</span>
                <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:opacity-90">
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </Page>
  )
}
