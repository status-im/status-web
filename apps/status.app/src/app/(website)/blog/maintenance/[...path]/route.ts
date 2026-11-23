import { blogMaintenanceResponse } from '../../_utils/maintenance-response'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return blogMaintenanceResponse((await params).path)
}
