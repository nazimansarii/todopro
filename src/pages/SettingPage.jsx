import React, { useContext } from 'react'
import Settings from '../components/Setting'
import { ThemeContext } from '../context/ThemeContext'

export const SettingPage = () => {
    const [isDark] = useContext(ThemeContext)
  return (
    <section className={`w-full h-screen  ${isDark ? 'bg-[#1B1B1B]' : ''}  `}>
     <Settings/>
    </section>
  )
}
