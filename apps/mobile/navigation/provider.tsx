import { NavigationContainer } from '@react-navigation/native'

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <NavigationContainer>{children}</NavigationContainer>
}
