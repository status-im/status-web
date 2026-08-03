---
'status.app': patch
---

fix(status.app): escape the values Ghost supplies to the news RSS feeds. Their CDATA wrappers are dropped on parse, so an unescaped `&` in a title was re-served as invalid XML.
