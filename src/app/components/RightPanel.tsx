interface RightPanelProps {
  nodeCount: number;
  edgeCount: number;
  maxFlow: number | null;
  selectedNode: { id: string; label: string; type: string } | null;
  selectedEdge: { source: string; target: string; capacity: number; flow: number } | null;
}

export function RightPanel({ nodeCount, edgeCount, maxFlow, selectedNode, selectedEdge }: RightPanelProps) {
  return (
    <div className="w-80 border-l border-border bg-white flex flex-col h-full overflow-auto">
      <div className="p-6 border-b border-border">
        <h2 className="text-foreground mb-4">Information du graphique</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
            <span className="text-sm text-muted-foreground">Sommets</span>
            <span className="font-mono">{nodeCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
            <span className="text-sm text-muted-foreground">Arcs</span>
            <span className="font-mono">{edgeCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <span className="text-sm text-blue-700">Valeur de Flot maximal</span>
            <span className="font-mono text-blue-900">{maxFlow !== null ? maxFlow : '-'}</span>
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="p-6 border-b border-border">
          <h3 className="mb-4 text-foreground">Sommet sélectionné</h3>

          <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Label</span>
              <span className="font-mono">{selectedNode.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="inline-flex px-2 py-0.5 rounded text-xs font-mono" style={{
                backgroundColor: selectedNode.type === 'source' ? '#dcfce7' : selectedNode.type === 'sink' ? '#fee2e2' : '#dbeafe',
                color: selectedNode.type === 'source' ? '#166534' : selectedNode.type === 'sink' ? '#991b1b' : '#1e40af'
              }}>
                {selectedNode.type}
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedEdge && (
        <div className="p-6 border-b border-border">
          <h3 className="mb-4 text-foreground">Arc sélectionné</h3>

          <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">De</span>
              <span className="font-mono">{selectedEdge.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">À</span>
              <span className="font-mono">{selectedEdge.target}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Capacité</span>
              <span className="font-mono">{selectedEdge.capacity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Flow</span>
              <span className="font-mono text-blue-600">{selectedEdge.flow}</span>
            </div>
          </div>
        </div>
      )}

      {!selectedNode && !selectedEdge && (
        <div className="p-6 flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Cliquez sur un sommet ou un arc<br />pour voir les détails.
          </p>
        </div>
      )}
    </div>
  );
}
