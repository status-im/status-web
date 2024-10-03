import { cx } from 'cva'

import { config } from '~config'

import { DropdownMenu } from './dropdown-menu'

type Props = {
  className?: string
  children?: React.ReactNode
}

function downloadUrl(dataurl: string) {
  const link = document.createElement('a')
  link.href = dataurl
  link.target = '_blank'
  link.click()
}

const MacOsPicker = (props: Props) => {
  const { children, className } = props

  return (
    <DropdownMenu>
      <button
        className={cx(
          'group flex items-center justify-center gap-1 whitespace-nowrap rounded-xl border text-center text-15 font-medium leading-normal outline-none transition-all',
          'h-10 px-3',
          'border-neutral-30 bg-white-100 text-neutral-100 hover:border-neutral-40 active:border-neutral-50',
          className,
        )}
      >
        <span className="-mt-px">
          <svg
            color="rgba(9 16 28 / 100%)"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            focusable="false"
            aria-hidden="true"
          >
            <path
              fill="rgba(9 16 28 / 100%)"
              d="M14.357 10c.023 2.422 2.12 3.227 2.143 3.238-.018.056-.335 1.148-1.105 2.275-.665.975-1.356 1.946-2.444 1.966-1.069.02-1.413-.635-2.635-.635-1.222 0-1.604.615-2.616.655-1.05.04-1.85-1.054-2.52-2.025-1.371-1.987-2.42-5.613-1.012-8.062.699-1.215 1.948-1.985 3.303-2.005 1.031-.02 2.005.695 2.635.695.63 0 1.813-.86 3.056-.733.521.022 1.982.21 2.92 1.587-.075.047-1.743 1.02-1.725 3.044Zm-2.009-5.945c.558-.677.933-1.618.83-2.555-.803.032-1.775.537-2.351 1.213-.517.598-.97 1.556-.847 2.475.895.069 1.81-.457 2.368-1.133Z"
            ></path>
          </svg>
        </span>
        {children}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="-ml-1 transition-transform duration-200 group-aria-expanded:rotate-180"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z"
            fill="#E7EAEE"
            fillOpacity={1}
          />
          <path
            d="M7 8.5L10 11.5L13 8.5"
            stroke={'#09101C'}
            strokeWidth="1.2"
          />
        </svg>
      </button>
      <DropdownMenu.Content
        align="start"
        sideOffset={8}
        className="[&>div]:outline-none"
      >
        <DropdownMenu.Item
          label="Apple Silicon"
          onSelect={() =>
            downloadUrl(config.desktop.downloadUrls.macos.silicon)
          }
        />
        <DropdownMenu.Item
          label="Intel"
          onSelect={() => downloadUrl(config.desktop.downloadUrls.macos.intel)}
        />
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export { MacOsPicker }
