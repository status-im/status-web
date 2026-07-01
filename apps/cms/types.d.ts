// Payload's CSS export points at a `.css` file with no `types` field, so
// strict TypeScript rejects the side-effect import in (payload)/layout.tsx
// without an ambient declaration. The runtime/bundler resolves the export
// correctly — this is purely a type-checker shim.
declare module '@payloadcms/next/css'
