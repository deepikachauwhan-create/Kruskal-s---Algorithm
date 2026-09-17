import type { VivaQuestion } from '../types/graph';

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 'q1',
    question: 'Why does Kruskal’s Algorithm sort all edges by weight before processing?',
    options: [
      'To find the shortest path between two specific vertices',
      'To make a greedy choice by always examining the smallest available edge first',
      'To eliminate negative edge weights',
      'To construct a topological order of vertices'
    ],
    correctIndex: 1,
    explanation: 'Kruskal’s algorithm is a greedy algorithm. Sorting edges by weight guarantees that we evaluate the minimum-cost connection available at every step.',
    relatedPhase: 'SORTING',
  },
  {
    id: 'q2',
    question: 'What data structure is primarily used in Kruskal’s Algorithm for cycle detection?',
    options: [
      'Disjoint Set Union (Union-Find)',
      'Binary Search Tree',
      'Priority Queue / Fibonacci Heap',
      'Adjacency Matrix'
    ],
    correctIndex: 0,
    explanation: 'Disjoint Set Union (Union-Find) maintains component groups and checks in near-constant time whether two vertices belong to the same component (which would cause a cycle).',
    relatedPhase: 'CHECKING_EDGE',
  },
  {
    id: 'q3',
    question: 'For a connected undirected graph with V vertices, how many edges does its Minimum Spanning Tree contain?',
    options: [
      'V edges',
      'V - 1 edges',
      'V + 1 edges',
      'E / 2 edges'
    ],
    correctIndex: 1,
    explanation: 'A tree spanning V vertices always contains exactly V - 1 edges with no cycles.',
    relatedPhase: 'INITIAL',
  },
  {
    id: 'q4',
    question: 'What is the overall time complexity of Kruskal’s Algorithm with E edges and V vertices?',
    options: [
      'O(V^2)',
      'O(E log E) or O(E log V)',
      'O(V + E)',
      'O(E^2)'
    ],
    correctIndex: 1,
    explanation: 'Sorting the edges takes O(E log E) time. Union-Find operations take near O(E α(V)) which is dominated by the sorting phase: O(E log E).',
    relatedPhase: 'SORTING',
  },
  {
    id: 'q5',
    question: 'How does Kruskal’s Algorithm handle negative edge weights?',
    options: [
      'It fails and enters an infinite loop',
      'It operates correctly because greedy edge selection works for negative weights in MST',
      'It converts all negative weights to positive numbers',
      'It requires Bellman-Ford preprocessing'
    ],
    correctIndex: 1,
    explanation: 'Unlike Dijkstra’s algorithm for shortest paths, MST algorithms (Kruskal & Prim) correctly find the MST even when edges have negative weights.',
    relatedPhase: 'CHECKING_EDGE',
  },
  {
    id: 'q6',
    question: 'What optimizations make Union-Find operations take amortized O(α(V)) time?',
    options: [
      'Path Compression and Union by Rank/Size',
      'Breadth-First Search and Depth-First Search',
      'Memoization and Dynamic Programming',
      'Hashing and Heapify'
    ],
    correctIndex: 0,
    explanation: 'Path compression flattens the tree structure during Find operations, and Union by Rank keeps tree heights minimal.',
    relatedPhase: 'ACCEPTING_EDGE',
  },
  {
    id: 'q7',
    question: 'What result is produced if Kruskal’s Algorithm is run on a disconnected graph?',
    options: [
      'It crashes with a NullPointerException',
      'A Minimum Spanning Forest (multiple MSTs for each component)',
      'A single MST with extra dummy edges',
      'An empty tree with 0 edges'
    ],
    correctIndex: 1,
    explanation: 'For a disconnected graph with K components, Kruskal’s algorithm selects V - K edges, yielding a Minimum Spanning Forest.',
    relatedPhase: 'DISCONNECTED_ERROR',
  },
];
