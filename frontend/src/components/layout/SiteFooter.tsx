import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GroceryWordmark } from '@/components/brand/GroceryWordmark'
import { EnvelopeIcon } from '@/components/ui/FormIcons'
import { paths } from '@/constants/paths'
import { cn } from '@/lib/cn'

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden
    >
      <path
        d="M12 13.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 9.75c0 6-7.5 11.25-7.5 11.25S4.5 15.75 4.5 9.75a7.5 7.5 0 1 1 15 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="text-grocery-900 hover:bg-grocery-100 inline-flex h-9 w-9 items-center justify-center rounded-full transition"
    >
      {children}
    </a>
  )
}

function InstagramSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.25" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M6.94 8.5a1.61 1.61 0 1 1 0-3.22 1.61 1.61 0 0 1 0 3.22ZM5.5 9.75h2.88V18H5.5V9.75Zm4.64 0h2.76v1.13h.04c.39-.73 1.34-1.5 2.76-1.5 2.95 0 3.5 1.94 3.5 4.46V18h-2.88v-3.67c0-.87-.02-2-.12-2.54-.2-1.06-.74-1.2-1.24-1.2-1 0-1.94.68-1.94 2.52V18h-2.88V9.75Z" />
    </svg>
  )
}

function FacebookSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M14 8h2V5h-2.4C11.6 5 10 6.6 10 8.6V11H8v3h2v5h3v-5h2.3l.5-3H13V9c0-.6.4-1 1-1Z" />
    </svg>
  )
}

const footerLinkClass = 'text-grocery-600 hover:text-grocery-900 text-sm transition'

export function SiteFooter() {
  return (
    <footer className="bg-grocery-50/40 border-grocery-100 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <section>
          <Link to={paths.home} className="inline-flex">
            <GroceryWordmark className="text-4xl" />
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <SocialIcon label="Instagram" href="https://instagram.com">
              <InstagramSvg />
            </SocialIcon>
            <SocialIcon label="LinkedIn" href="https://linkedin.com">
              <LinkedInSvg />
            </SocialIcon>
            <SocialIcon label="Facebook" href="https://facebook.com">
              <FacebookSvg />
            </SocialIcon>
          </div>
          <p className="text-grocery-600 mt-4 max-w-sm text-sm leading-6">
            Grocery platform offering fresh produce, daily essentials, with secure payments and
            real-time tracking.
          </p>
          <p className="text-grocery-900 mt-5 flex items-start gap-2 text-sm">
            <MapPinIcon className="mt-0.5 text-grocery-700" />
            <span>5th Settlement, New Cairo, Cairo, Egypt</span>
          </p>
          <p className="text-grocery-900 mt-3 flex items-center gap-2 text-sm">
            <EnvelopeIcon className="h-5 w-5 text-grocery-700" />
            <span>help@groceryplus.com</span>
          </p>
        </section>

        <nav aria-label="Support">
          <h3 className="text-grocery-900 text-2xl font-semibold">Support</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a className={footerLinkClass} href="#">
                FAQ
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href="#">
                Contact Us
              </a>
            </li>
            <li>
              <Link className={footerLinkClass} to={paths.chat}>
                Chat
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Services">
          <h3 className="text-grocery-900 text-2xl font-semibold">Services</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a className={footerLinkClass} href="#">
                Order tracking
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href="#">
                Smart List
              </a>
            </li>
            <li>
              <Link className={footerLinkClass} to={paths.signUp}>
                Sign up
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Terms and policies">
          <h3 className="text-grocery-900 text-2xl font-semibold">Terms and Policies</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a className={footerLinkClass} href="#">
                About Us
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href="#">
                Terms Of Use
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href="#">
                Return Policy
              </a>
            </li>
            <li>
              <a className={footerLinkClass} href="#">
                Cookies Policy
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="bg-grocery-900 px-4 py-3">
        <p className="text-center text-sm text-white">
          © 2025 GroceryPlus - Smart Grocery, Delivered Fast. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
