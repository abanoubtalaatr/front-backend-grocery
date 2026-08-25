import { Outlet } from "react-router-dom";

export function MainLayout() {
        return (
        <div className="bg-grocery-50/40 flex min-h-svh w-full flex-col">
            
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}