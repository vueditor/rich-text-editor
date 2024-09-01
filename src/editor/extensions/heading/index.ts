import type { Level } from '@tiptap/extension-heading'
import tiptapHeading from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/vue-3'

export const heading = tiptapHeading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3] as Level[],
    }
  },
  parseHTML() {
    return this.options.levels
      .map((level: Level) => ({
        tag: `h${level + 1}`,
        attrs: { level },
      }))
  },
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level = hasLevel
      ? node.attrs.level
      : this.options.levels[0]

    return [`h${level + 1}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})
