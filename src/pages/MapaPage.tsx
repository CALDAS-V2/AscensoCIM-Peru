import React from 'react'
import { Page, PageHeader, PageTitle, PageDescription, PageBody, Card, CardContent } from '@blinkdotnew/ui'
import { MapPin } from 'lucide-react'

export function MapaPage() {
  // Mapa de Google My Maps con ID: 1oaX6mVBIdvh8joU3YTEVH-lS3f0pQmM
  const mapId = '1oaX6mVBIdvh8joU3YTEVH-lS3f0pQmM'

  return (
    <Page>
      <PageHeader>
        <PageTitle>Mapa Jurisdiccional</PageTitle>
        <PageDescription>Ubicación y límites por comisarías</PageDescription>
      </PageHeader>
      <PageBody className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardContent className="p-0 h-96 md:h-[500px]">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, borderRadius: '0.5rem' }}
                src={`https://www.google.com/maps/d/embed?mid=${mapId}`}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Información</h3>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                  <div className="text-sm space-y-1">
                    <p className="font-mono text-primary font-bold text-xs">
                      {mapId}
                    </p>
                    <p className="text-muted-foreground">
                      Mapa Jurisdiccional Policial
                    </p>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="text-xs text-muted-foreground space-y-2">
                <p>✓ Capas personalizadas</p>
                <p>✓ Zoom interactivo</p>
                <p>✓ Búsqueda de ubicaciones</p>
                <p>✓ Vista satelital</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </Page>
  )
}
