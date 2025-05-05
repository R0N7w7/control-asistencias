"use client"
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar1Icon, HistoryIcon, HomeIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const enlaces = [
    {
        title: 'Inicio',
        icon: <HomeIcon />,
        href: '/practicante/',
    },
    {
        title: 'Calendario',
        icon: <Calendar1Icon />,
        href: '/practicante/calendario',
    },
    {
        title: 'Historial',
        icon: <HistoryIcon />,
        href: '/practicante/historial',
    },
];

const DashboardMenu = () => {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    const client = createClient();

    const handleClick = (href: string) => {
        setOpen(false);
        router.push(href);
    }

    return (
        <header className="h-16 flex gap-4 items-center justify-between w-full">
            <Sheet open={open} onOpenChange={() => setOpen(!open)}>
                <SheetTrigger>
                    <div className='px-4'>
                        <MenuIcon size={24} />
                    </div>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>Practicante</SheetTitle>
                        <SheetDescription>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae illo dignissimos quasi quis culpa excepturi quaerat aspernatur quidem eveniet et, id adipisci veritatis temporibus ipsam dolorem eaque molestias accusantium cupiditate.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="h-full flex flex-col px-4">
                        {enlaces.map((enlace, index) => (
                            <div onClick={() => handleClick(enlace.href)} key={index} className='flex gap-4 w-full border-b py-6 items-center'>
                                {enlace.icon}
                                <p className='text-xl font-semibold'>{enlace.title}</p>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
            <p className='w-full font-semibold text-xl ml-2'>Servicio Social</p>
            <div className='px-4' onClick={() => client.auth.signOut()}>
                <LogOutIcon size={24} />
            </div>
        </header>
    )
}

export default DashboardMenu