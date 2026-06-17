import React, { useState, useRef, useEffect } from 'react'
import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody, 
  Card, 
  CardContent,
  Input,
  Button,
  Avatar,
  Badge,
  toast
} from '@blinkdotnew/ui'
import { Send, Bot, User as UserIcon, GraduationCap, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function IAPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '¡Hola! Soy tu asistente de estudio de la PNP. Puedo ayudarte a resolver dudas sobre leyes, reglamentos, tácticas policiales y prepararte para tu examen de ascenso. ¿En qué puedo ayudarte hoy?' 
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    try {
      const SYSTEM_PROMPT = `Eres un asistente experto en preparación para exámenes de ascenso de la Policía Nacional del Perú (PNP). 
      Tu conocimiento incluye la Ley 30714 (Régimen Disciplinario), el Reglamento Nacional de Tránsito, la Constitución Política del Perú, 
      Derechos Humanos aplicados a la función policial, y procedimientos operativos policiales.
      Responde de manera profesional, disciplinada y educativa. 
      Siempre cita artículos o leyes específicas cuando sea posible.`

      const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY

      if (!apiKey) {
        throw new Error('API key no configurada')
      }

      // Llamada directa a Gemini API
      const geminiMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
      geminiMessages.push({ role: 'user', parts: [{ text: userMessage }] })

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: geminiMessages
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error?.message || 'Error en la API')
      }

      const data = await response.json()
      const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta'

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
    } catch (error) {
      console.error('Error generating AI response:', error)
      toast.error('Error al conectar con la IA: ' + (error instanceof Error ? error.message : 'Error desconocido'))
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta de nuevo.' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Page>
      <PageHeader>
        <div className="flex flex-col gap-1">
          <Badge variant="secondary" className="w-fit gap-1">
            <Sparkles size={12} className="text-accent" />
            BETA AI
          </Badge>
          <PageTitle className="font-serif">Asistente de Estudio IA</PageTitle>
          <PageDescription>Consulta dudas legales y procedimientos en tiempo real</PageDescription>
        </div>
      </PageHeader>
      
      <PageBody className="max-w-4xl mx-auto h-[calc(100vh-250px)] flex flex-col gap-4">
        <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-lg">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center shrink-0
                  ${message.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-white'}
                `}>
                  {message.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                </div>
                <div className={`
                  max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                  ${message.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-secondary text-foreground rounded-tl-none border'
                  }
                `}>
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div className="bg-secondary p-4 rounded-2xl rounded-tl-none border flex gap-1">
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2">
              <Input 
                placeholder="Pregunta sobre un artículo, ley o procedimiento..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isTyping}>
                <Send size={18} />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              La IA puede cometer errores. Verifica siempre con las leyes vigentes.
            </p>
          </div>
        </Card>
      </PageBody>
    </Page>
  )
}
