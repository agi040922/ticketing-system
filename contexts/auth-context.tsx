"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase'

// User 타입 정의 (users 테이블 구조에 맞게)
interface UserData {
  id: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'manager' | 'user'
  marketing_agreed: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string, phone?: string, marketingAgreed?: boolean) => Promise<void>
  signOut: () => Promise<void>
  updateUserData: (updates: Partial<UserData>) => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  // users 테이블에서 사용자 데이터 조회
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      console.log('사용자 데이터 조회 시작:', userId)
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('사용자 데이터 조회 실패:', error)
        return null
      }

      console.log('사용자 데이터 조회 성공:', data)
      return data as UserData
    } catch (error) {
      console.error('사용자 데이터 조회 오류:', error)
      return null
    }
  }

  // users 테이블에 직접 사용자 생성
  const createUserData = async (user: User, name?: string): Promise<UserData | null> => {
    try {
      console.log('사용자 데이터 생성 시작:', user.id, user.email)
      
      const newUserData = {
        id: user.id,
        email: user.email!,
        name: name || user.user_metadata?.name || user.email!.split('@')[0],
        phone: user.user_metadata?.phone || null,
        role: 'user' as const,
        marketing_agreed: false
      }

      const { data, error } = await supabase
        .from('users')
        .insert([newUserData])
        .select()
        .single()

      if (error) {
        console.error('사용자 데이터 생성 실패:', error)
        return null
      }

      console.log('사용자 데이터 생성 성공:', data)
      return data as UserData
    } catch (error) {
      console.error('사용자 데이터 생성 오류:', error)
      return null
    }
  }

  // 사용자 데이터 업데이트
  const updateUserData = async (updates: Partial<UserData>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setUserData(data as UserData)
    } catch (error) {
      console.error('사용자 데이터 업데이트 실패:', error)
      throw error
    }
  }

  // 사용자 데이터 새로고침
  const refreshUserData = async () => {
    if (!user) return
    
    const data = await fetchUserData(user.id)
    setUserData(data)
  }



  // 이메일 로그인
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
  }

  // 이메일 회원가입 (users 테이블에 직접 생성)
  const signUpWithEmail = async (email: string, password: string, name: string, phone?: string, marketingAgreed: boolean = false) => {
    // 1. Supabase Auth에 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone: phone
        }
      }
    })
    
    if (error) throw error
    
    // 2. 회원가입 성공 시 users 테이블에 직접 데이터 생성
    if (data.user) {
      try {
        console.log('회원가입 후 users 테이블에 데이터 생성 시작:', data.user.id)
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email!,
            name: name,
            phone: phone || null,
            role: 'user',
            marketing_agreed: marketingAgreed
          }])
        
        if (insertError) {
          console.error('Users 테이블 저장 실패:', insertError)
          throw insertError
        } else {
          console.log('Users 테이블 저장 성공')
        }
      } catch (insertError) {
        console.error('Users 테이블 저장 오류:', insertError)
        throw insertError
      }
    }
  }

  // 로그아웃
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // 인증 상태 변경 감지
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth 상태 변경:', event, session?.user?.id)
      
      if (session?.user) {
        setUser(session.user)
        
        // users 테이블에서 데이터 조회
        let userData = await fetchUserData(session.user.id)
        
        // 데이터가 없으면 생성 (로그인 시 자동 생성)
        if (!userData) {
          console.log('사용자 데이터가 없어서 생성합니다')
          userData = await createUserData(session.user)
        }
        
        setUserData(userData)
      } else {
        setUser(null)
        setUserData(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    userData,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateUserData,
    refreshUserData
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 