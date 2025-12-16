import { Metadata } from '~app/_metadata'
import { getTranslations } from 'next-intl/server'

type Params = {
  params: Promise<{ locale: string }>
}

type Options = {
  namespace?: string
  titleKey: string
  descriptionKey: string
}

export async function generateMetadata(
  { params }: Params,
  options: Options,
): Promise<ReturnType<typeof Metadata>> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    ...(options.namespace && { namespace: options.namespace }),
  })

  return Metadata({
    title: t(options.titleKey),
    description: t(options.descriptionKey),
  })
}
