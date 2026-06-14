import { RotateCcw, GitCompare } from 'lucide-react';

//--------------------------------------------TYPE------------------------------------------------

interface NavbarProps {
  onReset: () => void;
  onExample?: () => void;
}

//--------------------------------------------COMPOSANT------------------------------------------------

export function Navbar({ onReset, onExample }: NavbarProps) {
  return (
    <nav className="h-16 border-b border-border bg-white px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <GitCompare className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-foreground">FlotMax</h1>
        <span className="text-sm text-muted-foreground ml-2">Recherche Opération étape par étape de Flot maximal</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
        <button
          onClick={onExample}
          className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Exemple
        </button>
      </div>
    </nav>
  );
}
