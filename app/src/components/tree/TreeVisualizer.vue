<script setup lang="ts">
import { computed } from 'vue'
import { VueFlow, type Node as FlowNode, type Edge as FlowEdge, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import dagre from '@dagrejs/dagre'
import type { TreeNode } from '../../core/trees/types'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const props = defineProps<{ treeData: TreeNode | string | null}>()

const { fitView } = useVueFlow()

function handleNodesInitialized() {
  fitView({ padding: 0.2, duration: 300 })
}

function getLayoutedElements(nodes: FlowNode[], edges: FlowEdge[]) {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80 })

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 120, height: 80 }))
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target))

  dagre.layout(dagreGraph)

  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id)
    return { ...node, position: { x: -pos.x - 60, y: pos.y - 40 } }
  })
}

const treeStructure = computed(() => {
  if (!props.treeData) return { nodes: [], edges: [] }

  let root: TreeNode
  try {
    root = typeof props.treeData === 'string' ? JSON.parse(props.treeData) : props.treeData
  } catch {
    return { nodes: [], edges: [] }
  }

  const rawNodes: FlowNode[] = []
  const rawEdges: FlowEdge[] = []
  let idCounter = 0

  function traverse(node: TreeNode, parentId: string | null = null, edgeLabel: string = '') {
    const currentId = `node_${idCounter++}`
    const isLeaf = !node.left && !node.right
    const displaySymbol = node.symbols === ' ' ? '␣' : node.symbols || '?'

    rawNodes.push({
      id: currentId,
      type: isLeaf ? 'output' : parentId === null ? 'input' : 'default',
      label: `${displaySymbol}\n[${node.code || '•'}]`,
      position: { x: 0, y: 0 },
      class: isLeaf ? 'leaf-node' : 'internal-node'
    })

    if (parentId) {
      rawEdges.push({
        id: `edge_${parentId}_${currentId}`,
        source: parentId,
        target: currentId,
        label: edgeLabel
      })
    }

    if (node.left) traverse(node.left, currentId, '0')
    if (node.right) traverse(node.right, currentId, '1')
  }

  traverse(root)

  return {
    nodes: getLayoutedElements(rawNodes, rawEdges),
    edges: rawEdges
  }
})
</script>

<template>
  <div class="tree-container">
    <div v-if="treeStructure.nodes.length === 0" class="empty-state">
      Нет данных для отображения дерева
    </div>

    <VueFlow 
      v-else
      :nodes="treeStructure.nodes"
      :edges="treeStructure.edges"
      :nodes-connectable="false"
      @nodes-initialized="handleNodesInitialized"
    >
      <Background pattern-color="#cbd5e1" :gap="16" />
      <Controls position="bottom-left" />
    </VueFlow>
  </div>
</template>

<style scoped>
.tree-container {
  width: 100%;
  height: 500px;
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 14px;
}

:deep(.vue-flow__node) {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 12px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  width: 120px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: box-shadow var(--transition), transform var(--transition);
}

:deep(.vue-flow__node:hover) {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

:deep(.internal-node) {
  background: var(--color-bg);
  border-color: var(--color-text-secondary);
  color: var(--color-text);
}

:deep(.leaf-node) {
  background: var(--color-success-bg);
  border-color: var(--color-success);
  color: var(--color-success);
  font-weight: 600;
}

:deep(.vue-flow__edge-path) {
  stroke: var(--color-text-muted);
  stroke-width: 2;
  transition: stroke var(--transition);
}

:deep(.vue-flow__edge:hover .vue-flow__edge-path) {
  stroke: var(--color-primary);
}

:deep(.vue-flow__edge-label) {
  background: var(--color-bg-secondary); 
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

:deep(.vue-flow__controls-button) {
  background: var(--color-bg);
  border-color: var(--color-border);
  color: var(--color-text);
}

:deep(.vue-flow__controls-button:hover) {
  background: var(--color-bg-tertiary);
}

:deep(.vue-flow__background-pattern) {
  stroke: var(--color-border);
}
</style>