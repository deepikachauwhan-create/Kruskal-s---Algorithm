import type { GraphNode, GraphEdge, GraphValidationResult } from '../types/graph';

export const NODE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// Default Reference Example Graph from prompt
export const REFERENCE_NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 120, y: 120 },
  { id: 'B', label: 'B', x: 380, y: 100 },
  { id: 'C', label: 'C', x: 220, y: 260 },
  { id: 'D', label: 'D', x: 480, y: 260 },
  { id: 'E', label: 'E', x: 320, y: 420 },
  { id: 'F', label: 'F', x: 580, y: 420 },
];

export const REFERENCE_EDGES: GraphEdge[] = [
  { id: 'A-B', source: 'A', target: 'B', weight: 4 },
  { id: 'A-C', source: 'A', target: 'C', weight: 3 },
  { id: 'B-C', source: 'B', target: 'C', weight: 1 },
  { id: 'B-D', source: 'B', target: 'D', weight: 2 },
  { id: 'C-D', source: 'C', target: 'D', weight: 4 },
  { id: 'C-E', source: 'C', target: 'E', weight: 6 },
  { id: 'D-E', source: 'D', target: 'E', weight: 5 },
  { id: 'D-F', source: 'D', target: 'F', weight: 7 },
  { id: 'E-F', source: 'E', target: 'F', weight: 8 },
];

/**
 * Arranges N vertices in a visually appealing polygon/circle or customized force layout.
 */
export function calculateCircularPositions(count: number, width: number = 600, height: number = 460): GraphNode[] {
  const nodes: GraphNode[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;

  for (let i = 0; i < count; i++) {
    const label = NODE_LABELS[i] || `V${i + 1}`;
    const angle = (2 * Math.PI * i) / count - Math.PI / 2; // Start from top
    const x = Math.round(centerX + radius * Math.cos(angle));
    const y = Math.round(centerY + radius * Math.sin(angle));
    nodes.push({ id: label, label, x, y });
  }

  return nodes;
}

/**
 * Generates a connected random graph with `vertexCount` nodes and weighted edges.
 */
export function generateRandomGraph(vertexCount: number, edgeDensity: number = 0.45): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const count = Math.max(3, Math.min(10, vertexCount));
  const nodes = calculateCircularPositions(count);
  const edges: GraphEdge[] = [];
  const edgeSet = new Set<string>();

  const getEdgeKey = (u: string, v: string) => (u < v ? `${u}-${v}` : `${v}-${u}`);

  // 1. Create a spanning tree first to guarantee connectivity
  for (let i = 1; i < count; i++) {
    const parent = Math.floor(Math.random() * i);
    const u = nodes[i].id;
    const v = nodes[parent].id;
    const weight = Math.floor(Math.random() * 19) + 1; // 1 to 19
    const key = getEdgeKey(u, v);
    
    edgeSet.add(key);
    edges.push({
      id: key,
      source: u < v ? u : v,
      target: u < v ? v : u,
      weight,
    });
  }

  // 2. Add extra random edges for density
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const u = nodes[i].id;
      const v = nodes[j].id;
      const key = getEdgeKey(u, v);

      if (!edgeSet.has(key) && Math.random() < edgeDensity) {
        const weight = Math.floor(Math.random() * 19) + 1;
        edgeSet.add(key);
        edges.push({
          id: key,
          source: u,
          target: v,
          weight,
        });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Validates graph connectivity and structure.
 */
export function validateGraph(nodes: GraphNode[], edges: GraphEdge[]): GraphValidationResult {
  if (nodes.length < 2) {
    return {
      isValid: false,
      isDisconnected: true,
      connectedComponentsCount: 0,
      errorMessage: 'Graph must contain at least 2 vertices.',
    };
  }

  const nodeIds = new Set(nodes.map(n => n.id));
  
  // Check malformed edges
  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      return {
        isValid: false,
        isDisconnected: true,
        connectedComponentsCount: 0,
        errorMessage: `Edge ${edge.id} references non-existent vertex.`,
      };
    }
    if (edge.source === edge.target) {
      return {
        isValid: false,
        isDisconnected: false,
        connectedComponentsCount: 0,
        errorMessage: `Self-loops are not supported in MST algorithms (${edge.source}-${edge.target}).`,
      };
    }
  }

  // BFS to check connectivity and count components
  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.source]?.push(e.target);
    adj[e.target]?.push(e.source);
  }

  const visited = new Set<string>();
  let componentsCount = 0;

  for (const n of nodes) {
    if (!visited.has(n.id)) {
      componentsCount++;
      const queue = [n.id];
      visited.add(n.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        for (const neighbor of adj[curr] || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }
  }

  const isDisconnected = componentsCount > 1;

  return {
    isValid: true,
    isDisconnected,
    connectedComponentsCount: componentsCount,
    errorMessage: isDisconnected
      ? `The graph is disconnected (${componentsCount} separate components). A single MST cannot span all vertices.`
      : undefined,
  };
}
