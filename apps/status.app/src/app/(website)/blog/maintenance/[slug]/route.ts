import { unavailableBlogPost } from '~website/blog/_utils/unavailable'

export function GET() {
  return unavailableBlogPost()
}
