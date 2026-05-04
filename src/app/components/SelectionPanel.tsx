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
    <div className="w-80 border-l border-border bg-white flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-foreground flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded"></div>
          Selection Details
        </h2>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {!hasSelection && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
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
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              No node or edge selected
            </p>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              Click on a node or edge in the graph to view details and actions
            </p>
          </div>
        )}

        {selectedNode && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{
                    backgroundColor:
                      selectedNode.type === 'source'
                        ? '#10b981'
                        : selectedNode.type === 'sink'
                        ? '#ef4444'
                        : '#3b82f6'
                  }}
                >
                  {selectedNode.label}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected Node</p>
                  <p className="font-semibold text-foreground">{selectedNode.label}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-white/60 rounded">
                  <p className="text-xs text-muted-foreground">ID</p>
                  <p className="font-mono">{selectedNode.id}</p>
                </div>
                <div className="p-2 bg-white/60 rounded">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-mono capitalize">{selectedNode.type}</p>
                </div>
              </div>
            </div>

            {!algorithmStarted && (
              <>
                {selectedNode.type === 'normal' ? (
                  <button
                    onClick={() => onDeleteNode(selectedNode.id)}
                    className="w-full px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors flex items-center justify-center gap-2 border-2 border-destructive/30 hover:border-destructive/50"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-medium">Delete Node</span>
                  </button>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 text-center">
                      Source and sink nodes cannot be deleted
                    </p>
                  </div>
                )}
              </>
            )}

            {algorithmStarted && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  Editing locked during algorithm execution
                </p>
              </div>
            )}
          </div>
        )}

        {selectedEdge && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border-2 border-purple-200">
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">Selected Edge</p>
                <p className="font-semibold text-foreground text-lg">
                  {selectedEdge.source} → {selectedEdge.target}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-white/60 rounded">
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-mono">{selectedEdge.source}</p>
                </div>
                <div className="p-2 bg-white/60 rounded">
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-mono">{selectedEdge.target}</p>
                </div>
                <div className="p-2 bg-white/60 rounded">
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="font-mono font-semibold">{selectedEdge.capacity}</p>
                </div>
                <div className="p-2 bg-white/60 rounded">
                  <p className="text-xs text-muted-foreground">Flow</p>
                  <p className="font-mono font-semibold text-blue-600">{selectedEdge.flow}</p>
                </div>
              </div>
            </div>

            {!algorithmStarted && (
              <button
                onClick={() => onDeleteEdge(selectedEdge.id)}
                className="w-full px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors flex items-center justify-center gap-2 border-2 border-destructive/30 hover:border-destructive/50"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete Edge</span>
              </button>
            )}

            {algorithmStarted && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  Editing locked during algorithm execution
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
