---
'status.app': patch
---

fix(status.app): move the news feeds' call-to-action into a `status` namespace. RSS 2.0 rejects an extension element that has none, so `newsLink` and `newsLinkLabel` are now `status:newsLink` and `status:newsLinkLabel`. gofeed reads a namespaced element from `item.Extensions` rather than `item.Custom`, so status-go has to read them from there before this ships.
