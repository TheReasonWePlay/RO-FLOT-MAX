import { RotateCcw } from 'lucide-react';

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
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-foreground">FlowGraph</h1>
        <span className="text-sm text-muted-foreground ml-2">Max Flow Step-by-Step Visualizer</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Graph
        </button>
        <button
          onClick={onExample}
          className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Example
        </button>
      </div>
    </nav>
  );
}
