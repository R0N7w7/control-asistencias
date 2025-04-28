import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Calendar1Icon, HistoryIcon, HomeIcon, LogOutIcon, MenuIcon, SheetIcon } from "lucide-react";

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
    {
        title: 'Reportes',
        icon: <SheetIcon />,
        href: '/practicante/reportes',
    },
];

const DashboardMenu = () => {
    return (
        <header className="h-16 flex gap-4 items-center justify-between w-full">
            <Sheet>
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
                            <div key={index} className='flex gap-4 w-full border-b py-6 items-center'>
                                {enlace.icon}
                                <p className='text-xl font-semibold'>{enlace.title}</p>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
            <p className='w-full font-semibold text-xl ml-2'>Servicio Social</p>
            <div className='px-4'>
                <LogOutIcon size={24} />
            </div>
        </header>
    )
}

export default DashboardMenu