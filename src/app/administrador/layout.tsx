"use client";
import DashboardMenu from "@/components/practicante/DashboardMenu";
import React from "react";

type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {

    return (
        <div>
            <DashboardMenu />
            <main className="w-full min-h-screen flex items-center px-3 sm:px-5 lg:px-6 py-6 mx-auto bg-gray-100 flex-col gap-4">
                {children}
            </main>
        </div>

    );
}