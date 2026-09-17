export interface NodePosition {
  x: number;
  y: number;
}

export interface GraphNode {
  id: string; // e.g. "A", "B", "C"
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string; // e.g. "A-B"
  source: string;
  target: string;
  weight: number;
}

export type EdgeStatus = 'PENDING' | 'CHECKING' | 'ACCEPTED' | 'REJECTED';

export interface EvaluatedEdge extends GraphEdge {
  status: EdgeStatus;
  actionReason?: string;
}

export type AlgorithmPhase = 
  | 'IDLE'
  | 'INITIAL'
  | 'SORTING'
  | 'CHECKING_EDGE'
  | 'ACCEPTING_EDGE'
  | 'REJECTING_EDGE'
  | 'COMPLETED'
  | 'DISCONNECTED_ERROR';

export interface UnionFindSnapshot {
  parent: Record<string, string>;
  rank: Record<string, number>;
  sets: Record<string, string[]>; // component leader -> array of node ids
}

export interface KruskalStep {
  stepIndex: number;
  totalSteps: number;
  phase: AlgorithmPhase;
  currentEdgeId: string | null;
  evaluatedEdges: EvaluatedEdge[];
  mstEdges: GraphEdge[];
  rejectedEdges: GraphEdge[];
  unionFindState: UnionFindSnapshot;
  description: string;
  highlightedComponentNodes: string[]; // nodes involved in cycle or component check
  isCycle: boolean;
  totalCost: number;
  acceptedCount: number;
  requiredCount: number; // V - 1
  cycleCheckCount: number;
}

export interface GraphValidationResult {
  isValid: boolean;
  isDisconnected: boolean;
  connectedComponentsCount: number;
  errorMessage?: string;
}

export interface VivaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedPhase?: AlgorithmPhase;
}
