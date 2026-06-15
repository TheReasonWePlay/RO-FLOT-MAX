import { RotateCcw, Waypoints, FileClock } from 'lucide-react';

//--------------------------------------------TYPE------------------------------------------------

interface NavbarProps {
  onReset: () => void;
  onExample?: () => void;
}

//--------------------------------------------COMPOSANT------------------------------------------------

export function Navbar({ onReset, onExample }: NavbarProps) {
  return (
    <nav className="h-16 border-b border-border bg-background px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5c89] to-[#ff3d73] flex items-center justify-center">
          <Waypoints className="w-5 h-5 text-white" />
        </div>

        <h1 className="text-foreground font-semibold">FlotMax</h1>

        <span className="text-sm text-muted-foreground ml-2">
          Recherche Opération étape par étape de Flot maximal
        </span>
      </div>

      <div className="flex items-center gap-2">
        
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-border bg-transparent hover:bg-red-500/10 text-[#ff3d73] transition flex items-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>

        <button
          onClick={onExample}
          className="px-4 py-2 rounded-lg bg-[#ff5c89] hover:bg-[#ff3d73] text-white transition flex items-center gap-2 text-sm"
        >
          <FileClock className="w-4 h-4" />
          Exemple
        </button>

      </div>
    </nav>
  );
}
