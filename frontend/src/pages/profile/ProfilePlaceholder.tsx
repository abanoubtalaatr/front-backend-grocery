import { Outlet } from "react-router-dom";

type Props = {
  title: string;
  description: string;
};

export function ProfilePlaceholder({ title, description }: Props) {
  return (
    <>
    <div className="flex">
      <div>
        <h1 className="text-grocery-900 text-2xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-grocery-600 mt-2 max-w-lg text-sm leading-relaxed">
          {description}
        </p>
        
      </div>
      <div>
        <Outlet />
      </div>
      
    </div>
    <hr className="my-4" />
    </>
  );
}
