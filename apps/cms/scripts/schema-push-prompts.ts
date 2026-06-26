const schemaConflictPromptPattern =
  /Is [\s\S]* (?:table|column|schema) created or renamed from another (?:table|column|schema)\?/

const promptSubmittedPattern =
  /(?:will be created|will be renamed|will be renamed\/moved|all .* conflicts resolved)/

export interface AutoSubmitState {
  lastSubmissionAt: number
  pendingPrompt: boolean
}

export interface SchemaPushAutomationEnv {
  NODE_ENV?: string
  VERCEL?: string
  VERCEL_ENV?: string
}

export const createAutoSubmitState = (): AutoSubmitState => ({
  lastSubmissionAt: 0,
  pendingPrompt: false,
})

export const isLocalSchemaPushAutomationAllowed = (
  env: SchemaPushAutomationEnv
): boolean => env.NODE_ENV !== 'production' && !env.VERCEL && !env.VERCEL_ENV

export const shouldSubmitDefaultSchemaChoice = (
  output: string,
  state: AutoSubmitState,
  now = Date.now()
): boolean => {
  if (promptSubmittedPattern.test(output)) {
    state.pendingPrompt = false
  }

  if (!schemaConflictPromptPattern.test(output)) {
    return false
  }

  if (state.pendingPrompt && now - state.lastSubmissionAt < 1000) {
    return false
  }

  state.pendingPrompt = true
  state.lastSubmissionAt = now

  return true
}
