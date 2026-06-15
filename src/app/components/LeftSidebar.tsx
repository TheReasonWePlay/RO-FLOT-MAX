import { Plus, ChevronLeft, ChevronRight, Play, Pause, Zap, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

//--------------------------------------------TYPE------------------------------------------------
interface LeftSidebarProps {
  onAddNode: () => void;
  onAddEdge: (source: string, target: string, capacity: number) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onPlayPause: () => void;
  onStartAlgorithm: () => void;
  onBackToResolution: () => void;
  onStartAlgo2?: () => void;
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  currentStep: number;
  totalSteps: number;
  nodes: Array<{ id: string; label: string }>;
  algorithmStarted: boolean;
  stepByStep: boolean;
  isAlgo2: boolean;
  onStepByStepChange: (checked: boolean) => void;
}

//--------------------------------------------COMPOSANT------------------------------------------------

export function LeftSidebar({
  onAddNode,
  onAddEdge,
  onNextStep,
  onPreviousStep,
  onPlayPause,
  onStartAlgorithm,
  onBackToResolution,
  isPlaying,
  canStepForward,
  canStepBackward,
  currentStep,
  totalSteps,
  nodes,
  algorithmStarted,
  stepByStep,
  onStepByStepChange,
  onStartAlgo2,
  isAlgo2
}: LeftSidebarProps) {

  //--------------------------------------------STATE------------------------------------------------

  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [capacity, setCapacity] = useState('10');

  //--------------------------------------------COMPORTEMENT------------------------------------------------

  const handleAddEdge = () => {
    if (source && target && capacity) {
      onAddEdge(source, target, parseInt(capacity));
      setSource('');
      setTarget('');
      setCapacity('10');
    }
  };

  //--------------------------------------------RENDER------------------------------------------------

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col h-full">
      {algorithmStarted && (
        <div className="p-4 border-b border-border bg-muted">
          <button
            onClick={onBackToResolution}
            className="w-full px-4 py-2 rounded-lg bg-background border border-border hover:bg-muted text-foreground transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au mode résolution
          </button>
        </div>
      )}

      <div className="p-6 border-b border-border">
        <h2 className="text-foreground mb-4 font-semibold">
          Contrôles
        </h2>

        <button
          onClick={onAddNode}
          disabled={algorithmStarted}
          className="w-full px-4 py-2.5 rounded-lg bg-[#ff5c89] hover:bg-[#ff3d73] text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Ajouter un sommet
        </button>
      </div>

      <div className="p-6 border-b border-border">
        <h3 className="mb-4 text-foreground font-semibold">
          Ajouter un arc
        </h3>

        <div className="space-y-3">

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Sommet source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background hover:border-[#ff5c89] transition"
            >
              <option value="">Sélectionner la source</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Sommet destination
            </label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background hover:border-[#ff5c89] transition"
            >
              <option value="">Sélectionner la destination</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Capacité
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="1"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background hover:border-[#ff5c89] transition"
            />
          </div>

          <button
            onClick={handleAddEdge}
            disabled={!source || !target || !capacity || algorithmStarted}
            className="w-full px-4 py-2 rounded-lg bg-muted hover:bg-accent text-foreground transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Ajouter un arc
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-border">
        <h3 className="mb-4 text-foreground font-semibold">
          Contrôle de l’algorithme
        </h3>

        {!algorithmStarted ? (
          <div className="space-y-4">

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
              <input
                type="checkbox"
                id="stepByStep"
                checked={stepByStep}
                onChange={(e) => onStepByStepChange(e.target.checked)}
                className="w-4 h-4 accent-[#ff5c89] cursor-pointer"
              />
              <label
                htmlFor="stepByStep"
                className="text-sm cursor-pointer select-none"
              >
                Résolution pas à pas
              </label>
            </div>

            <button
              onClick={onStartAlgorithm}
              className="w-full px-4 py-3 rounded-lg bg-[#ff5c89] hover:bg-[#ff3d73] text-white transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap className="w-5 h-5" />
              Calculer le flot complet
            </button>
          </div>
        ) : stepByStep ? (
          <div className="space-y-3">

            <button
              disabled={canStepForward}
              onClick={onStartAlgo2}
              className="w-full px-4 py-3 rounded-lg bg-[#ff5c89] hover:bg-[#ff3d73] text-white transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {algorithmStarted && isAlgo2
                ? "Retour au flot complet"
                : "Calculer le flot maximal"}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onPreviousStep}
                disabled={!canStepBackward}
                className="flex-1 px-2.5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              <button
                onClick={onPlayPause}
                className="px-2.5 py-2.5 rounded-lg bg-[#ff5c89] hover:bg-[#ff3d73] text-white transition flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onNextStep}
                disabled={!canStepForward}
                className="flex-1 px-2.5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-lg border border-[#ff5c89]/20 bg-[#ffe0e8] text-center">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#ff5c89]">
                  Étape
                </span>
                <span className="font-mono text-[#ff5c89]">
                  {currentStep} / {totalSteps}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={onStartAlgo2}
              className="w-full px-4 py-3 rounded-lg bg-[#ff5c89] hover:bg-[#ff3d73] text-white transition flex items-center justify-center gap-2"
            >
              {algorithmStarted && isAlgo2
                ? "Retour au flot complet"
                : "Calculer le flot maximal"}
            </button>
            <div className="p-4 bg-muted border border-border rounded-lg text-center">
              <p className="text-sm text-foreground">
                {algorithmStarted && isAlgo2
                  ? "Flot maximal terminé !"
                  : "Flot complet calculé !"}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
