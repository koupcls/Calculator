import { Tree } from "./Tree";
import type { TreeNode } from "./types";

export class ShanonFanoTree extends Tree {

    protected buildTree(root: TreeNode, sortedFrequencies: [string, number][]): void {
        this.shannonFanoRecursive(root, sortedFrequencies);
    }

    private shannonFanoRecursive(node: TreeNode, frequencies: [string, number][]): void {
        if (frequencies.length <= 1) {
            if (frequencies.length === 1) {
                node.symbols = frequencies[0][0];
            }
            return;
        }

        const totalFrequency = frequencies.reduce((sum, [_, val]) => sum + val, 0);
        const halfFrequency = totalFrequency / 2;

        let currentFrequency = 0;
        let splitIndex = 0;

        if (frequencies.length === 2) {
            splitIndex = 1;
        } else {

            for (const [_, value] of frequencies) {
                currentFrequency += value;
                splitIndex++;

                if (currentFrequency >= halfFrequency) {
                    const difA = currentFrequency - halfFrequency;
                    const difB = value - difA;

                    if (difA > difB) {
                        splitIndex--;
                    }
                    break;
                }
            }
        }

        node.left = { code: node.code + '0', symbols: '', left: null, right: null };
        node.right = { code: node.code + '1', symbols: '', left: null, right: null };

        const leftSide = frequencies.slice(0, splitIndex);
        const rightSide = frequencies.slice(splitIndex);

        node.left.symbols = leftSide.map(([sym]) => sym).join('');
        node.right.symbols = rightSide.map(([sym]) => sym).join('');
        node.symbols = node.left.symbols + node.right.symbols;

        this.shannonFanoRecursive(node.left, leftSide);
        this.shannonFanoRecursive(node.right, rightSide);
    }
}
