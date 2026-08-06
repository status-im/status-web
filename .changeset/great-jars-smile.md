---
'status.app': patch
---

feat(status.app): keep body links in the desktop news feed. An anchor in a paragraph or a list item is emitted as `<a href>` instead of being flattened to its label, with the href escaped. The mobile feed keeps the label alone, since plain text cannot carry a link, and the call-to-action is still lifted out of the body.
