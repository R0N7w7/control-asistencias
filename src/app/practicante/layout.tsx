
import DashboardMenu from "@/components/practicante/DashboardMenu";
import React from "react"

type Props = {
    children: React.ReactNode;
}

export default function layout({ children }: Props) {
    return (
        <div>
            <DashboardMenu />
            {children}
        </div>
    )
};