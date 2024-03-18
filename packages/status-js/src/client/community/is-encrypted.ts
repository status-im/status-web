import {
  type CommunityDescription,
  CommunityTokenPermission_Type,
} from '../../protos/communities_pb'

export function isEncrypted(
  tokenPermissions: CommunityDescription['tokenPermissions']
): boolean {
  return Object.values(tokenPermissions).some(
    permission =>
      permission.type === CommunityTokenPermission_Type.BECOME_MEMBER
  )
}
