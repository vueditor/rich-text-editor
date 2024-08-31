import type { GlobalAttributes } from '@tiptap/core'
import { Extension, combineTransactionSteps, findChildrenInRange, getChangedRanges } from '@tiptap/core'
import { nanoid } from 'nanoid'
import type { Transaction } from '@tiptap/pm/state'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { isBlockNodeExtension } from '@/editor/utils/judge'

export const symbol = Extension.create({
  name: 'symbol',
  addGlobalAttributes() {
    return [
      ...genBlockNodesGlobalAttributes(this.extensions as Extension[]),
    ]
  },
  onCreate() {
    const dispatch = this.editor.view.dispatch
    const { tr, doc } = this.editor.view.state

    doc.descendants((node, pos) => {
      if (!node.isText && !node.attrs.id) {
        tr.setNodeAttribute(pos, 'id', nanoid())
      }
    })

    dispatch(tr)
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('symbol'),
        appendTransaction(trs, { doc: oldDoc }, { doc: newDoc, tr }) {
          if (!trs.find(tr => tr.docChanged) || newDoc.eq(oldDoc)) {
            return
          }

          const transform = combineTransactionSteps(oldDoc, trs as Transaction[])
          getChangedRanges(transform).forEach(({ newRange }) => {
            const newNodes = findChildrenInRange(newDoc, newRange, node => !node.isText)
            const nodeIds = new Set<string>()

            newNodes.forEach(({ node, pos }) => {
              if (!node.attrs.id) {
                tr.setNodeAttribute(pos, 'id', nanoid())
                return
              }

              if (nodeIds.has(node.attrs.id)) {
                tr.setNodeAttribute(pos, 'id', nanoid())
                return
              }

              nodeIds.add(node.attrs.id)
            })
          })

          return tr
        },
      }),
    ]
  },
})

function genBlockNodesGlobalAttributes(extensions: Extension[]) {
  return extensions.filter((ext) => {
    return isBlockNodeExtension(ext) || (!!ext.parent && isBlockNodeExtension(ext.parent))
  }).map(ext => ({
    types: [ext.name],
    attributes: {
      name: {
        default: ext.name,
        renderHTML(attributes) {
          return {
            'data-name': attributes.name,
          }
        },
        parseHTML(element) {
          return element.getAttribute('data-name')
        },
      },
      id: {
        default: null,
        renderHTML(attributes) {
          return {
            'data-id': attributes.id,
          }
        },
        parseHTML(element) {
          return element.getAttribute('data-id')
        },
      },
    },
  })) as GlobalAttributes
}
