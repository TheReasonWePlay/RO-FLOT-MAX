import { Trash2 } from 'lucide-react';

//--------------------------------------------TYPE------------------------------------------------

interface SelectedNode {
  id: string;
  label: string;
  type: 'source' | 'sink' | 'normal';
}

interface SelectedEdge {
  id: string;
  source: string;
  target: string;
  capacity: number;
  flow: number;
}

interface SelectionPanelProps {
  selectedNode: SelectedNode | null;
  selectedEdge: SelectedEdge | null;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  algorithmStarted: boolean;
}

//--------------------------------------------COMPOSANT------------------------------------------------

export function SelectionPanel({
  selectedNode,
  selectedEdge,
  onDeleteNode,
  onDeleteEdge,
  algorithmStarted
}: SelectionPanelProps) {

  //--------------------------------------------STATE------------------------------------------------

  const hasSelection = selectedNode || selectedEdge;

  //--------------------------------------------RENDER------------------------------------------------

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-foreground flex items-center gap-2 font-semibold">
          <div className="w-1 h-6 bg-[#ff5c89] rounded"></div>
          Détails
        </h2>
      </div>

      <div className="flex-1 p-6 overflow-auto">

        {!hasSelection && (
          <div className="flex flex-col items-center justify-center h-full text-center">

            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
                />
              </svg>
            </div>

            <p className="text-sm text-muted-foreground">
              Aucun sommet ou arc sélectionné
            </p>

            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              Cliquez sur un sommet ou un arc pour voir les détails et actions
            </p>

          </div>
        )}

        {selectedNode && (
          <div className="space-y-4">

            <div className="p-4 rounded-lg border border-border bg-muted">
              <div className="flex items-center gap-3 mb-3">

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{
                    backgroundColor:
                      selectedNode.type === "source"
                        ? "#10b981"
                        : selectedNode.type === "sink"
                        ? "#ef4444"
                        : "#ff5c89"
                  }}
                >
                  {selectedNode.label}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Sommet sélectionné
                  </p>
                  <p className="font-semibold text-foreground">
                    {selectedNode.label}
                  </p>
                </div>

              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">

                <div className="p-2 bg-background rounded border border-border">
                  <p className="text-xs text-muted-foreground">ID</p>
                  <p className="font-mono text-foreground">{selectedNode.id}</p>
                </div>

                <div className="p-2 bg-background rounded border border-border">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-mono capitalize text-foreground">
                    {selectedNode.type}
                  </p>
                </div>

              </div>
            </div>
            {!algorithmStarted ? (
              selectedNode.type === "normal" ? (
                <button
                  onClick={() => onDeleteNode(selectedNode.id)}
                  className="w-full px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer le sommet
                </button>
              ) : (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-center text-xs text-amber-700">
                  Les sommets source et puits ne peuvent pas être supprimés.
                </div>
              )
            ) : (
              <div className="p-3 rounded-lg border border-[#ff5c89]/20 bg-[#ffe0e8] text-center text-xs text-[#ff5c89]">
                Modification bloquée pendant l'exécution de l'algorithme.
              </div>
            )}

          </div>
        )}

        {selectedEdge && (
          <div className="space-y-4">

            <div className="p-4 rounded-lg border border-border bg-muted">
              <div className="mb-3">
                <p className="text-xs text-muted-foreground">
                  Arc sélectionné
                </p>
                <p className="font-semibold text-foreground text-lg">
                  {selectedEdge.source} → {selectedEdge.target}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">

                <div className="p-2 bg-background rounded border border-border">
                  <p className="text-xs text-muted-foreground">De</p>
                  <p className="font-mono">{selectedEdge.source}</p>
                </div>

                <div className="p-2 bg-background rounded border border-border">
                  <p className="text-xs text-muted-foreground">À</p>
                  <p className="font-mono">{selectedEdge.target}</p>
                </div>

                <div className="p-2 bg-background rounded border border-border">
                  <p className="text-xs text-muted-foreground">Capacité</p>
                  <p className="font-mono font-semibold">
                    {selectedEdge.capacity}
                  </p>
                </div>

                <div className="p-2 bg-background rounded border border-border">
                  <p className="text-xs text-muted-foreground">Flot</p>
                  <p className="font-mono font-semibold text-[#ff5c89]">
                    {selectedEdge.flow}
                  </p>
                </div>

              </div>
            </div>

            {!algorithmStarted ? (
              <button
                onClick={() => onDeleteEdge(selectedEdge.id)}
                className="w-full px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Supprimer l’arc
              </button>
            ) : (
              <div className="p-3 rounded-lg border border-[#ff5c89]/20 bg-[#ffe0e8] text-center text-xs text-[#ff5c89]">
                Modification bloquée pendant l'exécution de l'algorithme
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
