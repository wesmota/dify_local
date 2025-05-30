'use client'
import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import Button from '@/app/components/base/button'
import ChatWithHistoryWrap from '@/app/components/base/chat/chat-with-history'
import Toast from '@/app/components/base/toast'
import Loading from '@/app/components/base/loading'
import { apiClient } from '@/utils/api'

const LoginForm = ({ onLogin }) => {
  console.log('LoginForm montado - Componente inicializado')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log('LoginForm: Componente montado e pronto')
  }, [])

  const showErrorMessage = useCallback((message: string) => {
    console.log('Erro encontrado:', message)
    Toast.notify({
      type: 'error',
      message,
    })
  }, [])

  const valid = useCallback(() => {
    if (!email.trim()) {
      showErrorMessage('O usuário é obrigatório')
      return false
    }
    if (!password.trim()) {
      showErrorMessage('A senha é obrigatória')
      return false
    }
    return true
  }, [email, password, showErrorMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Tentativa de login iniciada')

    if (!valid())
      return

    setIsLoading(true)
    try {
      const response = await apiClient.login(email, password)

      if (response.ok) {
        console.log('Login realizado com sucesso')
        const data = await response.json()
        localStorage.setItem('lumina-token', data.token)
        onLogin(data.token)
      }
      else {
        console.log('Falha no login: credenciais inválidas')
        const errorData = await response.json()
        showErrorMessage(errorData.message || 'Usuário ou senha inválidos')
      }
    }
    catch (error) {
      console.error('Erro ao fazer login:', error)
      showErrorMessage('Erro ao conectar com o servidor')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-screen h-screen',
        'bg-cover bg-center',
      )}
      style={{
        backgroundImage: 'url(\'/logo/caverna_background.jpeg\')', // Corrigido para a extensão .jpeg
        backgroundColor: '#121212', // Cor de fallback escura
      }}
    >
      {/* Overlay escuro para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contêiner principal */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-4">
        {/* Formulário de login estilizado */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-10 shadow-2xl border border-slate-700/50 max-w-[480px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Acesso ao Sistema</h2>
            <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
          </div>

          <form className="space-y-7">
            {/* Campo de Usuário */}
            <div>
              <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Digite seu usuário"
                  className="w-full pl-12 pr-4 py-3.5 text-white bg-slate-800/90 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label htmlFor="password" className="block text-slate-300 text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-12 pr-4 py-3.5 text-white bg-slate-800/90 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Botão Entrar */}
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-lg transition-all duration-200 font-medium text-sm shadow-lg"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading
                  ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    Autenticando...
                    </>
                  )
                  : (
                    <>
                    Entrar
                    </>
                  )}
              </Button>
            </div>
          </form>

          {/* Rodapé do formulário */}
          <div className="mt-10 pt-6 border-t border-slate-700/30 text-center text-slate-400 text-xs">
            <p>Agente Inteligente de Espeleologia - TR</p>
            <div className="flex justify-center space-x-4 mt-2">
              <span title="Exploração">🧗</span>
              <span title="Caverna">🪨</span>
              <span title="Lanterna">🔦</span>
              <span title="Mapa">🗺️</span>
              <span title="Bússola">🧭</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Chat = () => {
  console.log('Chat: Componente principal inicializado')

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Verificando autenticação...')
      const token = localStorage.getItem('lumina-token')

      if (token) {
        try {
          const response = await apiClient.validateToken(token)
          if (response.ok) {
            console.log('Token válido - Usuário autenticado')
            setIsAuthenticated(true)
          }
          else {
            console.log('Token inválido - Removendo token')
            localStorage.removeItem('lumina-token')
          }
        }
        catch (error) {
          console.error('Erro ao validar token:', error)
          localStorage.removeItem('lumina-token')
        }
      }
      else {
        console.log('Nenhum token encontrado')
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading)
    return <Loading />

  return isAuthenticated
    ? (
      <ChatWithHistoryWrap />
    )
    : (
      <LoginForm onLogin={() => setIsAuthenticated(true)} />
    )
}

export default React.memo(Chat)
