"use client";

import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Funding Wallet 0xA1...' }, type: 'input' },
  { id: '2', position: { x: -100, y: 100 }, data: { label: 'Sybil 0xB2...' } },
  { id: '3', position: { x: 100, y: 100 }, data: { label: 'Sybil 0xC3...' } },
  { id: '4', position: { x: -150, y: 200 }, data: { label: 'Contract Interaction' }, type: 'output' },
  { id: '5', position: { x: 150, y: 200 }, data: { label: 'Contract Interaction' }, type: 'output' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Funded (0.1 ETH)', animated: true },
  { id: 'e1-3', source: '1', target: '3', label: 'Funded (0.1 ETH)', animated: true },
  { id: 'e2-4', source: '2', target: '4', label: 'Sync Call' },
  { id: 'e3-5', source: '3', target: '5', label: 'Sync Call' },
];

export function NetworkGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[500px] border border-[var(--border)] rounded-2xl overflow-hidden bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap zoomable pannable />
        <Background color="#E8E8E5" gap={16} />
      </ReactFlow>
    </div>
  );
}
