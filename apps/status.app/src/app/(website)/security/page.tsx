import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-date'
import { Body } from '~components/body'
import { Link } from '~components/link'

export const metadata = Metadata({
  title: 'Security',
  description:
    'Status takes security seriously. Please report any security incidents via security@status.im.',
})

export default function SecurityPage() {
  return (
    <Body className="pb-24 pt-16 xl:pb-40 xl:pt-32">
      <div className="container max-w-[742px]">
        <div className="mb-12">
          <h1 className="mb-3 text-40 font-bold xl:text-64">
            Status - Security
          </h1>
          <p className="text-19 text-neutral-50">
            Last update: {formatDate('2024-05-15', 'long')}
          </p>
        </div>

        <div className="py-6">
          <p className="text-19">We take security seriously at Status.</p>
          <p className="text-19">
            Please report any security incidents via{' '}
            <Link
              href="mailto:security@status.im"
              className="text-customisation-blue-50 hover:text-customisation-blue-60"
            >
              security@status.im
            </Link>
            .
          </p>
        </div>

        <div className="py-6">
          <p className="text-19">
            Please report any discovered vulnerabilities in our bounty programme
            at{' '}
            <Link
              href="https://hackenproof.com/ift/status"
              className="text-customisation-blue-50 hover:text-customisation-blue-60"
            >
              HackenProof
            </Link>{' '}
            to help ensure our protocols and software remain secure.
          </p>
        </div>
      </div>
    </Body>
  )
}
