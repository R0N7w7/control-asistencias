// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import DashboardMenu from '@/components/administrador/DashboardMenu';

type Props = {
    children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
    const supabase = await createClient();

    const {
        data: { user },
        error: sessionError,
    } = await supabase.auth.getUser()

    if (!user || sessionError) {
        return redirect('/login');
    }

    const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('rol')
        .eq('id', user.id)
        .single();

    if (error || profile?.rol !== 'admin') {
        return redirect('/login');
    }

    return (
        <div>
            <DashboardMenu />
            <main className="w-full min-h-screen flex items-center px-3 sm:px-5 lg:px-6 py-6 mx-auto bg-gray-100 flex-col gap-4">
                {children}
            </main>
        </div>
    );
}