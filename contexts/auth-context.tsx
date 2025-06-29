"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  name: string
  phone?: string
  birth_date?: string
  gender?: string
  role: 'user' | 'admin' | 'manager'
  avatar_url?: string
  marketing_agreed: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    // 초기 사용자 상태 확인
    const getInitialUser = async () => {
      console.log('🚀 AuthProvider 초기화 시작')
      
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 현재 사용자:', user)
      
      setUser(user)
      
      if (user) {
        console.log('📞 프로필 조회 호출:', user.id)
        await fetchProfile(user.id)
      } else {
        console.log('❌ 로그인된 사용자 없음')
      }
      
      setLoading(false)
    }

    getInitialUser()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 프로필 조회 시작:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('📊 Supabase 응답:', { data, error })

      if (error) {
        console.error('❌ 프로필 조회 실패 (Supabase 오류):', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // 프로필이 존재하지 않는 경우 (새 사용자)
        if (error.code === 'PGRST116') {
          console.log('🆕 새 사용자 감지 - 프로필 생성 필요')
          await createProfile(userId)
          return
        }
        
        return
      }

      console.log('✅ 프로필 조회 성공:', data)
      setProfile(data)
    } catch (error) {
      console.error('❌ 프로필 조회 실패 (일반 오류):', error)
    }
  }

  const createProfile = async (userId: string) => {
    try {
      console.log('🔨 새 프로필 생성 시작:', userId)
      
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      
      if (!user) return

      const newProfile = {
        id: userId,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
        role: 'user' as const,
        marketing_agreed: false
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()

      if (error) {
        console.error('❌ 프로필 생성 실패:', error)
        return
      }

      console.log('✅ 프로필 생성 성공:', data)
      setProfile(data)
    } catch (error) {
      console.error('❌ 프로필 생성 중 오류:', error)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    
    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      throw error
    }

    // 로컬 상태 업데이트
    setProfile(prev => prev ? { ...prev, ...updates } : null)
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 