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
    <div className="w-80 border-r border-border bg-white flex flex-col h-full">
      {algorithmStarted && (
        <div className="p-4 border-b border-border bg-blue-50">
          <button
            onClick={onBackToResolution}
            className="w-full px-4 py-2 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resolution Mode
          </button>
        </div>
      )}

      <div className="p-6 border-b border-border">
        <h2 className="text-foreground mb-4">Graph Controls</h2>

        <div className="space-y-3">
          <button
            onClick={onAddNode}
            disabled={algorithmStarted}
            className="w-full px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Node
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-border">
        <h3 className="mb-4 text-foreground">Add Edge</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Source Node</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white hover:border-ring transition-colors"
            >
              <option value="">Select source</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Target Node</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white hover:border-ring transition-colors"
            >
              <option value="">Select target</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="1"
              className="w-full px-3 py-2 rounded-lg border border-border bg-white hover:border-ring transition-colors"
            />
          </div>

          <button
            onClick={handleAddEdge}
            disabled={!source || !target || !capacity || algorithmStarted}
            className="w-full px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Edge
          </button>
        </div>
      </div>

      <div className="p-6 border-b border-border">
        <h3 className="mb-4 text-foreground">Algorithm Controls</h3>

        {!algorithmStarted ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <input
                type="checkbox"
                id="stepByStep"
                checked={stepByStep}
                onChange={(e) => onStepByStepChange(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-blue-500 cursor-pointer"
              />
              <label htmlFor="stepByStep" className="text-sm cursor-pointer select-none">
                Step-by-step resolution
              </label>
            </div>

            <button
              onClick={onStartAlgorithm}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Zap className="w-5 h-5" />
              Start Algorithm
            </button>
            
          </div>
        ) : stepByStep ? (
          <div className="space-y-3">
            
            <button disabled={canStepForward} onClick={onStartAlgo2} className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {algorithmStarted && isAlgo2 ? "Back to Algorithm 1" : "Start Algorithm 2"}
            </button>
            

            <div className="flex items-center gap-2">
              <button
                onClick={onPreviousStep}
                disabled={!canStepBackward}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={onPlayPause}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all flex items-center justify-center shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={onNextStep}
                disabled={!canStepForward}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Step</span>
                <span className="font-mono text-blue-900">{currentStep} / {totalSteps}</span>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={onStartAlgo2} className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all flex items-center justify-center gap-2 shadow-md transition-colors">
            {algorithmStarted && isAlgo2 ? "Back to Algorithm 1" : "Start Algorithm 2"}
            </button>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm text-green-700">Algorithm 1 completed!</p>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
