<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import {
  VueFlow,
  type Node as FlowNode,
  type Edge as FlowEdge,
  useVueFlow
} from '@vue-flow/core'

import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'

import dagre from '@dagrejs/dagre'
import type { TreeNode } from '../../core/trees/types'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const props = defineProps<{
  treeData: TreeNode | string | null
}>()

const nodesDraggable = ref(false)
const { fitView } = useVueFlow()

const isMobile = ref(false)

const updateResolution = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateResolution()
  window.addEventListener('resize', updateResolution)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateResolution)
})

const nodeHeight = computed(() => isMobile.value ? 38 : 46)

function handleNodesInitialized() {
  fitView({
    padding: isMobile.value ? 0.1 : 0.2,
    duration: 300,
  })
}

function getLayoutedElements(
  nodes: FlowNode[],
  edges: FlowEdge[],
) {
  const dagreGraph = new dagre.graphlib.Graph()

  dagreGraph.setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: isMobile.value ? 25 : 35,
    ranksep: isMobile.value ? 45 : 40,
  })

  nodes.forEach((node) => {
    const currentWidth = node.data?.width || (isMobile.value ? 90 : 100)
    dagreGraph.setNode(node.id, {
      width: currentWidth,
      height: nodeHeight.value,
    })
  })

  edges.forEach((edge) =>
    dagreGraph.setEdge(edge.source, edge.target),
  )

  dagre.layout(dagreGraph)

  return nodes.map((node) => {
    const pos = dagreGraph.node(node.id)
    const currentWidth = node.data?.width || (isMobile.value ? 90 : 100)

    return {
      ...node,
      position: {
        x: -pos.x + currentWidth / 2,
        y: pos.y - nodeHeight.value / 2,
      },
    }
  })
}

const treeStructure = computed(() => {
  if (!props.treeData) {
    return { nodes: [], edges: [] }
  }

  let root: TreeNode

  try {
    root =
      typeof props.treeData === 'string'
        ? JSON.parse(props.treeData)
        : props.treeData
  } catch {
    return { nodes: [], edges: [] }
  }

  const rawNodes: FlowNode[] = []
  const rawEdges: FlowEdge[] = []

  let idCounter = 0

  function traverse(
    node: TreeNode,
    parentId: string | null = null,
    edgeLabel = '',
  ) {
    const currentId = `node_${idCounter++}`
    const isLeaf = !node.left && !node.right

    const displaySymbol =
      node.symbols === ' '
        ? '_'
        : node.symbols || '?'

    const maxWidth = isMobile.value ? 200 : 300
    const charWidth = isMobile.value ? 8 : 10  
    const padding = isMobile.value ? 20 : 32 
    
    let calculatedWidth = padding + displaySymbol.length * charWidth

    if (isLeaf && displaySymbol.length === 1) {
      calculatedWidth = nodeHeight.value
    }

    calculatedWidth = Math.min(maxWidth, Math.max(nodeHeight.value, calculatedWidth))

    rawNodes.push({
      id: currentId,
      type: isLeaf
        ? 'output'
        : parentId === null
          ? 'input'
          : 'default',

      label: '',
      position: { x: 0, y: 0 },

      class: isLeaf
        ? 'leaf-node'
        : 'internal-node',

      style: {
        width: `${calculatedWidth}px`,
        height: `${nodeHeight.value}px`,
        borderRadius: isLeaf && calculatedWidth === nodeHeight.value ? '50%' : '6px'
      },

      data: {
        symbol: displaySymbol,
        code: node.code || '•',
        width: calculatedWidth,
      },
    })

    if (parentId) {
      rawEdges.push({
        id: `edge_${parentId}_${currentId}`,
        source: parentId,
        target: currentId,
        label: edgeLabel,
        type: 'default',
        labelBgPadding: [2, 2],
        labelBgBorderRadius: 4,
      })
    }

    if (node.left) {
      traverse(node.left, currentId, '0')
    }

    if (node.right) {
      traverse(node.right, currentId, '1')
    }
  }

  traverse(root)

  return {
    nodes: getLayoutedElements(
      rawNodes,
      rawEdges,
    ),
    edges: rawEdges,
  }
})
</script>

<template>
  <div class="tree-container">
    <div
      v-if="treeStructure.nodes.length === 0"
      class="empty-state"
    >
      Нет данных для отображения дерева
    </div>

    <VueFlow
      v-else
      :key="isMobile ? 'mobile' : 'desktop'"
      :nodes="treeStructure.nodes"
      :edges="treeStructure.edges"
      :nodes-connectable="false"
      v-model:nodes-draggable="nodesDraggable"
      @nodes-initialized="handleNodesInitialized"
    >
      <template #node-default="nodeProps">
        <div class="node-content">
          <span class="node-symbol">
            {{ nodeProps.data.symbol }}
          </span>
          <span class="node-code internal-code">
            {{ nodeProps.data.code }}
          </span>
        </div>
      </template>

      <template #node-input="nodeProps">
        <div class="node-content">
          <span class="node-symbol">
            {{ nodeProps.data.symbol }}
          </span>
        </div>
      </template>

      <template #node-output="nodeProps">
        <div class="node-content">
          <span class="node-symbol">
            {{ nodeProps.data.symbol }}
          </span>
          <span class="node-code leaf-code">
            {{ nodeProps.data.code }}
          </span>
        </div>
      </template>

      <Background
        pattern-color="#cbd5e1"
        :gap="16"
      />

      <Controls position="bottom-left" />
    </VueFlow>
  </div>
</template>

<style scoped>
.tree-container {
  width: 100%;
  height: 600px;
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-secondary);
}

@media (max-width: 767px) {
  .tree-container {
    height: 400px;
  }

  :deep(.vue-flow__node) {
    font-size: 13px !important;
    padding: 2px !important;
  }

  :deep(.vue-flow__edge-text) {
    font-size: 11px;
    font-weight: 400;
  }
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
  box-sizing: border-box !important;
  white-space: nowrap;
  overflow: visible !important; 
  padding: var(--spacing-sm);
  font-family: var(--font-mono);
  font-size: 14px;
  box-shadow: var(--shadow-sm);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition:
    box-shadow var(--transition),
    transform var(--transition);
}

:deep(.internal-node) {
  background: var(--color-bg);
  border-color: var(--color-text-secondary);
  color: var(--color-text);
  border-radius: 6px;
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

:deep(.vue-flow__edge-textbg) {
  fill: var(--color-bg-secondary) !important;
}

:deep(.vue-flow__edge-text) {
  fill: var(--color-text-secondary) !important;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
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

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative; 
}

.node-symbol {
  font-size: 14px;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 85%; 
}

.node-code {
  position: absolute;
  bottom: -11px; 
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 5px;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono);
  line-height: 1;
  letter-spacing: 0.5px;
  border: 1px solid var(--color-bg); 
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.leaf-code {
  color: #fff;
  background: var(--color-success);
}

.internal-code {
  color: var(--color-bg);
  background: var(--color-text-secondary, #64748b);
}

@media (max-width: 767px) {
  .node-symbol {
    font-size: 12px;
  }

  .node-code {
    font-size: 9px;
  }
}
</style>