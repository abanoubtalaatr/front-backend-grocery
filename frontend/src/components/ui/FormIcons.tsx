import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

const icon = "h-5 w-5 shrink-0 stroke-current" as const;

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={icon}
      fill="none"
      strokeWidth={1.5}
      aria-hidden
      {...props}
    >
      <path
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 20.25a7.5 7.5 0 0 1 15 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EnvelopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={icon}
      fill="none"
      strokeWidth={1.5}
      aria-hidden
      {...props}
    >
      <path
        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0-8.1 5.1a1.5 1.5 0 0 1-1.2 0l-8.1-5.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={icon}
      fill="none"
      strokeWidth={1.5}
      aria-hidden
      {...props}
    >
      <path
        d="M16.5 10.5V6.75A4.5 4.5 0 0 0 12 2.25a4.5 4.5 0 0 0-4.5 4.5V10.5M12 12.75v1.5m-7.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5V21a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1.5 21v-5.25a1.5 1.5 0 0 1 1.5-1.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={icon}
      fill="none"
      strokeWidth={1.5}
      aria-hidden
      {...props}
    >
      <path
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Padded viewBox: art runs 0..24; edge-locked paths otherwise clip vs Google’s inset paths.
export function FacebookIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="-0.5 -0.5 25 25"
      className={cn("h-5 w-5 shrink-0 overflow-visible", className)}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      {...props}
    >
      <path
        d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24V15.55H7.08V12.07h3.05V9.42c0-3.02 1.79-4.7 4.54-4.7 1.32 0 2.7.24 2.7.24v2.97H15.1c-1.49 0-1.95.93-1.95 1.88v2.25h3.32l-.53 3.48H13.1V24C18.9 23.1 24 18.1 24 12.07Z"
        fill="#1877F2"
      />
    </svg>
  );
}

export function GoogleIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path
        d="M22.56 12.25a11.9 11.9 0 0 0-.1-1.2H12v2.2h5.9a2.6 2.6 0 0 1-1.1 1.7v1.4h1.8c1-1 1.6-2.4 1.6-4.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.6 0 4.7-.8 6.2-2.1l-1.8-1.4C15.3 18.8 14 19.1 12 19.1c-2.5 0-4.5-1.4-5.2-3.1H4.5v1.3C5.3 20.1 8.2 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.8 12.1a5.5 5.5 0 0 0 0-3.5H4.3v1.1a6.6 6.6 0 0 0 0 5.1l2.3-1.1Z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.2c1.2 0 2.1.2 2.6.6L16.1 2C14.2.7 12 0 12c-3.8 0-6.7 2-8.1 4.1l2.2 1.1a6.1 6.1 0 0 1 1.1-1.1Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
      {...props}
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function HomeIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path d="M12 19.5v-15m0 0l-6 6m6-6l6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-[18px] w-[18px] shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M8 6v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
export function PencilIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-[18px] w-[18px] shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path d="M16.862 5.487a2.25 2.25 0 0 1 3.182 3.183l-9.347 9.348a2 2 0 0 1-.737.465l-4.03 1.343a.5.5 0 0 1-.635-.636l1.344-4.03a2 2 0 0 1 .464-.737l9.347-9.347Zm2.121 2.122L16.39 4.915a.75.75 0 0 0-1.06 1.058l2.595 2.595a.75.75 0 1 0 1.058-1.06Z" />
    </svg>
  );
}


// i want icon for car cart
export function CarIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={cn("size-6", className)} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

// icon for favorite
export function FavoriteIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={cn("size-6", className)} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

// icon for kings crown
// King Crown Icon
export function KingsCrownIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("size-6", className)}
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 17l3.6-8 5.4 6 5.4-6 3.6 8M4 21h16M12 9.5V4m0 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm6 5.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-12 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
      />
    </svg>
  );
}


//i want icon for star
export function StarIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (  
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={cn("size-6", className)} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.924 20.584a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  );
}


///i wnat icon for  chat 
export function ChatIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={cn("size-6", className)} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75c0 1.035.84 1.875 1.875 1.875h15a1.875 1.875 0 0 0 1.875-1.875V12a9 9 0 0 0-9-9 1.875 1.875 0 0 0-1.875 1.875v6.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}