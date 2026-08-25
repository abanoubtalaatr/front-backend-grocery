/** Ambient motion for /chat ad layout — decorative only. */
export function ChatAdBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#0d1114_0%,#003b5c_45%,#0a2e3d_100%)]" />
      <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] bg-size-[28px_28px]" />
      <div className="absolute -left-24 top-[8%] h-72 w-72 animate-float rounded-full bg-emerald-500/25 blur-[90px]" />
      <div
        className="absolute -right-16 top-[35%] h-80 w-80 animate-float rounded-full bg-cyan-400/20 blur-[100px]"
        style={{ animationDelay: '-2s' }}
      />
      <div
        className="absolute bottom-[5%] left-[30%] h-64 w-64 animate-float rounded-full bg-violet-500/15 blur-[80px]"
        style={{ animationDelay: '-4s' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(52,211,153,0.18),transparent_55%)]" />
    </div>
  )
}
