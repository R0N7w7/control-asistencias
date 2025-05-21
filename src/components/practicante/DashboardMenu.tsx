"use client"
import React, { useState, useCallback, JSX } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import {
  Calendar1Icon,
  HistoryIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ConfirmDialog } from '../ui/confirmDialog'
import Image from 'next/image'

const enlaces = [
  { title: 'Inicio', icon: <HomeIcon />, href: '/practicante/' },
  { title: 'Calendario', icon: <Calendar1Icon />, href: '/practicante/calendario' },
  { title: 'Historial', icon: <HistoryIcon />, href: '/practicante/historial' },
]
const NavItem = ({ title, icon, onClick }: { title: string, icon: JSX.Element, href: string, onClick: () => void }) => (
  <div
    onClick={onClick}
    className='flex gap-4 w-full items-center cursor-pointer py-6 md:py-0 border-b md:border-none text-black/75 hover:text-black'
  >
    {icon}
    <p className='text-xl font-semibold'>{title}</p>
  </div>
)

const DashboardMenu = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const client = createClient()

  const handleClick = useCallback((href: string) => {
    setOpen(false)
    router.push(href)
  }, [router])

  const handleSignOut = () => {
    client.auth.signOut();
    router.push('/')
  }

  return (
    <>
      {/* Mobile */}
      <header className="h-16 flex gap-4 items-center justify-between w-full md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <div className='px-4'>
              <MenuIcon size={24} />
            </div>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Administrador</SheetTitle>
              <SheetDescription>
                Navegación del sistema
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col px-4">
              {enlaces.map(({ title, icon, href }) => (
                <NavItem
                  key={href}
                  title={title}
                  icon={icon}
                  href={href}
                  onClick={() => handleClick(href)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="w-full flex items-center justify-center ">
          <Image src={'/logo.png'} width={400} height={120} alt="logo" className="h-14 w-auto " />
        </div>
        <ConfirmDialog
          title="¿Cerrar la sesión?"
          description="la sesión se cerrará, serás redirigido al inicio de sesión"
          confirmText="Salir"
          onConfirm={handleSignOut}
          cancelText="Quedarme"
        >
          <div className='px-4' >
            <LogOutIcon size={24} />
          </div>
        </ConfirmDialog>

      </header>

      {/* Desktop */}
      <header className='hidden md:grid grid-cols-[1fr_auto_1fr] h-16 gap-4 items-center w-full'>
        <div className="w-full flex items-center ml-4">
          <Image src={'/logo.png'} width={400} height={120} alt="logo" className="h-14 w-auto "/>
        </div>
        <div className="flex h-full px-4 items-center justify-center gap-4 lg:gap-8">
          {enlaces.map(({ title, icon, href }) => (
            <NavItem
              key={href}
              title={title}
              icon={icon}
              href={href}
              onClick={() => handleClick(href)}
            />
          ))}
        </div>
        <ConfirmDialog
          title="¿Cerrar la sesión?"
          description="La sesión se cerrará, serás redirigido al inicio de sesión"
          confirmText="Salir"
          onConfirm={handleSignOut}
          cancelText="Quedarme"
        >
          <div className='px-4 flex items-center justify-end text-black hover:text-black/75 cursor-pointer' >
            <LogOutIcon size={24} />
          </div>
        </ConfirmDialog>
      </header>
    </>
  )
}

export default DashboardMenu
