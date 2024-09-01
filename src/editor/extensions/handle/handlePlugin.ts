import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { debounce } from 'lodash-es'
import { computePosition, offset } from '@floating-ui/dom'
import { isMacOS } from '@tiptap/core'

interface HandleState {
  pos: number
}

interface HandlePluginOptions {
  element: HTMLElement
}

export const handlePluginKey = new PluginKey<HandleState>('handle')

const onMouseoverDebounce = debounce((view: EditorView, e: MouseEvent) => {
  const targetPos = view.posAtDOM(e.target as HTMLElement, 0)
  if (!targetPos) {
    return
  }

  const newPos = view.state.doc.resolve(targetPos).start(1)
  view.dispatch(view.state.tr.setMeta(handlePluginKey, {
    pos: newPos,
  }))
}, 100)
const onMouseleaveDebounce = debounce((view: EditorView, e: MouseEvent) => {
  const editorHandle = document.getElementById('editor-handle')
  if (editorHandle?.contains(e.relatedTarget as HTMLElement)) {
    const tr = view.state.tr
    tr.deleteSelection()
    view.state.applyTransaction(tr)

    return
  }

  view.dispatch(view.state.tr.setMeta(handlePluginKey, {
    pos: 0,
  }))
}, 50)

interface HandleViewOptions {
  editorView: EditorView
  handleElement: HTMLElement
  handlePluginKey: PluginKey
}
export class HandleView {
  public editorView: EditorView
  public handleElement: HTMLElement
  public handleBarElement: HTMLElement | null
  public handlePluginKey: PluginKey

  onDragStart = (e: DragEvent) => {
    if (!this.getTargetDom() || !this.getTargetPos()) {
      return
    }

    const nodeBox = this.getTargetDom()!.getBoundingClientRect()
    const handleBox = this.handleElement.getBoundingClientRect()

    const x = handleBox.x - nodeBox.x + e.offsetX
    const y = handleBox.y - nodeBox.y + e.offsetY
    e.dataTransfer?.setDragImage(this.getTargetDom()!, x, y)

    const selection = NodeSelection.create(this.editorView.state.doc, this.getTargetPos()! - 1)
    const transaction = this.editorView.state.tr.setSelection(selection)
    this.editorView.dispatch(transaction)

    this.editorView.dragging = {
      slice: selection.content(),
      move: !e[isMacOS() ? 'altKey' : 'ctrlKey'],
    }
  }

  constructor(options: HandleViewOptions) {
    this.editorView = options.editorView
    this.handleElement = options.handleElement
    this.handleBarElement = this.handleElement.querySelector('#drag-id')
    this.handlePluginKey = options.handlePluginKey

    this.handleElement?.addEventListener('dragstart', this.onDragStart)
  }

  getTargetPos() {
    return (this.handlePluginKey.getState(this.editorView.state)?.pos ?? null) as number | null
  }

  getTargetDom() {
    const pos = this.getTargetPos()
    if (!pos) {
      return null
    }

    return this.editorView.nodeDOM(pos - 1) as HTMLElement
  }

  updatePosition(targetDom: HTMLElement) {
    computePosition(targetDom, this.handleElement, {
      placement: 'left-start',
      strategy: 'fixed',
      middleware: [offset(8)],
    }).then(({ x, y }) => {
      Object.assign(this.handleElement.style, {
        transform: `translateX(${x}px) translateY(${y}px)`,
      })
    })
  }

  update() {
    const targetDom = this.getTargetDom()

    if (targetDom) {
      this.updatePosition(targetDom as HTMLElement)
    }
    else if (!this.getTargetPos() && !!this.handleElement) {
      Object.assign(this.handleElement.style, {
        transform: 'translateY(-64px)',
      })
    }
  }

  destroy() {
    this.handleElement.removeEventListener('dragstart', this.onDragStart)
  }
}

export function handlePlugin(options: HandlePluginOptions) {
  const plugin = new Plugin({
    key: handlePluginKey,
    state: {
      init() {
        return {
          pos: 0,
        }
      },
      apply(tr, value) {
        const newState = tr.getMeta(handlePluginKey)
        if (!newState) {
          return value
        }

        return {
          ...value,
          ...newState,
        }
      },
    },
    props: {
      handleDOMEvents: {
        mouseover(view, e) {
          onMouseoverDebounce(view, e)
        },
        mouseleave(view, e) {
          onMouseleaveDebounce(view, e)
        },
      },

    },
    view(view) {
      return new HandleView({
        editorView: view,
        handleElement: options.element,
        handlePluginKey,
      })
    },
  })

  return plugin
}
