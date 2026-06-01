import type { TreeNode } from "../trees/types";

interface QueueEntry {
    node: TreeNode;
    weight: number;
}

export class TreePriorityQueue {
    private items: QueueEntry[] = [];

    public add(entry: QueueEntry): void {
        this.items.push(entry);
        this.items.sort((a, b) => a.weight - b.weight);
    }

    public poll(): QueueEntry | undefined {
        return this.items.shift();
    }

    public get size(): number {
        return this.items.length;
    }
}