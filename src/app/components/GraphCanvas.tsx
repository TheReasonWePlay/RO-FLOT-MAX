import { useRef, useState } from 'react';

//--------------------------------------------TYPE------------------------------------------------

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'source' | 'sink' | 'normal';
}
type SignedEdge = {
  edgeId: string;
  direction: 1 | -1;
};

interface Edge {
  id: string;
  source: string;
  target: string;
  capacity: number;
  flow: number;
}

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  onNodeSelect: (id: string) => void;
  onEdgeSelect: (id: string) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  highlightedPath?: SignedEdge[];
  isAlgo2?: boolean;
  statusHistory?: { [edgeId: string]: string[] };
  currentStep?: number;
}

//--------------------------------------------COMPOSANT------------------------------------------------

export function GraphCanvas({
  nodes,
  edges,
  selectedNode,
  selectedEdge,
  onNodeSelect,
  onEdgeSelect,
  onNodeMove,
  highlightedPath = [],
  statusHistory = {},
  currentStep = 0,
  isAlgo2
}: GraphCanvasProps) {

  //--------------------------------------------STATE------------------------------------------------

  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  //--------------------------------------------COMPORTEMENT------------------------------------------------

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string, nodeX: number, nodeY: number) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
    onNodeSelect(nodeId);

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - nodeX;
      const offsetY = e.clientY - rect.top - nodeY;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = Math.max(40, Math.min(rect.width - 40, e.clientX - rect.left - dragOffset.x));
      const y = Math.max(40, Math.min(rect.height - 40, e.clientY - rect.top - dragOffset.y));
      onNodeMove(draggingNode, x, y);
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const getNodeColor = (node: Node) => {
    if (node.type === 'source') return { fill: '#45dcaa', stroke: '#29be8f' };
    if (node.type === 'sink') return { fill: '#ef5959', stroke: '#dc2626' };
    return { fill: '#fc96b1', stroke: '#fe7a9f' };
  };

  const isEdgeInPath = (edgeId: string, algo2?: boolean) => {
    if(algo2){
      return highlightedPath.some(p => p.edgeId === edgeId);
    }
    else{
      return highlightedPath.includes(edgeId);
    }
  };

  const renderArrowMarker = (edgeId: string, isSelected: boolean, isInPath: boolean) => {
    const status = getEdgeStatus(edgeId);

    const color =
  status === 'saturated'
    ? '#ef4444'
    : status === 'blocked'
    ? '#3b82f6'
    : isAlgo2
    ? (isInPath ? '#10b981' : '#6b7280')
    : isInPath
    ? '#10b981'
    : '#6b7280';
    return (
      <defs key={`marker-${edgeId}`}>
        <marker
          id={`arrow-${edgeId}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
    );
  };

  const calculateEdgePath = (source: Node, target: Node) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const nodeRadius = 30;
    const startX = source.x + (dx / distance) * nodeRadius;
    const startY = source.y + (dy / distance) * nodeRadius;
    const endX = target.x - (dx / distance) * (nodeRadius + 10);
    const endY = target.y - (dy / distance) * (nodeRadius + 10);

    return { startX, startY, endX, endY };
  };

  const getEdgeStatus = (edgeId: string): 'normal' | 'saturated' | 'blocked' => {
    const status = statusHistory[edgeId]?.[currentStep];
  
    if (status === 'saturated') return 'saturated';
    if (status === 'blocked') return 'blocked';
  
    return 'normal';
  };

  //--------------------------------------------RENDER------------------------------------------------

  return (
    <svg
      ref={svgRef}
      className="w-full h-full bg-gray-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ display: 'block' }}
    >
      {edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        const { startX, startY, endX, endY } = calculateEdgePath(sourceNode, targetNode);
        const isSelected = selectedEdge === edge.id;
        const isInPath = isEdgeInPath(edge.id, isAlgo2);
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        const status = getEdgeStatus(edge.id);

        const signed = isAlgo2
  ? highlightedPath.find(p => p.edgeId === edge.id)
  : null;

const edgeColor =
  status === 'saturated'
    ? '#ef4444'
    : status === 'blocked'
    ? '#3b82f6'
    : isAlgo2
    ? (signed
        ? (signed.direction === 1 ? '#10b981' : '#f59e0b')
        : '#6b7280')
    : isInPath
    ? '#10b981'
    : '#6b7280';

        return (
          <g key={edge.id}>
            {renderArrowMarker(edge.id, isSelected, isInPath)}

            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={edgeColor}
              strokeWidth={isSelected ? 4 : 2}
              markerEnd={`url(#arrow-${edge.id})`}
              className="cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onEdgeSelect(edge.id);
              }}
              style={{
                filter:
                  status === 'saturated'
                    ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))'
                    : status === 'blocked'
                    ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))'
                    : isInPath
                    ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))'
                    : 'none'
              }}
            />

            <rect
              x={midX - 30}
              y={midY - 14}
              width="60"
              height="28"
              rx="6"
              fill={isInPath ? '#d1fae5' : 'white'}
              stroke={isInPath ? '#10b981' : isSelected ? '#3b82f6' : '#d1d5db'}
              strokeWidth={isInPath ? 2 : isSelected ? 2 : 1}
              className="cursor-pointer transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onEdgeSelect(edge.id);
              }}
            />
          <text
            x={midX}
            y={midY - 20}
            textAnchor="middle"
            className="text-sm select-none pointer-events-none font-mono"
            fill={isInPath ? '#065f46' : '#374151'}
          >
            {isAlgo2 && highlightedPath.length > 0
              ? (() => {
                  const signed = highlightedPath.find(p => p.edgeId === edge.id);

                  if (!signed) {
                    return ``;
                  }

                  return signed.direction === 1
                    ? `+`
                    : `-`;
                })()
              : ``}
          </text>
          <text
            x={midX}
            y={midY + 5}
            textAnchor="middle"
            className="text-sm select-none pointer-events-none font-mono"
            fill={isInPath ? '#065f46' : '#374151'}
          >
            {edge.flow}/{edge.capacity}
          </text>
          </g>
        );
      })}

      {nodes.map(node => {
        const colors = getNodeColor(node);
        const isSelected = selectedNode === node.id;
        const isInPath = highlightedPath.some(edgeId => {
          const edge = edges.find(e => e.id === edgeId);
          return edge && (edge.source === node.id || edge.target === node.id);
        });

        return (
          <g
            key={node.id}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
            className="cursor-move"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="30"
              fill={colors.fill}
              stroke={isInPath ? '#10b981' : isSelected ? '#ff5c89' : colors.stroke}
              strokeWidth={isInPath ? 5 : isSelected ? 5 : 2}
              className="transition-all hover:brightness-110 hover:stroke-4"
              style={{
                filter: isInPath ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' : isSelected ? 'drop-shadow(0 0 6px rgba(255, 92, 137, 0.6))' : 'none',
                cursor: 'move'
              }}
            />

            <text
              x={node.x}
              y={node.y + 6}
              textAnchor="middle"
              className="text-xl select-none pointer-events-none"
              fill="white"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
