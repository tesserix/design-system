import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  icon?: string
}

export interface TreeViewProps {
  /** Tree data */
  data: TreeNode[]
  /** Initially expanded node IDs */
  defaultExpandedIds?: string[]
  /** Callback when node is pressed */
  onNodePress?: (node: TreeNode) => void
  /** Callback when node is expanded/collapsed */
  onToggle?: (nodeId: string, isExpanded: boolean) => void
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

interface TreeNodeItemProps {
  node: TreeNode
  level: number
  expandedIds: Set<string>
  onToggle: (nodeId: string) => void
  onNodePress?: (node: TreeNode) => void
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  level,
  expandedIds,
  onToggle,
  onNodePress,
}) => {
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = node.children && node.children.length > 0

  const nodeContainerStyle: ViewStyle = {
    marginLeft: level * spacing[4],
  }

  const nodeRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: 4,
  }

  const iconStyle: TextStyle = {
    fontSize: fontSize.sm,
    marginRight: spacing[2],
    width: 16,
    color: '#6b7280',
  }

  const labelStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#374151',
    flex: 1,
  }

  return (
    <View style={nodeContainerStyle}>
      <TouchableOpacity
        style={nodeRowStyle}
        onPress={() => {
          if (hasChildren) {
            onToggle(node.id)
          }
          onNodePress?.(node)
        }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${node.label}${hasChildren ? (isExpanded ? ', expanded' : ', collapsed') : ''}`}
        accessibilityState={{ expanded: hasChildren ? isExpanded : undefined }}
      >
        {hasChildren ? (
          <Text style={iconStyle}>{isExpanded ? '▼' : '▶'}</Text>
        ) : (
          <View style={{ width: 16, marginRight: spacing[2] }} />
        )}
        {node.icon && (
          <Text style={{ fontSize: fontSize.base, marginRight: spacing[2] }}>{node.icon}</Text>
        )}
        <Text style={labelStyle}>{node.label}</Text>
      </TouchableOpacity>

      {isExpanded && hasChildren && (
        <View>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onNodePress={onNodePress}
            />
          ))}
        </View>
      )}
    </View>
  )
}

/**
 * TreeView component - Collapsible hierarchical tree structure
 *
 * @example
 * ```tsx
 * <TreeView
 *   data={[
 *     {
 *       id: '1',
 *       label: 'Parent',
 *       children: [
 *         { id: '1-1', label: 'Child 1' },
 *         { id: '1-2', label: 'Child 2' }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export const TreeView: React.FC<TreeViewProps> = ({
  data,
  defaultExpandedIds = [],
  onNodePress,
  onToggle,
  style,
  testID,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))

  const handleToggle = (nodeId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
        onToggle?.(nodeId, false)
      } else {
        newSet.add(nodeId)
        onToggle?.(nodeId, true)
      }
      return newSet
    })
  }

  const containerStyle: ViewStyle = {
    padding: spacing[2],
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="list"
      accessibilityLabel="Tree view"
    >
      {data.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          level={0}
          expandedIds={expandedIds}
          onToggle={handleToggle}
          onNodePress={onNodePress}
        />
      ))}
    </View>
  )
}

TreeView.displayName = 'TreeView'
