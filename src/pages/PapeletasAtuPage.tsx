import React, { useState } from 'react'
import { Page, PageBody } from '@blinkdotnew/ui'

export function PapeletasAtuPage() {
  const [mostrarConsulta, setMostrarConsulta] = useState(false)

  return (
    <Page>
      <PageBody>
        <div className="w-full px-4">
          {!mostrarConsulta ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8">
              <h1 className="text-5xl font-bold text-blue-600">CONSULTA DE PAPELETAS</h1>
              <p className="text-xl text-gray-600 text-center max-w-2xl">
                Consulta el estado de tus papeletas ATU utilizando el sistema del SAT
              </p>
              <button
                onClick={() => setMostrarConsulta(true)}
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-12 rounded-lg text-xl transition-colors"
              >
                Consultar Papeletas ATU
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setMostrarConsulta(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors mb-4"
              >
                ← Volver
              </button>
              <div className="border-2 border-green-700 rounded-lg overflow-hidden" style={{ height: '800px' }}>
                <iframe
                  src="https://www.sat.gob.pe/VirtualSAT/principal.aspx?mysession=RTepOUXN6KU7s1t0lwn692nSLW%2f0rQCSJlZssxMzVuI%3d"
                  title="SAT - Consultas de Papeletas"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen={true}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </PageBody>
    </Page>
  )
}
