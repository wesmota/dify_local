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
        backgroundImage: 'url(\'/logo/fundo_agente_2.png\')', // Caminho da nova imagem de fundo
      }}
    >
      {/* Contêiner do formulário */}
      <div
        className={cn(
          'relative flex items-center justify-center w-screen h-screen',
          'bg-cover bg-center',
        )}
        style={{
          backgroundImage: 'url(\'/logo/fundo_agente_2.png\')', // Caminho da nova imagem de fundo
        }}
      >
        {/* Contêiner do formulário */}
        <div className="absolute w-full h-full flex flex-col items-center justify-center">
          <form className="relative w-full max-w-[1000px] h-[300px] flex justify-between items-center">
            {/* Campo de Usuário */}
            <div className="absolute left-[-3%] top-[69%] w-[44%]">
              <label htmlFor="email" className="block text-white text-md font-medium mb-1">
                Usuário
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full px-4 py-2 text-white placeholder-white rounded bg-transparent border-none focus:outline-none"
                disabled={isLoading}
              />
            </div>

            {/* Campo de Senha */}
            <div className="absolute right-[-2%] top-[69%] w-[44%]">
              <label htmlFor="password" className="block text-white text-md font-medium mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-2 text-white placeholder-white rounded bg-transparent border-none focus:outline-none"
                disabled={isLoading}
              />
            </div>

            {/* Botão Entrar */}
            <div className="absolute bottom-[-10%] left-[50%] -translate-x-1/2 w-[20%]">
              <Button
                type="button"
                variant="primary"
                className="w-full bg-white/80 text-blue-900 py-2 rounded hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
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
