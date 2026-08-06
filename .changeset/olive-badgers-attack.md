---
'status.app': patch
---

fix(status.app): escape the desktop news feed's markup. RSS 2.0 defines `description` as character data, so the markup is no longer served as child elements of it. status-go decodes the element with gofeed before the client sees it, so the markup that arrives is unchanged.
