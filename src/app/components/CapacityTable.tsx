//--------------------------------------------TYPE------------------------------------------------

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface CapacityHistory {
  [edgeId: string]: number[];
}

interface CapacityTableProps {
  edges: Edge[];
  capacityHistory: CapacityHistory;
  statusHistory: { [edgeId: string]: string[] };
  currentStep: number;
  getNodeLabel: (nodeId: string) => string;
}

//--------------------------------------------COMPOSANT------------------------------------------------

export function CapacityTable({
  edges,
  capacityHistory,
  statusHistory,
  currentStep,
  getNodeLabel
}: CapacityTableProps) {

  //--------------------------------------------STATE------------------------------------------------


  //--------------------------------------------COMPORTEMENT------------------------------------------------

  const maxSteps = Math.max(
    ...Object.values(capacityHistory).map(h => h.length),
    1
  );

  //--------------------------------------------RENDER------------------------------------------------

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6">
      <h3 className="text-foreground mb-4">
        Historique des capacités résiduelles
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">

              <th className="text-left p-3 bg-muted/30 font-medium text-sm text-muted-foreground sticky left-0">
                Arc
              </th>

              {Array.from({ length: maxSteps }, (_, i) => (
                <th
                  key={i}
                  className={`p-3 text-center font-medium text-sm transition-colors
                    ${
                      i === currentStep
                        ? 'bg-accent/20 text-accent-foreground'
                        : 'bg-muted/20 text-muted-foreground'
                    }`}
                >
                  Étape {i}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {edges.map(edge => {
              const edgeLabel = `${getNodeLabel(edge.source)} → ${getNodeLabel(edge.target)}`;
              const history = capacityHistory[edge.id] || [];
              const statusHist = statusHistory[edge.id] || [];

              return (
                <tr
                  key={edge.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3 font-mono text-sm sticky left-0 bg-card border-r border-border">
                    {edgeLabel}
                  </td>
                  {Array.from({ length: maxSteps }, (_, i) => {
                    const value = history[i];
                    const status = statusHist[i];

                    const prev = i > 0 ? history[i - 1] : history[0];
                    const changed = i > 0 && value !== prev;

                    let display = '-';

                    if (value !== undefined) {
                      if (status === 'saturated') display = 'S';
                      else if (status === 'blocked') display = 'B';
                      else display = String(value);
                    }

                    const statusStyle =
                      status === 'saturated'
                        ? 'text-destructive font-bold'
                        : status === 'blocked'
                        ? 'text-muted-foreground italic'
                        : 'text-foreground';

                    const stepStyle =
                      i === currentStep
                        ? 'bg-accent/20 text-accent-foreground font-semibold'
                        : changed
                        ? 'bg-accent/10'
                        : '';

                    return (
                      <td
                        key={i}
                        className={`p-3 text-center font-mono text-sm transition-all ${statusStyle} ${stepStyle}`}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/20 border border-accent/30"></div>
          <span>Étape actuelle</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/10 border border-accent/20"></div>
          <span>Valeur modifiée</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-destructive">S</span>
          <span>Saturé</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="italic text-muted-foreground">B</span>
          <span>Bloqué</span>
        </div>

      </div>
    </div>
  );
}