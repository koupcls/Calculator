import type { TreeNode } from "./types";

export abstract class Tree {
    protected root: TreeNode
    protected codes: Record<string, string> | null

    constructor(frequencies: Record<string, number>) {
        if (Object.keys(frequencies).length === 0) {
            throw new Error('Frequencies map cannot be empty')
        }

        this.root = {code: '', symbols: '', left: null, right: null}

        this.buildTree(this.root, Object.entries(frequencies).sort((a,b) => b[1] - a[1]))
        this.generateCodes(this.root, '')
        this.codes = this.toMap()
    }

    private generateCodes(node: TreeNode, code: string): void {
        if (node === null) {
            return;
        }

        node.code = code;

        if (node.left === null && node.right === null) {
            return;
        }

        this.generateCodes(node.left!, code + '0')
        this.generateCodes(node.right!, code + '1')
    }

    public toMap(): Record<string, string> {

        const table: Record<string, string> = {}

        const stack: TreeNode[] = []
        stack.push(this.root)

        while(stack.length > 0) {
            const node: TreeNode = stack.pop()!
            
            if (!node) continue;
            if (node.left === null && node.right === null) {
                table[node.symbols[0]] = node.code
            }

            if (node.right !== null) stack.push(node.right)
            if (node.left !== null) stack.push(node.left)
        }

        return table
    }

    public toJson(): string {
        if (this.root === null) {
            throw new Error('Cannot serialize an empty tree');
        }
        
        return JSON.stringify(this.root, null, 2);
    }

    protected abstract buildTree(root: TreeNode, frequencies: [string, number][]): void
}
