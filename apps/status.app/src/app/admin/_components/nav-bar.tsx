'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { INTERNAL_ROUTES } from '../_constants'
import { UserPopover } from './user-popover'

import type { ApiOutput } from '~server/api/types'

type Props = {
  user: ApiOutput['user']
}

export const Navbar = ({ user }: Props) => {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-neutral-100">
      <div className="flex items-center pl-3 lg:pl-6">
        <Link
          href="/admin"
          className="flex w-[32px] min-w-[32px] overflow-hidden lg:w-auto"
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-1 pl-2 lg:gap-2 lg:pl-8">
          {INTERNAL_ROUTES.map(route => {
            const active = pathname!.includes(route.rootHref)
            const external = route.href.startsWith('http')

            if (
              (route.rootHref === '/admin/insights' &&
                !(user.canEditInsights || user.canViewInsights)) ||
              (route.rootHref === '/admin/keycard' &&
                !(user.canEditKeycard || user.canViewKeycard)) ||
              (route.rootHref === '/admin/reporting' && !user.canEditReports)
            ) {
              return null
            }

            return (
              <Link
                key={route.href}
                href={
                  route.href === '/admin/reporting'
                    ? `/admin/reporting/${user.contributorId}`
                    : route.href
                }
                className={cx([
                  'flex cursor-pointer select-none items-center gap-1 rounded-6 px-3 py-[5px] transition-colors hover:bg-neutral-80',
                  active && 'bg-neutral-60',
                  external && 'pr-2',
                ])}
                {...(external && {
                  rel: 'noopener noreferrer',
                  target: '_blank',
                })}
              >
                <p className="text-15 font-semibold text-white-100">
                  {route.title}
                </p>
                {external && (
                  <ExternalIcon
                    className={active ? 'text-white-100' : 'text-neutral-40'}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex items-center pr-2 xl:pr-6">
        <UserPopover user={user} />
      </div>
    </div>
  )
}

const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="32" fill="none">
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M59.423 20.144c.252.042 1.511.01 1.595 0V23h-1.942c-.84-.021-1.54-.09-2.26-.365a3.153 3.153 0 0 1-1.508-1.226c-.378-.632-.526-1.37-.526-2.094v-6.688h-1.848V9.94h1.848V7h3.444v2.94h2.184v2.687h-2.184v6.216c0 .252.039.528.151.767a.822.822 0 0 0 .425.38c.203.077.348.123.62.154Zm-11.56-4.882c1.253.256 2.188.67 2.802 1.243.305.287.545.637.702 1.025.158.388.224.809.224 1.229 0 .797-.255 1.582-.744 2.22a4.862 4.862 0 0 1-2.032 1.488c-.944.37-1.952.55-2.966.532-1.708-.002-3.066-.358-4.074-1.069a4.133 4.133 0 0 1-1.203-1.266C40.266 20.161 40 19.367 40 18.8h3.517c.021.242.131.492.264.695.132.203.304.377.506.512a2.989 2.989 0 0 0 1.569.421 3.06 3.06 0 0 0 1.515-.379 1.1 1.1 0 0 0 .584-.945.997.997 0 0 0-.412-.801c-.372-.249-.803-.39-1.24-.473l-2.234-.444c-1.258-.252-2.194-.688-2.807-1.31a3.245 3.245 0 0 1-.907-2.374 3.471 3.471 0 0 1 .675-2.141 4.308 4.308 0 0 1 1.905-1.385 7.83 7.83 0 0 1 2.883-.487c1.63.002 2.912.346 3.847 1.033.456.327.838.747 1.121 1.231.283.485.49 1.41.49 1.934h-3.234c-.053-.283-.201-.694-.39-.91a1.987 1.987 0 0 0-.726-.546 2.559 2.559 0 0 0-1.07-.206 2.595 2.595 0 0 0-1.39.332c-.17.088-.326.236-.426.4a1.05 1.05 0 0 0-.155.544.993.993 0 0 0 .369.78c.379.268.811.42 1.276.508l2.332.473Zm25.606-3.185a3.827 3.827 0 0 0-1.212-1.357 5.445 5.445 0 0 0-1.754-.78 8.505 8.505 0 0 0-2.062-.252c-.913 0-1.847.144-2.714.472a4.832 4.832 0 0 0-1.907 1.319c-.569.669-.996 1.521-.996 2.408H66.1c.084-.535.431-.906.795-1.165a2.712 2.712 0 0 1 1.526-.443c.501 0 1.025.14 1.428.455.17.155.302.347.388.56.086.214.136.44.122.67-.007.12-.031.297-.086.405a.878.878 0 0 1-.268.294c-.313.177-.654.256-1.014.31-.428.064-.958.119-1.64.19l-.144.014c-.616.058-1.226.164-1.825.32a5.155 5.155 0 0 0-1.548.67 3.177 3.177 0 0 0-1.075 1.182c-.279.559-.397 1.178-.397 1.798 0 .745.17 1.493.56 2.132a3.493 3.493 0 0 0 1.525 1.283 5.553 5.553 0 0 0 2.199.438 5.41 5.41 0 0 0 1.686-.26 3.78 3.78 0 0 0 1.25-.71c.342-.298.74-.663.948-1.067l.01 1.785h3.434v-8.693c0-.682-.198-1.366-.505-1.978Zm-3.105 5.582c-.113 1.28-.877 2.427-2.099 2.78a2.263 2.263 0 0 1-.775.078h-.097a1.564 1.564 0 0 1-1.365-1.081c-.237-.865.257-1.612 1.302-1.962l.144-.045c.417-.117.768-.159 1.12-.201.359-.044.718-.087 1.149-.21.21-.06.41-.137.606-.234l.003.012a3.66 3.66 0 0 1 .012.863Zm11.442 2.485c.252.042 1.512.01 1.596 0V23h-1.943c-.84-.021-1.54-.09-2.26-.365a3.153 3.153 0 0 1-1.507-1.226c-.379-.632-.527-1.37-.527-2.094v-6.688h-1.847V9.94h1.847V7h3.444v2.94h2.184v2.687h-2.184v6.216c0 .252.039.528.151.767a.822.822 0 0 0 .426.38c.202.077.347.123.62.154ZM92.893 9.94v7.39c0 .505-.1 1.01-.346 1.454a2.3 2.3 0 0 1-.91.884 2.548 2.548 0 0 1-1.207.3 2.09 2.09 0 0 1-1.629-.664 2.6 2.6 0 0 1-.612-1.806V9.94h-3.443v8.189c0 .892.173 1.795.559 2.607a4 4 0 0 0 1.53 1.668c.69.402 1.48.596 2.278.596.86 0 1.73-.22 2.461-.695a3.855 3.855 0 0 0 1.466-1.825v2.268h3.296V9.94h-3.444Zm12.649 5.322c1.254.256 2.189.67 2.803 1.243.305.287.545.637.702 1.025.158.388.224.809.224 1.229 0 .797-.255 1.582-.744 2.22a4.865 4.865 0 0 1-2.032 1.488c-.945.37-1.952.55-2.966.532-1.708-.002-3.066-.358-4.074-1.069a4.132 4.132 0 0 1-1.203-1.266c-.306-.503-.572-1.297-.572-1.864h3.517c.021.242.131.492.264.695.132.203.304.377.506.512a2.986 2.986 0 0 0 1.569.421 3.06 3.06 0 0 0 1.515-.379 1.098 1.098 0 0 0 .583-.945.99.99 0 0 0-.411-.801c-.372-.249-.803-.39-1.24-.473l-2.234-.444c-1.258-.252-2.194-.688-2.807-1.31a3.245 3.245 0 0 1-.908-2.374 3.472 3.472 0 0 1 .676-2.141 4.309 4.309 0 0 1 1.905-1.385 7.83 7.83 0 0 1 2.883-.487c1.629.002 2.912.346 3.847 1.033.456.327.838.747 1.121 1.231.283.485.49 1.41.49 1.934h-3.234c-.053-.283-.201-.694-.39-.91a1.99 1.99 0 0 0-.726-.546 2.558 2.558 0 0 0-1.07-.206 2.596 2.596 0 0 0-1.389.332 1.118 1.118 0 0 0-.427.4 1.046 1.046 0 0 0-.155.544.993.993 0 0 0 .369.78c.378.268.811.42 1.276.508l2.332.473Z"
        clipRule="evenodd"
      />
      <g clipPath="url(#a)">
        <path
          fill="#fff"
          d="M16 0C4 0 0 4 0 16s4 16 16 16 16-4 16-16S28 0 16 0Z"
        />
        <mask
          id="b"
          width="14"
          height="16"
          x="9"
          y="8"
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M18.128 8.808c-3.173.181-5.516 3.066-5.776 6.329l.051-.015.051-.014a6.24 6.24 0 0 1 1.22-.184c.89-.05 1.615.027 2.34.104.725.077 1.45.155 2.342.104.41-.021.816-.085 1.213-.188 1.679-.436 2.645-1.57 2.56-3.125-.106-1.932-2.052-3.122-4-3.011ZM13.88 23.19c3.173-.181 5.516-3.066 5.776-6.329l-.064.019a6.234 6.234 0 0 1-1.257.194c-.892.05-1.618-.027-2.343-.104-.725-.077-1.45-.154-2.34-.103a6.04 6.04 0 0 0-1.213.189c-1.679.434-2.64 1.569-2.56 3.124.106 1.932 2.052 3.122 4 3.01Z"
            clipRule="evenodd"
          />
        </mask>
        <g mask="url(#b)">
          <g filter="url(#c)">
            <circle cx="23" cy="9" r="19" fill="#1992D7" />
          </g>
          <g filter="url(#d)">
            <circle cx="33" cy="19" r="19" fill="#F6B03C" />
          </g>
          <g filter="url(#e)">
            <circle cx="5" cy="31" r="19" fill="#FF7D46" />
          </g>
          <g filter="url(#f)">
            <circle cx="-7" cy="9" r="19" fill="#7140FD" />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="c"
          width="56.861"
          height="56.861"
          x="-5.43"
          y="-19.43"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_695_20034"
            stdDeviation="4.715"
          />
        </filter>
        <filter
          id="d"
          width="56.861"
          height="56.861"
          x="4.57"
          y="-9.43"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_695_20034"
            stdDeviation="4.715"
          />
        </filter>
        <filter
          id="e"
          width="56.861"
          height="56.861"
          x="-23.43"
          y="2.57"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_695_20034"
            stdDeviation="4.715"
          />
        </filter>
        <filter
          id="f"
          width="56.861"
          height="56.861"
          x="-35.43"
          y="-19.43"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_695_20034"
            stdDeviation="4.715"
          />
        </filter>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h32v32H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
