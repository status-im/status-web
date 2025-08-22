import { ButtonLink } from './_components/button-link'

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-189px)] flex-1 items-center justify-center px-5 lg:min-h-[calc(100dvh-118px)]">
      <div className="flex max-w-[696px] flex-col items-center gap-8">
        <h1 className="text-center text-40 font-700 lg:text-64">
          This is not the page you’re looking for
        </h1>

        <ButtonLink href="/">Take me home</ButtonLink>
      </div>
    </main>
  )
}
