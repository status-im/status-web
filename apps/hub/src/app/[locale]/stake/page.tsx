import { redirect } from '~/i18n/navigation'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function StakePage({ params }: Props) {
  const { locale } = await params
  redirect({ href: '/', locale })
}
