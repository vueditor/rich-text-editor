import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { debounce } from 'lodash-es'
import { computePosition, offset } from '@floating-ui/dom'
import { isMacOS } from '@tiptap/core'
import { META_KEYS, UI_EVENTS } from '@/editor/utils/constants'

interface HandleState {
  // editor left & right x pos
  minX: number
  maxX: number

  // mouse coordinate
  x: number | null
  y: number | null

  // pos for current target node
  pos: number | null
}

interface HandlePluginOptions {
  element: HTMLElement
}

export const handlePluginKey = new PluginKey<HandleState>('handle')

const onMouseenterDebounce = debounce((view: EditorView) => {
  const editorDom = view.dom
  const { x, width } = editorDom.getBoundingClientRect()
  view.dispatch(view.state.tr.setMeta(handlePluginKey, {
    minX: x,
    maxX: x + width,
    pos: null,
  }))
}, 10)
const onMousemoveDebounce = debounce((view: EditorView, e: MouseEvent) => {
  view.dispatch(view.state.tr.setMeta(handlePluginKey, {
    x: e.clientX,
    y: e.clientY,
    pos: null,
  }))
}, 10)
const onMouseleaveDebounce = debounce((view: EditorView, e: MouseEvent) => {
  const toDom = e.relatedTarget as HTMLElement
  const handleDom = document.getElementById('editor-handle')
  if (handleDom?.isEqualNode(toDom) || handleDom?.contains(toDom)) {
    return
  }

  view.dispatch(view.state.tr.setMeta(handlePluginKey, {
    x: null,
    y: null,
    pos: null,
  }))
}, 10)

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
    if (!this.editorView.editable) {
      return
    }

    const state = this.handlePluginKey.getState(this.editorView.state) as HandleState | undefined
    if (!state) {
      return null
    }

    if (state?.pos) {
      const { node } = this.editorView.domAtPos(state.pos)
      const { x, y } = (node as HTMLElement).getBoundingClientRect()

      this.editorView.dispatch(this.editorView.state.tr.setMeta(handlePluginKey, {
        x,
        y,
        pos: null,
      }))

      return state.pos
    }

    const { x, y, minX, maxX } = state
    const left = Math.min(Math.max(x!, minX), maxX)
    const top = y
    if (Number.isNaN(left) || Number.isNaN(top)) {
      return null
    }

    const posInfo = this.editorView.posAtCoords({
      left,
      top: top!,
    })
    if (!posInfo) {
      return null
    }

    const { pos } = posInfo

    return this.editorView.state.doc.resolve(pos).start(1)
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
    else if (this.handleElement) {
      let transform = this.handleElement.style.transform
      if (transform) {
        transform = transform.replace(/translateY\(.+\)/, 'translateY(-128px)')
      }
      else {
        transform = 'translateY(-128px)'
      }

      Object.assign(this.handleElement.style, {
        transform,
      })
    }
  }

  destroy() {
    this.handleElement.removeEventListener('dragstart', this.onDragStart)
  }
}

export function handlePlugin(options: HandlePluginOptions) {
  const plugin = new Plugin<HandleState>({
    key: handlePluginKey,
    state: {
      init() {
        return {
          minX: 0,
          maxX: Number.MAX_SAFE_INTEGER,
          x: null,
          y: null,
          pos: null,
        }
      },
      apply(tr, value) {
        const newState = Object.assign({}, value, tr.getMeta(handlePluginKey))
        const isDrop = tr.getMeta(META_KEYS.UI_EVENT) === UI_EVENTS.DROP

        if (isDrop) {
          const nodeSelection = tr.selection as NodeSelection
          newState.pos = nodeSelection.anchor + 1
        }

        return newState
      },
    },
    props: {
      handleDOMEvents: {
        mouseenter(view) {
          onMouseenterDebounce(view)
        },

        mousemove(view, e) {
          onMousemoveDebounce(view, e)
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
