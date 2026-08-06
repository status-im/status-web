---
'status.app': patch
---

feat(status.app): serve the reworked news feeds under `/v2`. `/desktop-news/rss/v2` and `/mobile-news/rss/v2` carry the lists, the body links, the escaping fixes and the namespaced call-to-action, while `/desktop-news/rss` and `/mobile-news/rss` keep serving the rendering the shipped clients were built against.
