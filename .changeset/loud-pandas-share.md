---
'status.app': patch
---

feat(status.app): render bullet and numbered lists in the news RSS feeds. The desktop feed emits `<ul>`/`<ol>` for its rich text view and the mobile feed emits text bullets, keeping its plain text format. Line breaks within a paragraph are preserved, and the call-to-action link is extracted structurally so a link inside a list item cannot replace it.
