---
'status.app': patch
---

fix(status.app): escape the values Ghost supplies to the news RSS feeds. Their CDATA wrappers are dropped on parse, so an unescaped `&` in a title or in the channel description was re-served as invalid XML. Ghost's HTML entities are resolved to their characters too, since names such as `&nbsp;` are undefined in XML and cost the whole feed rather than one character.
