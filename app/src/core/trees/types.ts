export interface TreeNode {
    code: string
    symbols: string | ''
    left: TreeNode | null
    right: TreeNode | null
}