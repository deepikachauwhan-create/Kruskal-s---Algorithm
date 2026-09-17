import type { GraphNode, GraphEdge, KruskalStep, EvaluatedEdge } from '../types/graph';
import { UnionFind } from './unionFind';
import { validateGraph } from './graphUtils';

export function generateKruskalSteps(nodes: GraphNode[], edges: GraphEdge[]): KruskalStep[] {
  const steps: KruskalStep[] = [];
  const validation = validateGraph(nodes, edges);

  const nodeIds = nodes.map(n => n.id);
  const requiredCount = nodes.length - 1;
  const uf = new UnionFind(nodeIds);

  // Step 0: Initial graph
  const initialEvaluatedEdges: EvaluatedEdge[] = edges.map(e => ({
    ...e,
    status: 'PENDING',
  }));

  steps.push({
    stepIndex: 0,
    totalSteps: 0, // updated at end
    phase: 'INITIAL',
    currentEdgeId: null,
    evaluatedEdges: initialEvaluatedEdges,
    mstEdges: [],
    rejectedEdges: [],
    unionFindState: uf.getSnapshot(),
    description: 'Start with the given weighted graph. Every vertex is initially in its own independent set.',
    highlightedComponentNodes: [],
    isCycle: false,
    totalCost: 0,
    acceptedCount: 0,
    requiredCount,
    cycleCheckCount: 0,
  });

  // Check empty or invalid graph
  if (nodes.length < 2 || edges.length === 0) {
    steps[0].phase = 'COMPLETED';
    steps[0].description = 'Insufficient nodes or edges to execute Kruskal’s Algorithm.';
    return steps;
  }

  // Step 1: Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const sortedEvaluatedEdges: EvaluatedEdge[] = sortedEdges.map(e => ({
    ...e,
    status: 'PENDING',
  }));

  steps.push({
    stepIndex: 1,
    totalSteps: 0,
    phase: 'SORTING',
    currentEdgeId: null,
    evaluatedEdges: [...sortedEvaluatedEdges],
    mstEdges: [],
    rejectedEdges: [],
    unionFindState: uf.getSnapshot(),
    description: `All ${edges.length} edges are extracted and sorted in non-decreasing order by weight (Smallest → Largest).`,
    highlightedComponentNodes: [],
    isCycle: false,
    totalCost: 0,
    acceptedCount: 0,
    requiredCount,
    cycleCheckCount: 0,
  });

  const currentEvaluated = [...sortedEvaluatedEdges];
  const mstEdges: GraphEdge[] = [];
  const rejectedEdges: GraphEdge[] = [];
  let totalCost = 0;
  let cycleCheckCount = 0;

  // Process edges sequentially
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    cycleCheckCount++;

    // Step 2a: Checking edge
    const rootU = uf.find(edge.source);
    const rootV = uf.find(edge.target);
    const isCycle = rootU === rootV;

    // Get nodes in both components for visualization
    const componentNodesU = uf.getComponentOf(edge.source);
    const componentNodesV = uf.getComponentOf(edge.target);
    const highlightedNodes = Array.from(new Set([...componentNodesU, ...componentNodesV]));

    // Mark current edge as CHECKING
    const checkingEvaluated = currentEvaluated.map((e, idx) =>
      idx === i ? { ...e, status: 'CHECKING' as const } : e
    );

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      phase: 'CHECKING_EDGE',
      currentEdgeId: edge.id,
      evaluatedEdges: [...checkingEvaluated],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      unionFindState: uf.getSnapshot(),
      description: `Examining edge ${edge.source}—${edge.target} (Weight = ${edge.weight}). Checking if vertices belong to the same component...`,
      highlightedComponentNodes: highlightedNodes,
      isCycle,
      totalCost,
      acceptedCount: mstEdges.length,
      requiredCount,
      cycleCheckCount,
    });

    if (!isCycle) {
      // Step 2b: Accept edge
      uf.union(edge.source, edge.target);
      mstEdges.push(edge);
      totalCost += edge.weight;

      currentEvaluated[i] = {
        ...edge,
        status: 'ACCEPTED',
        actionReason: 'Connects disjoint components',
      };

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        phase: 'ACCEPTING_EDGE',
        currentEdgeId: edge.id,
        evaluatedEdges: [...currentEvaluated],
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        unionFindState: uf.getSnapshot(),
        description: `✓ ACCEPTED ${edge.source}—${edge.target} (Weight = ${edge.weight}). Vertices belong to different sets. Component sets merged into Union-Find!`,
        highlightedComponentNodes: uf.getComponentOf(edge.source),
        isCycle: false,
        totalCost,
        acceptedCount: mstEdges.length,
        requiredCount,
        cycleCheckCount,
      });

      // Stop condition: MST requires exactly V - 1 edges
      if (mstEdges.length === requiredCount) {
        // Stop early if V-1 edges reached!
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          phase: 'COMPLETED',
          currentEdgeId: null,
          evaluatedEdges: [...currentEvaluated],
          mstEdges: [...mstEdges],
          rejectedEdges: [...rejectedEdges],
          unionFindState: uf.getSnapshot(),
          description: `🎉 MST COMPLETE! Selected exactly V − 1 (${requiredCount}) edges. Minimum Spanning Tree formed with total weight cost = ${totalCost}.`,
          highlightedComponentNodes: nodeIds,
          isCycle: false,
          totalCost,
          acceptedCount: mstEdges.length,
          requiredCount,
          cycleCheckCount,
        });

        // Set totalSteps across all steps
        const total = steps.length;
        steps.forEach(s => (s.totalSteps = total));
        return steps;
      }
    } else {
      // Step 2c: Reject edge (cycle detected)
      rejectedEdges.push(edge);
      currentEvaluated[i] = {
        ...edge,
        status: 'REJECTED',
        actionReason: 'Creates cycle (already connected)',
      };

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        phase: 'REJECTING_EDGE',
        currentEdgeId: edge.id,
        evaluatedEdges: [...currentEvaluated],
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        unionFindState: uf.getSnapshot(),
        description: `✕ REJECTED ${edge.source}—${edge.target} (Weight = ${edge.weight}). Both vertices already belong to component set {${componentNodesU.join(', ')}}. Adding this edge creates a cycle!`,
        highlightedComponentNodes: componentNodesU,
        isCycle: true,
        totalCost,
        acceptedCount: mstEdges.length,
        requiredCount,
        cycleCheckCount,
      });
    }
  }

  // If we processed all edges but mstEdges.length < V - 1
  if (validation.isDisconnected) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      phase: 'DISCONNECTED_ERROR',
      currentEdgeId: null,
      evaluatedEdges: [...currentEvaluated],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      unionFindState: uf.getSnapshot(),
      description: `⚠ DISCONNECTED GRAPH: Processed all edges. A single MST connecting all vertices cannot be formed because the graph has ${validation.connectedComponentsCount} disconnected components. (A Minimum Spanning Forest was constructed).`,
      highlightedComponentNodes: [],
      isCycle: false,
      totalCost,
      acceptedCount: mstEdges.length,
      requiredCount,
      cycleCheckCount,
    });
  } else if (mstEdges.length === requiredCount) {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      phase: 'COMPLETED',
      currentEdgeId: null,
      evaluatedEdges: [...currentEvaluated],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      unionFindState: uf.getSnapshot(),
      description: `🎉 MST COMPLETE! All vertices connected using V − 1 (${requiredCount}) edges with total cost = ${totalCost}.`,
      highlightedComponentNodes: nodeIds,
      isCycle: false,
      totalCost,
      acceptedCount: mstEdges.length,
      requiredCount,
      cycleCheckCount,
    });
  }

  const total = steps.length;
  steps.forEach(s => (s.totalSteps = total));
  return steps;
}
