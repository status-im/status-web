import type { ZodTypeAny } from 'zod'

/**
 * Registry for `CustomSection` payload shapes.
 *
 * `CustomSection` is the escape hatch for one-off page sections that do not
 * fit any of the typed `PageSection` variants. The page schema accepts the
 * payload as `unknown`; loaders look the `customSchemaId` up in this registry
 * and parse the payload against the registered Zod schema.
 *
 * A custom section that is not registered fails validation at load time with
 * a readable error.
 *
 * Phase 1 ships an empty registry. Each new custom section is registered via
 * `registerCustomSection(id, schema)` from app or feature code (typically at
 * loader bootstrap), keeping unrelated section shapes out of this package.
 */
const registry = new Map<string, ZodTypeAny>()

export const registerCustomSection = (id: string, schema: ZodTypeAny): void => {
  if (registry.has(id)) {
    throw new Error(`custom section schema "${id}" is already registered`)
  }
  registry.set(id, schema)
}

export const getCustomSectionSchema = (id: string): ZodTypeAny | undefined => {
  return registry.get(id)
}

/**
 * Test-only helper. Production code should not unregister schemas at runtime.
 */
export const __resetCustomSectionRegistryForTests = (): void => {
  registry.clear()
}
