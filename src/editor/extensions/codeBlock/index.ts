import type { CodeBlockOptions as TiptapCodeBlockOptions } from '@tiptap/extension-code-block'
import CodeBlock from '@tiptap/extension-code-block'
import type { HighlighterCore, LanguageRegistration, ThemeRegistrationRaw } from 'shiki/core'
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from 'shiki/core'
import css from 'shiki/langs/css.mjs'
import html from 'shiki/langs/html.mjs'
import javascript from 'shiki/langs/javascript.mjs'
import json from 'shiki/langs/json.mjs'
import markdown from 'shiki/langs/markdown.mjs'
import python from 'shiki/langs/python.mjs'
import typescript from 'shiki/langs/typescript.mjs'
import vue from 'shiki/langs/vue.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import { VueNodeViewRenderer, findChildren, findChildrenInRange, getChangedRanges } from '@tiptap/vue-3'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { DecorationAttrs } from '@tiptap/pm/view'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { Node } from '@tiptap/pm/model'
import type { Element } from 'hast'
import EditorCodeBlock from './EditorCodeBlock.vue'

export interface CodeBlockOptions extends TiptapCodeBlockOptions {
  languages: LanguageRegistration[][]
  themes: {
    light: ThemeRegistrationRaw
    dark: ThemeRegistrationRaw
  }
}

export interface CodeBlockStorage {
  highlighter: HighlighterCore
}

export const codeBlock = CodeBlock.extend<CodeBlockOptions, CodeBlockStorage>({
  addOptions() {
    return {
      ...this.parent?.(),
      languages: [css, html, javascript, json, markdown, python, typescript, vue],
      themes: {
        light: vitesseLight,
        dark: vitesseDark,
      },
    }
  },
  addStorage() {
    const highlighter = createHighlighterCoreSync({
      langs: this.options.languages,
      themes: Object.values(this.options.themes),
      engine: createJavaScriptRegexEngine(),
    })

    return {
      highlighter,
    }
  },
  addProseMirrorPlugins() {
    const getDecorations = (doc: Node) => {
      const decorations: Decoration[] = []

      findChildren(doc, node => node.type.name === this.name).forEach(({ node, pos }) => {
        const language = node.attrs.language ?? 'text'
        const hast = this.storage.highlighter.codeToHast(node.textContent, {
          lang: language,
          themes: this.options.themes,
        })

        const preNode = hast.children[0] as Element
        decorations.push(Decoration.node(pos, pos + node.nodeSize, preNode.properties as DecorationAttrs))

        let from = pos + 1
        const lines = (preNode.children[0] as Element).children
        for (const line of lines) {
          if ((line as Element).children?.length) {
            let lineFrom = from
            // @ts-expect-error line type
            line.children?.forEach((node) => {
              const nodeLen = node.children[0].value.length
              decorations.push(Decoration.inline(lineFrom, lineFrom + nodeLen, (node as Element).properties as DecorationAttrs))
              lineFrom += nodeLen
            })

            // prosemirror do not support add wrap for line
            // decorations.push(Decoration.inline(from, lineFrom, line.properties as DecorationAttrs))
            from = lineFrom
          }
          else if (line.type === 'text') {
            from += line.value.length
          }
        }
      })

      return DecorationSet.create(doc, decorations)
    }

    return [
      new Plugin({
        key: new PluginKey(this.name),
        state: {
          init(_, { doc }) {
            return getDecorations(doc)
          },
          apply: (tr, value, _, { doc: newDoc }) => {
            if (!tr.docChanged) {
              return value.map(tr.mapping, tr.doc)
            }

            const changedRanges = getChangedRanges(tr)
            let hasChangedCodeBlock = false
            for (const range of changedRanges) {
              hasChangedCodeBlock = !!findChildrenInRange(newDoc, range.newRange, node => node.type.name === this.name).length

              if (hasChangedCodeBlock) {
                return getDecorations(newDoc)
              }
            }

            return value.map(tr.mapping, tr.doc)
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(EditorCodeBlock)
  },
})
