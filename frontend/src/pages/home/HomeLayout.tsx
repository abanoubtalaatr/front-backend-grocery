import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Outlet } from "react-router-dom";

export function HomeLayout() { 
    return (
        <div className="bg-grocery-50/40 flex min-h-svh w-full flex-col">
            <SiteHeader />
            <main className="flex-1 container mx-auto p-4">
       
                <Outlet />
            </main>
            <SiteFooter />
        </div>
    );
}