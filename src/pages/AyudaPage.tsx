import React from 'react'
import { Page, PageHeader, PageTitle, PageDescription, PageBody, EmptyState } from '@blinkdotnew/ui'
import { HelpCircle } from 'lucide-react'

export function AyudaPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Centro de Ayuda</PageTitle>
        <PageDescription>Soporte técnico y guía de uso</PageDescription>
      </PageHeader>
      <PageBody>
        <EmptyState 
          icon={<HelpCircle />} 
          title="¿Necesitas ayuda?" 
          description="Contáctanos vía WhatsApp para soporte inmediato sobre el uso del simulador." 
          action={{ label: 'Contactar Soporte', onClick: () => window.open('https://wa.me/51999999999', '_blank') }}
        />
      </PageBody>
    </Page>
  )
}
