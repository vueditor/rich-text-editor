import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import EditorImage from './EditorImage.vue'

export const image = Image.extend({
  group: 'block',
  inline: false,
  draggable: false,
  atom: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        rendered: true,
        renderHTML(attributes) {
          return {
            width: attributes.width,
          }
        },
        parseHTML(element) {
          const width = element.getAttribute('width')

          if (!width) {
            return 200
          }

          return Math.max(Number(width), 200)
        },
      },
    }
  },
  addNodeView() {
    return VueNodeViewRenderer(EditorImage)
  },
})
