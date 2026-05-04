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
    <div className="bg-white rounded-lg border border-border shadow-sm p-6">
      <h3 className="text-foreground mb-4">Residual Capacity History</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left p-3 bg-muted/30 font-medium text-sm text-muted-foreground sticky left-0">
                Edge
              </th>

              {Array.from({ length: maxSteps }, (_, i) => (
                <th
                  key={i}
                  className={`p-3 text-center font-medium text-sm ${
                    i === currentStep
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-muted/20 text-muted-foreground'
                  }`}
                >
                  Step {i}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {edges.map((edge) => {
              const edgeLabel = `${getNodeLabel(edge.source)}${getNodeLabel(edge.target)}`;
              const history = capacityHistory[edge.id] || [];
              const statusHist = statusHistory[edge.id] || [];

              return (
                <tr key={edge.id} className="border-b border-border hover:bg-accent/50">
                  <td className="p-3 font-mono text-sm sticky left-0 bg-white border-r border-border">
                    {edgeLabel}
                  </td>

                  {Array.from({ length: maxSteps }, (_, i) => {
                    const value = history[i];
                    const status = statusHist[i];

                    const prevValue = i > 0 ? history[i - 1] : history[0];
                    const hasChanged = i > 0 && value !== prevValue;

                    let displayValue: string = '-';

                    if (value !== undefined) {
                      if (status === 'saturated') {
                        displayValue = 'S';
                      } else if (status === 'blocked') {
                        displayValue = 'B';
                      } else {
                        displayValue = value.toString();
                      }
                    }

                    const extraStyle =
                      status === 'saturated'
                        ? 'text-red-600 font-bold'
                        : status === 'blocked'
                        ? 'text-gray-500 italic'
                        : '';

                    return (
                      <td
                        key={i}
                        className={`p-3 text-center font-mono text-sm transition-all ${extraStyle} ${
                          i === currentStep
                            ? 'bg-blue-100 text-blue-900 font-semibold'
                            : hasChanged
                            ? 'bg-amber-50 text-amber-900'
                            : ''
                        }`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Current step</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-50 border border-amber-200 rounded"></div>
          <span>Value changed</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-red-600">S</span>
          <span>Saturated (capacity = 0)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="italic text-gray-500">B</span>
          <span>Blocked (not usable in any path)</span>
        </div>
      </div>
    </div>
  );
}