export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/60 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Section */}
        <div className="text-center sm:text-left">
          <p className="text-sm text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} KnowUrIP. Discover Your Digital Identity.
          </p>
        </div>

        {/* Right Section: System Status */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            SECURE ROUTING STATUS: ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
}
