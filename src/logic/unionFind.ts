import type { UnionFindSnapshot } from '../types/graph';

export class UnionFind {
  private parent: Record<string, string> = {};
  private rank: Record<string, number> = {};
  private nodes: string[] = [];

  constructor(elements: string[]) {
    this.nodes = [...elements];
    for (const node of elements) {
      this.parent[node] = node;
      this.rank[node] = 0;
    }
  }

  // Find root with path compression
  find(i: string): string {
    if (!this.parent[i]) {
      this.parent[i] = i;
      this.rank[i] = 0;
      return i;
    }
    if (this.parent[i] === i) {
      return i;
    }
    // Path compression
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  // Union by rank
  union(i: string, j: string): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ) {
      return false; // Already in same set (cycle)
    }

    // Union by rank
    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI] += 1;
    }

    return true;
  }

  // Check if connected
  connected(i: string, j: string): boolean {
    return this.find(i) === this.find(j);
  }

  // Get nodes sharing the same root set as a given node
  getComponentOf(node: string): string[] {
    const root = this.find(node);
    return this.nodes.filter(n => this.find(n) === root);
  }

  // Get current state snapshot for visualizer
  getSnapshot(): UnionFindSnapshot {
    const sets: Record<string, string[]> = {};
    
    for (const node of this.nodes) {
      const root = this.find(node);
      if (!sets[root]) {
        sets[root] = [];
      }
      sets[root].push(node);
    }

    return {
      parent: { ...this.parent },
      rank: { ...this.rank },
      sets,
    };
  }
}
