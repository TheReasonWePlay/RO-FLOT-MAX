interface RightPanelProps {
  nodeCount: number;
  edgeCount: number;
  maxFlow: number | null;
  selectedNode: { id: string; label: string; type: string } | null;
  selectedEdge: { source: string; target: string; capacity: number; flow: number } | null;
}

export function RightPanel({ nodeCount, edgeCount, maxFlow, selectedNode, selectedEdge }: RightPanelProps) {
  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full overflow-auto">
      <div className="p-6 border-b border-border">
        <h2 className="text-foreground mb-4 font-semibold">
          Information du graphique
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
            <span className="text-sm text-muted-foreground">Sommets</span>
            <span className="font-mono text-foreground">{nodeCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
            <span className="text-sm text-muted-foreground">Arcs</span>
            <span className="font-mono text-foreground">{edgeCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-[#ff5c89]/20 bg-gradient-to-r from-[#ffe0e8] to-[#fff1f4]">
            <span className="text-sm text-[#ff5c89] font-medium">
              Flot maximal
            </span>
            <span className="font-mono text-[#ff5c89] font-semibold">
              {maxFlow !== null ? maxFlow : '-'}
            </span>
          </div>

        </div>
      </div>

      {selectedNode && (
        <div className="p-6 border-b border-border">
          <h3 className="mb-4 text-foreground font-semibold">
            Sommet sélectionné
          </h3>

          <div className="space-y-2 p-4 bg-muted rounded-lg border border-border">

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Label</span>
              <span className="font-mono text-foreground">
                {selectedNode.label}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>

              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border`}
                style={{
                  backgroundColor:
                    selectedNode.type === "source"
                      ? "#ffe0e8"
                      : selectedNode.type === "sink"
                      ? "#fee2e2"
                      : "#dbeafe",

                  color:
                    selectedNode.type === "source"
                      ? "#ff5c89"
                      : selectedNode.type === "sink"
                      ? "#dc2626"
                      : "#2563eb",

                  borderColor:
                    selectedNode.type === "source"
                      ? "#ff5c89"
                      : selectedNode.type === "sink"
                      ? "#dc2626"
                      : "#2563eb",
                }}
              >
                {selectedNode.type}
              </span>
            </div>

          </div>
        </div>
      )}

      {selectedEdge && (
        <div className="p-6 border-b border-border">
          <h3 className="mb-4 text-foreground font-semibold">
            Arc sélectionné
          </h3>

          <div className="space-y-2 p-4 bg-muted rounded-lg border border-border">

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">De</span>
              <span className="font-mono text-foreground">
                {selectedEdge.source}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">À</span>
              <span className="font-mono text-foreground">
                {selectedEdge.target}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Capacité</span>
              <span className="font-mono text-foreground">
                {selectedEdge.capacity}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Flot</span>
              <span className="font-mono text-[#ff5c89] font-medium">
                {selectedEdge.flow}
              </span>
            </div>

          </div>
        </div>
      )}

      {!selectedNode && !selectedEdge && (
        <div className="p-6 flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Cliquez sur un sommet ou un arc<br />
            pour voir les détails.
          </p>
        </div>
      )}

    </div>
  );
}
