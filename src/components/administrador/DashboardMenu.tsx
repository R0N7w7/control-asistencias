"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { createClient } from '@/lib/supabase/client'
import {
  ChartPieIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  Users2Icon
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { JSX, useCallback, useState } from 'react'
import { ConfirmDialog } from "../ui/confirmDialog"

const enlaces = [
  { title: 'Inicio', icon: <HomeIcon />, href: '/administrador/' },
  { title: 'Practicantes', icon: <Users2Icon />, href: '/administrador/practicantes' },
  { title: 'Reportes', icon: <ChartPieIcon />, href: '/administrador/reportes' },
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
        <p className='w-full font-semibold text-xl ml-2'>Servicio Social</p>
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
        <p className='w-full font-semibold text-xl ml-2 flex items-center h-full'>Servicio Social</p>
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
