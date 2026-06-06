"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface ClusterGraphProps {
  clusters: any[];
}

export default function ClusterGraph({ clusters }: ClusterGraphProps) {
  // Generate nodes and edges dynamically based on clusters
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!clusters || clusters.length === 0) {
      return { initialNodes: [], initialEdges: [] };
    }

    const clusterSpacingX = 600; // Distance between clusters
    let currentX = 0;

    clusters.forEach((cluster, clusterIndex) => {
      const clusterId = cluster.id || `cluster-${clusterIndex}`;
      const wallets = cluster.wallets || [];
      const isSybil = cluster.size >= 2;

      // 1. Create the Central Cluster Node
      nodes.push({
        id: clusterId,
        position: { x: currentX, y: 300 },
        data: {
          label: (
            <div className="flex flex-col items-center justify-center font-sans">
              <span className="font-bold text-sm">Cluster #{clusterIndex + 1}</span>
              <span className="text-xs opacity-80">{cluster.size} Wallets</span>
            </div>
          ),
        },
        style: {
          background: isSybil ? "#fee2e2" : "#f3f4f6", // Red for Sybil, Gray for normal
          border: isSybil ? "2px solid #ef4444" : "1px solid #d1d5db",
          borderRadius: "8px",
          padding: "10px",
          width: 140,
          color: isSybil ? "#991b1b" : "#374151",
          boxShadow: isSybil ? "0 4px 6px -1px rgba(239, 68, 68, 0.2)" : "none",
        },
        draggable: true,
      });

      // 2. Create Wallet Nodes arranged in a circle around the cluster
      const radius = 250; // Radius of the circle
      const angleStep = (2 * Math.PI) / (wallets.length || 1);

      wallets.forEach((walletInfo: any, wIndex: number) => {
        const walletAddr = walletInfo.address;
        const walletNodeId = `${clusterId}-${walletAddr}`;
        
        // Calculate radial position
        const angle = wIndex * angleStep;
        const wX = currentX + radius * Math.cos(angle);
        const wY = 300 + radius * Math.sin(angle);

        nodes.push({
          id: walletNodeId,
          position: { x: wX, y: wY },
          data: {
            label: <span className="font-mono text-[10px]">{walletAddr.substring(0, 6)}...{walletAddr.substring(walletAddr.length - 4)}</span>
          },
          style: {
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            padding: "5px",
            color: "#6b7280",
            width: 90,
            textAlign: "center"
          },
          draggable: true,
        });

        // 3. Create Edge connecting wallet to cluster
        edges.push({
          id: `edge-${clusterId}-${walletNodeId}`,
          source: walletNodeId,
          target: clusterId,
          animated: true,
          style: { stroke: isSybil ? "#f87171" : "#9ca3af", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isSybil ? "#f87171" : "#9ca3af",
          },
        });
      });

      // Move X coordinate for the next cluster
      currentX += clusterSpacingX;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [clusters]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update state when initialNodes change
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (initialNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--secondary)]">
        No graph data available.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#fcfcfc] rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
      >
        <Background gap={16} color="#e5e7eb" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
