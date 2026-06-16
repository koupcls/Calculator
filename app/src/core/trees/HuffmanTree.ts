import { Tree } from "./Tree";
import type { TreeNode } from "./types";
import { TreePriorityQueue as PriorityQueue } from "../utils/PriorityQueue";


export class HuffmanTree extends Tree {

    protected buildTree(_root: TreeNode, frequencies: [string, number][]): void {
        const queue = new PriorityQueue()

        for (const [symbol, count] of frequencies.reverse()) {
            const node: TreeNode = {
                code: '',
                symbols: symbol,
                left: null,
                right: null
            }

            queue.add({node: node, weight: count})
        }
        
        while (queue.size !== 1) {
            console.log(queue.list)
            let first = queue.poll()!
            let second = queue.poll()!


            if (first.weight == second.weight) {
                const temp = first
                first = second
                second = temp
            }

            let parentNode: TreeNode = {
                code: '',
                symbols: first.node.symbols + second.node.symbols, 
                left: first.node,
                right: second.node
            };

            queue.set({node: parentNode, weight: first?.weight + second?.weight}, Math.min(first.idx!, second.idx!))
        }

        this.root = queue.poll()!.node
    }
}