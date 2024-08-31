import type { Extension, Node } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { EXTENSION_TYPE, NODE_GROUP } from './constants'

export const isNodeExtension = (ext: Extension) => ext.type === EXTENSION_TYPE.NODE

export const isBlockNodeExtension = (ext: Extension) => isNodeExtension(ext) && ((ext as Node).config.group as string)?.includes(NODE_GROUP.BLOCK)

export const isBlockNode = (node: ProseMirrorNode) => node.type.spec.group?.includes(NODE_GROUP.BLOCK)
