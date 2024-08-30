import type { GlobalAttributes, Mark, Node } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { EXTENSION_TYPE, NODE_GROUP } from '@/editor/utils/constants'

export const metadata = Extension.create({
  name: 'metadata',
  addGlobalAttributes() {
    return [
      ...genBlockNodesGlobalAttributes(this.extensions),
    ]
  },
})

function isBlockNodeExtension(ext: Node | Mark) {
  return ext.type === EXTENSION_TYPE.NODE && ext.config.group === NODE_GROUP.BLOCK
}
function genBlockNodesGlobalAttributes(extensions: (Node | Mark)[]) {
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
    },
  })) as GlobalAttributes
}
