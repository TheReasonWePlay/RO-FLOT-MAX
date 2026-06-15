import { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { SelectionPanel } from './components/SelectionPanel';
import { GraphCanvas } from './components/GraphCanvas';
import { CapacityTable } from './components/CapacityTable';


//----------------------------------------------TYPE-----------------------------------------------------------
interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'source' | 'sink' | 'normal';
}

interface Edge {
  id: string;
  source: string;
  target: string;
  capacity: number;
  flow: number;
  saturated?: boolean;
}

type SignedEdge = {
  edgeId: string;
  direction: 1 | -1;
};

interface AlgorithmStep {
  edges: Edge[];
  path: SignedEdge[];
  message: string;
  capacitySnapshot: { [edgeId: string]: number };
}

//----------------------------------------------INITIALISATION-----------------------------------------------------------

const initialNodes: Node[] = [
  { id: '1', label: 'α', x: 300, y: 150, type: 'source' },
  { id: '2', label: 'ω', x: 700, y: 150, type: 'sink' },
];

const initialEdges: Edge[] = [];

//----------------------------------------------COMPOSANT PRINCIPALE-----------------------------------------------------------

export default function App() {

  //----------------------------------------------STATE-----------------------------------------------------------

  const [finalEdgesFromAlgo1, setFinalEdgesFromAlgo1] = useState<Edge[]>([]);
  const [isAlgo2, setIsAlgo2] = useState(false);

  const [statusHistory, setStatusHistory] = useState<{ [edgeId: string]: string[] }>({});
  
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [baseEdges, setBaseEdges] = useState<Edge[]>(initialEdges);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  const [maxFlow, setMaxFlow] = useState<number | null>(null);

  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Auto-play mode
  const [capacityHistory, setCapacityHistory] = useState<{ [edgeId: string]: number[] }>({});

  const [algorithmStarted, setAlgorithmStarted] = useState(false);
  const [stepByStep, setStepByStep] = useState(false);

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = algorithmSteps[currentStepIndex];
  const displayEdges = currentStep?.edges || baseEdges;
  const highlightedPath = currentStep?.path || [];

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const selectedEdgeData = selectedEdge ? displayEdges.find(e => e.id === selectedEdge) : null;

  //----------------------------------------------COMPORTEMENT-----------------------------------------------------------

  //REGENERER A CHAQUE MODIF
  useEffect(() => {
    generateAlgorithmSteps();
  }, [baseEdges]);

  //PLAY/PAUSE
  useEffect(() => {
    if (isPlaying && currentStepIndex < algorithmSteps.length - 1) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= algorithmSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      if (currentStepIndex >= algorithmSteps.length - 1) {
        setIsPlaying(false);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, algorithmSteps.length]);

  //----------------------------------------------ALGO FLOT COMPLET-----------------------------------------------------------

  const generateAlgorithmSteps = () => {
    if (baseEdges.length === 0) {
      setAlgorithmSteps([]);
      setCapacityHistory({});
      return;
    }
  
    const steps: AlgorithmStep[] = [];
    const history: { [edgeId: string]: number[] } = {};
  
    const statusHist: { [edgeId: string]: string[] } = {};

    baseEdges.forEach(edge => {
      history[edge.id] = [];
      statusHist[edge.id] = [];
    });
  
    const workingEdges = baseEdges.map(e => ({
      ...e,
      flow: 0,
      saturated: false
    }));

    const sourceNode = nodes.find(n => n.type === 'source');
    const sinkNode = nodes.find(n => n.type === 'sink');
  
    if (!sourceNode || !sinkNode) return;
  
    //TROUVER TOUS LES CHEMINS
    const findAllPaths = (edges: Edge[], source: string, sink: string): string[][] => {
      const results: string[][] = [];
  
      const dfs = (current: string, path: string[], visited: Set<string>) => {
        if (results.length > 500) return;
  
        if (current === sink) {
          results.push([...path]);
          return;
        }
  
        visited.add(current);
  
        for (const edge of edges) {
          const residual = edge.capacity - edge.flow;
  
          if (
            edge.source === current &&
            residual > 0 && // ignorer arcs saturés
            !visited.has(edge.target)
          ) {
            dfs(edge.target, [...path, edge.id], new Set(visited));
          }
        }
      };
  
      dfs(source, [], new Set());
      return results;
    };
  
    const createSnapshot = (edgeList: Edge[]) => {
      const snapshot: { [edgeId: string]: number } = {};
      edgeList.forEach(edge => {
        snapshot[edge.id] = edge.capacity - edge.flow;
      });
      return snapshot;
    };
  
    const recordHistory = (edgeList: Edge[]) => {
      const allPaths = findAllPaths(edgeList, sourceNode.id, sinkNode.id);
      const edgesInPaths = new Set(allPaths.flat());
    
      edgeList.forEach(edge => {
        const residual = edge.capacity - edge.flow;
    
        history[edge.id].push(residual);
    
        if (residual === 0) {
          statusHist[edge.id].push('saturated');
        } else if (!edgesInPaths.has(edge.id)) {
          statusHist[edge.id].push('blocked');
        } else {
          statusHist[edge.id].push('normal');
        }
      });
    };
  
    steps.push({
      edges: workingEdges.map(e => ({ ...e })),
      path: [],
      message: 'Initial state: All flows set to 0',
      capacitySnapshot: createSnapshot(workingEdges)
    });
    recordHistory(workingEdges);
  
    let iteration = 0;
    const maxIterations = 100;
  
    while (iteration < maxIterations) {
      const allPaths = findAllPaths(workingEdges, sourceNode.id, sinkNode.id);
  
      if (allPaths.length === 0) break;
  
      const evaluated = allPaths.map(path => {
        const edgesPath = path.map(id => workingEdges.find(e => e.id === id)!);
        const bottleneck = Math.min(...edgesPath.map(e => e.capacity - e.flow));
        return { path, bottleneck };
      });
  
      const best = evaluated.reduce((min, p) =>
        p.bottleneck < min.bottleneck ? p : min
      );
  
      const path = best.path;
      const bottleneck = best.bottleneck;
  
      if (!path || bottleneck <= 0) break;
  
      const pathEdges = path.map(id => workingEdges.find(e => e.id === id)!);
  
      const pathNodes = [
        pathEdges[0].source,
        ...pathEdges.map(e => e.target)
      ];
  
      const pathStr = pathNodes
        .map(id => nodes.find(n => n.id === id)?.label || id)
        .join(' → ');
  
      steps.push({
        edges: workingEdges.map(e => ({ ...e })),
        path,
        message: `Path selected (min bottleneck): ${pathStr}`,
        capacitySnapshot: createSnapshot(workingEdges)
      });
      recordHistory(workingEdges);
  
      pathEdges.forEach(edge => {
        edge.flow += bottleneck;
  
        if (edge.flow === edge.capacity) {
          edge.saturated = true;
        }
      });
  
      steps.push({
        edges: workingEdges.map(e => ({ ...e })),
        path,
        message: `Flow +${bottleneck} | Saturated edges marked`,
        capacitySnapshot: createSnapshot(workingEdges)
      });
      recordHistory(workingEdges);
  
      iteration++;
    }
  
    steps.push({
      edges: workingEdges.map(e => ({ ...e })),
      path: [],
      message: 'No more augmenting paths. End.',
      capacitySnapshot: createSnapshot(workingEdges)
    });
    recordHistory(workingEdges);
  
    setAlgorithmSteps(steps);
    setCapacityHistory(history);
    setStatusHistory(statusHist);
    setCurrentStepIndex(0);
  };

  //----------------------------------------------ALGO FLOT MAX----------------------------------------------------------

  const generateAlgorithmSteps2 = (): AlgorithmStep[] => {
    if (baseEdges.length === 0) {
      setAlgorithmSteps([]);
      setCapacityHistory({});
      return [];
    }
  
    const steps: AlgorithmStep[] = [];
    const history: { [edgeId: string]: number[] } = {};
    const statusHist: { [edgeId: string]: string[] } = {};
  
    baseEdges.forEach(edge => {
      history[edge.id] = [];
      statusHist[edge.id] = [];
    });
  
    const workingEdges = finalEdgesFromAlgo1.map(e => ({
      ...e
    }));
  
    const sourceNode = nodes.find(n => n.type === 'source');
    const sinkNode = nodes.find(n => n.type === 'sink');
    if (!sourceNode || !sinkNode) return [];
  
    // TROUVER CHEMIN
    const findAllPaths = (edges: Edge[], source: string, sink: string): SignedEdge[][] => {
      const results: SignedEdge[][] = [];
  
      const dfs = (current: string, path: SignedEdge[], visited: Set<string>) => {
        if (results.length > 200) return;
  
        if (current === sink) {
          results.push([...path]);
          return;
        }
  
        visited.add(current);
  
        for (const edge of edges) {
          // AVANCER
          if (
            edge.source === current &&
            edge.capacity - edge.flow > 0 &&
            !visited.has(edge.target)
          ) {
            dfs(
              edge.target,
              [...path, { edgeId: edge.id, direction: 1 }],
              new Set(visited)
            );
          }
  
          // RECULER
          if (
            edge.target === current &&
            edge.flow > 0 &&
            !visited.has(edge.source)
          ) {
            dfs(
              edge.source,
              [...path, { edgeId: edge.id, direction: -1 }],
              new Set(visited)
            );
          }
        }
      };
  
      dfs(source, [], new Set());
      return results;
    };
  
    const createSnapshot = (edgeList: Edge[]) => {
      const snapshot: { [edgeId: string]: number } = {};
      edgeList.forEach(edge => {
        snapshot[edge.id] = edge.capacity - edge.flow;
      });
      return snapshot;
    };
  
    const recordHistory = (edgeList: Edge[]) => {
      const allPaths = findAllPaths(edgeList, sourceNode.id, sinkNode.id);
      const edgesInPaths = new Set(allPaths.flat().map(p => p.edgeId));
  
      edgeList.forEach(edge => {
        const residual = edge.capacity - edge.flow;
        history[edge.id].push(residual);
  
        if (residual === 0) {
          statusHist[edge.id].push('saturated');
        } else if (!edgesInPaths.has(edge.id)) {
          statusHist[edge.id].push('blocked');
        } else {
          statusHist[edge.id].push('normal');
        }
      });
    };
  
    steps.push({
      edges: workingEdges.map(e => ({ ...e })),
      path: [],
      message: 'Residual graph exploration (starting from final flow)',
      capacitySnapshot: createSnapshot(workingEdges)
    });
  
    recordHistory(workingEdges);
  
    let iteration = 0;
    const maxIterations = 100;
  
    while (iteration < maxIterations) {
      const allPaths = findAllPaths(workingEdges, sourceNode.id, sinkNode.id);
  
      if (allPaths.length === 0) break;
  
      const evaluated = allPaths.map(path => {
        const bottleneck = Math.min(
          ...path.map(p => {
            const e = workingEdges.find(e => e.id === p.edgeId)!;
            return p.direction === 1
              ? e.capacity - e.flow
              : e.flow;
          })
        );
        return { path, bottleneck };
      });
  
      const best = evaluated.sort((a, b) => {
        // 1. Moins d'arcs
        if (a.path.length !== b.path.length) {
          return a.path.length - b.path.length;
        }

        // 2. Plus petit minimum
        return a.bottleneck - b.bottleneck;
      })[0];
  
      const path = best.path;
      const bottleneck = best.bottleneck;
  
      if (!path || bottleneck <= 0) break;
  
      const pathStr = path.map(p => {
        const e = workingEdges.find(e => e.id === p.edgeId)!;
        const from = nodes.find(n => n.id === e.source)?.label;
        const to = nodes.find(n => n.id === e.target)?.label;
  
        return p.direction === 1
          ? `${from}→${to}(+)`
          : `${to}→${from}(-)`;
      }).join(' ');
  
      steps.push({
        edges: workingEdges.map(e => ({ ...e })),
        path,
        message: `Residual path: ${pathStr}`,
        capacitySnapshot: createSnapshot(workingEdges)
      });
  
      recordHistory(workingEdges);
  
      path.forEach(p => {
        const e = workingEdges.find(e => e.id === p.edgeId)!;
  
        if (p.direction === 1) {
          e.flow += bottleneck;
        } else {
          e.flow -= bottleneck;
        }
  
        e.saturated = e.flow === e.capacity;
      });
  
      steps.push({
        edges: workingEdges.map(e => ({ ...e })),
        path,
        message: `Adjustment ${bottleneck} (± flow update)`,
        capacitySnapshot: createSnapshot(workingEdges)
      });
  
      recordHistory(workingEdges);
  
      iteration++;
    }
  
    steps.push({
      edges: workingEdges.map(e => ({ ...e })),
      path: [],
      message: 'No more residual paths. End.',
      capacitySnapshot: createSnapshot(workingEdges)
    });
  
    recordHistory(workingEdges);
  
    setCapacityHistory(history);
    setStatusHistory(statusHist);

    return steps;
  };

  const handleStartAlgorithm2 = () => {
    if (algorithmSteps.length === 0) {
      alert("Run Algorithm 1 first");
      return;
    }
  
    const steps = generateAlgorithmSteps2();
  
    setAlgorithmSteps(steps);
    setCurrentStepIndex(0);
    setAlgorithmStarted(true);
    setIsAlgo2(true);
  
    if (!stepByStep) {
      const finalIndex = steps.length - 1;
      setCurrentStepIndex(finalIndex);
  
      const finalStep = steps[finalIndex];
      const totalFlow = finalStep.edges
        .filter(e => {
          const targetNode = nodes.find(n => n.id === e.target);
          return targetNode?.type === 'sink';
        })
        .reduce((sum, e) => sum + e.flow, 0);
  
      setMaxFlow(totalFlow);
    }
  };

  const handleBackToAlgo1 = () => {
    setIsAlgo2(false);
  
    generateAlgorithmSteps(); 
    setCurrentStepIndex(0);
  };

  const handleAddNode = () => {
    const newId = (Math.max(...nodes.map(n => parseInt(n.id)), 0) + 1).toString();
    const normalNodeCount = nodes.filter(n => n.type === 'normal').length;
    const newNode: Node = {
      id: newId,
      label: String.fromCharCode(65 + normalNodeCount),
      x: 300 + Math.random() * 400,
      y: 100 + Math.random() * 250,
      type: 'normal'
    };
    setNodes([...nodes, newNode]);
  };

  const handleAddEdge = (source: string, target: string, capacity: number) => {
    const newId = `e${baseEdges.length + 1}`;
    const newEdge: Edge = {
      id: newId,
      source,
      target,
      capacity,
      flow: 0
    };
    setBaseEdges([...baseEdges, newEdge]);
    setCurrentStepIndex(0);
  };

  const handleDeleteNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || node.type === 'source' || node.type === 'sink') {
      alert('Cannot delete source or sink nodes');
      return;
    }

    setNodes(nodes.filter(n => n.id !== nodeId));

    setBaseEdges(baseEdges.filter(e => e.source !== nodeId && e.target !== nodeId));

    setSelectedNode(null);
  };

  const handleDeleteEdge = (edgeId: string) => {
    setBaseEdges(baseEdges.filter(e => e.id !== edgeId));
    setSelectedEdge(null);
  };

  const handleNodeMove = (id: string, x: number, y: number) => {
    setNodes(nodes.map(node =>
      node.id === id ? { ...node, x, y } : node
    ));
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setBaseEdges(initialEdges);
    setMaxFlow(null);
    setSelectedNode(null);
    setSelectedEdge(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setAlgorithmStarted(false);
    handleBackToAlgo1();
  };

  const handleExample = () => {
    handleReset();
  
    const exampleNodes: Node[] = [
      { id: '1', label: 'α', x: 150, y: 200, type: 'source' },
  
      { id: '3', label: 'A', x: 350, y: 80, type: 'normal' },
      { id: '4', label: 'B', x: 350, y: 200, type: 'normal' },
      { id: '5', label: 'C', x: 350, y: 320, type: 'normal' },
  
      { id: '6', label: 'D', x: 550, y: 80, type: 'normal' },
      { id: '7', label: 'E', x: 550, y: 200, type: 'normal' },
      { id: '8', label: 'F', x: 550, y: 320, type: 'normal' },
      { id: '9', label: 'G', x: 550, y: 440, type: 'normal' },
  
      { id: '2', label: 'ω', x: 750, y: 200, type: 'sink' },
    ];
  
    const exampleEdges: Edge[] = [
      { id: 'e1', source: '1', target: '3', capacity: 45, flow: 0 }, // αA
      { id: 'e2', source: '1', target: '4', capacity: 25, flow: 0 }, // αB
      { id: 'e3', source: '1', target: '5', capacity: 30, flow: 0 }, // αC
  
      { id: 'e4', source: '3', target: '6', capacity: 10, flow: 0 }, // AD
      { id: 'e5', source: '3', target: '7', capacity: 15, flow: 0 }, // AE
      { id: 'e6', source: '3', target: '9', capacity: 20, flow: 0 }, // AG
  
      { id: 'e7', source: '4', target: '6', capacity: 20, flow: 0 }, // BD
      { id: 'e8', source: '4', target: '7', capacity: 5, flow: 0 },  // BE
      { id: 'e9', source: '4', target: '8', capacity: 15, flow: 0 }, // BF
  
      { id: 'e10', source: '5', target: '8', capacity: 10, flow: 0 }, // CF
      { id: 'e11', source: '5', target: '9', capacity: 15, flow: 0 }, // CG
  
      { id: 'e12', source: '6', target: '2', capacity: 30, flow: 0 }, // Dω
      { id: 'e13', source: '7', target: '2', capacity: 10, flow: 0 }, // Eω
      { id: 'e14', source: '8', target: '2', capacity: 20, flow: 0 }, // Fω
      { id: 'e15', source: '9', target: '2', capacity: 40, flow: 0 }, // Gω
    ];
  
    setNodes(exampleNodes);
    setBaseEdges(exampleEdges);
  
    setCurrentStepIndex(0);
    setAlgorithmStarted(false);
    setMaxFlow(null);
  };

  const handleBackToResolution = () => {
    handleBackToAlgo1();
    setAlgorithmStarted(false);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setMaxFlow(null);
  };

  const handleStartAlgorithm = () => {
    if (baseEdges.length === 0) {
      alert('Please add at least one edge before starting the algorithm');
      return;
    }

    setAlgorithmStarted(true);
    setSelectedNode(null);
    setSelectedEdge(null);

    if (!stepByStep) {
      const finalStepIndex = algorithmSteps.length - 1;
      setCurrentStepIndex(finalStepIndex);

      if (algorithmSteps.length > 0) {
        const finalStep = algorithmSteps[finalStepIndex];
        setFinalEdgesFromAlgo1(
          finalStep.edges.map(e => ({ ...e }))
        );
        const totalFlow = finalStep.edges
          .filter(e => {
            const targetNode = nodes.find(n => n.id === e.target);
            return targetNode?.type === 'sink';
          })
          .reduce((sum, e) => sum + e.flow, 0);
        setMaxFlow(totalFlow);
      }
    } else {
      setCurrentStepIndex(0);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < algorithmSteps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
  
      if (newIndex === algorithmSteps.length - 1) {
        const step = algorithmSteps[newIndex];
  
        if (!isAlgo2) {
          setFinalEdgesFromAlgo1(
            step.edges.map(e => ({ ...e }))
          );
        }
  
        const totalFlow = step.edges
          .filter(e => {
            const targetNode = nodes.find(n => n.id === e.target);
            return targetNode?.type === 'sink';
          })
          .reduce((sum, e) => sum + e.flow, 0);
  
        setMaxFlow(totalFlow);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  //----------------------------------------------RENDER-----------------------------------------------------------

  return (
    <div className="size-full flex flex-col bg-gray-50">
      <Navbar onReset={handleReset} onExample={handleExample}/>

      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar
          onAddNode={handleAddNode}
          onAddEdge={handleAddEdge}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
          onPlayPause={handlePlayPause}
          onStartAlgorithm={handleStartAlgorithm}
          onBackToResolution={handleBackToResolution}
          onStartAlgo2={isAlgo2 ? handleBackToAlgo1 : handleStartAlgorithm2}
          isPlaying={isPlaying}
          canStepForward={currentStepIndex < algorithmSteps.length - 1}
          canStepBackward={currentStepIndex > 0}
          currentStep={currentStepIndex}
          totalSteps={algorithmSteps.length - 1}
          nodes={nodes}
          algorithmStarted={algorithmStarted}
          stepByStep={stepByStep}
          onStepByStepChange={setStepByStep}
          isAlgo2={isAlgo2}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <PanelGroup direction="vertical" className="flex-1">
              {/*GRAPHE*/}
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full p-6 pb-3 pr-3">
                  <div className="h-full bg-white rounded-xl shadow-lg border border-border overflow-hidden">
                    <GraphCanvas
                      nodes={nodes}
                      edges={displayEdges}
                      selectedNode={selectedNode}
                      selectedEdge={selectedEdge}
                      onNodeSelect={setSelectedNode}
                      onEdgeSelect={setSelectedEdge}
                      onNodeMove={handleNodeMove}
                      highlightedPath={highlightedPath}
                      statusHistory={statusHistory}
                      currentStep={currentStepIndex}
                      isAlgo2={isAlgo2}
                    />
                  </div>
                </div>
              </Panel>

              {algorithmStarted && !isAlgo2 &&(
                <>
                  <PanelResizeHandle className="h-2 bg-border hover:bg-blue-400 transition-colors cursor-row-resize relative group">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <div className="w-12 h-1 bg-muted-foreground/30 rounded group-hover:bg-blue-500 transition-colors"></div>
                    </div>
                  </PanelResizeHandle>

                  {/*TABLEAU RESIDUEL*/}
                  <Panel defaultSize={50} minSize={20}>
                    <div className="h-full px-6 pt-3 pb-6 pr-3 overflow-auto">
                    <CapacityTable
                      edges={baseEdges}
                      capacityHistory={capacityHistory}
                      statusHistory={statusHistory}
                      currentStep={currentStepIndex}
                      getNodeLabel={(id) => nodes.find(n => n.id === id)?.label || ''}
                    />
                    </div>
                  </Panel>
                </>
              )}
            </PanelGroup>
          </div>

          {/*DETAIL/MODIF DES SOMMET/ARC*/}
          <SelectionPanel
            selectedNode={selectedNodeData}
            selectedEdge={selectedEdgeData ? {
              id: selectedEdgeData.id,
              source: nodes.find(n => n.id === selectedEdgeData.source)?.label || '',
              target: nodes.find(n => n.id === selectedEdgeData.target)?.label || '',
              capacity: selectedEdgeData.capacity,
              flow: selectedEdgeData.flow
            } : null}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
            algorithmStarted={algorithmStarted}
          />
        </div>
      </div>
    </div>
  );
}
