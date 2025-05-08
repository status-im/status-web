import { FEATURE_FLAGS, type FeatureFlag } from '../_lib/feature-flags'

export const FeatureEnabled = ({
  featureFlag,
  children,
}: {
  featureFlag: FeatureFlag
  children: React.ReactNode
}) => {
  if (!isFeatureEnabled(featureFlag)) {
    return null
  }

  return children
}

export function isFeatureEnabled(featureFlag: FeatureFlag) {
  return FEATURE_FLAGS[featureFlag]
}
