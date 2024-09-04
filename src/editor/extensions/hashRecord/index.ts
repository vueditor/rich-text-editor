import type { JSONContent } from '@tiptap/vue-3'
import { Extension } from '@tiptap/vue-3'

interface HashRecord {
  doc: JSONContent
}

export const hashRecord = Extension.create({
  name: 'hashRecord',
  onCreate() {
    const hash = location.hash.slice(1)
    if (!hash) {
      return
    }

    const record = destr<HashRecord>(unzipStr(hash))
    if (!record) {
      return
    }

    const { doc } = record

    this.editor.chain().setContent(doc).run()
  },
  onBlur() {
    const doc = this.editor.getJSON()
    const record: HashRecord = {
      doc,
    }

    location.hash = `#${zipStr(JSON.stringify(record))}`
  },
})
