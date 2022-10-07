import React from 'react'

import { useAccount } from '../../../../protocol'
import { Button, Flex } from '../../../../system'
import { Grid } from '../../../../system/grid'
import { Heading } from '../../../../system/heading'

export const GetStarted = () => {
  const { account, createAccount } = useAccount()

  const membershipRequested = account?.membership === 'requested'

  return (
    <Flex direction="column" align="center" gap={5} css={{ padding: '30px 0' }}>
      <svg
        width={65}
        height={64}
        viewBox="0 0 65 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_3_411236)">
          <path
            d="M43.045 20.516a21.054 21.054 0 0121.45 20.704 21.217 21.217 0 01-.491 4.988c-.598 2.712-.954 5.472-.954 8.249v5.368a1.49 1.49 0 01-1.49 1.49h-5.368c-2.777 0-5.537.355-8.249.954a21.225 21.225 0 01-4.987.491 21.054 21.054 0 01-20.704-21.45c.173-11.406 9.387-20.62 20.793-20.794z"
            fill="url(#paint0_linear_3_411236)"
          />
          <path
            d="M43.045 20.516a21.054 21.054 0 0121.45 20.704 21.217 21.217 0 01-.491 4.988c-.598 2.712-.954 5.472-.954 8.249v5.368a1.49 1.49 0 01-1.49 1.49h-5.368c-2.777 0-5.537.355-8.249.954a21.225 21.225 0 01-4.987.491 21.054 21.054 0 01-20.704-21.45c.173-11.406 9.387-20.62 20.793-20.794z"
            fill="url(#paint1_linear_3_411236)"
          />
          <path
            d="M26.637 1.237A25.65 25.65 0 00.505 26.461c-.04 2.09.168 4.124.599 6.076.729 3.304 1.162 6.666 1.162 10.05v6.54c0 1.002.812 1.814 1.814 1.814h6.54c3.384 0 6.746.433 10.05 1.162 1.952.43 3.986.64 6.076.599A25.65 25.65 0 0051.97 26.57C51.758 12.675 40.533 1.45 26.637 1.237z"
            fill="url(#paint2_linear_3_411236)"
          />
          <path
            d="M17.024 25.592a3.971 3.971 0 00-2.9-1.258 3.986 3.986 0 00-3.987 3.986c0 1.145.485 2.174 1.257 2.901l8.6 8.6a3.972 3.972 0 002.9 1.257 3.986 3.986 0 003.987-3.986 3.972 3.972 0 00-1.258-2.901l-8.6-8.6z"
            fill="url(#paint3_linear_3_411236)"
          />
          <path
            d="M14.123 32.308a3.986 3.986 0 100-7.973 3.986 3.986 0 000 7.973z"
            fill="#fff"
          />
          <path
            d="M28.297 25.592a3.971 3.971 0 00-2.9-1.258 3.986 3.986 0 00-3.987 3.986c0 1.145.485 2.174 1.258 2.901l8.599 8.6a3.972 3.972 0 002.9 1.257 3.986 3.986 0 003.987-3.986 3.972 3.972 0 00-1.258-2.901l-8.599-8.6z"
            fill="url(#paint4_linear_3_411236)"
          />
          <path
            d="M25.398 32.308a3.986 3.986 0 100-7.973 3.986 3.986 0 000 7.973z"
            fill="#fff"
          />
          <path
            d="M39.572 25.592a3.971 3.971 0 00-2.901-1.258 3.986 3.986 0 00-3.986 3.986c0 1.145.485 2.174 1.257 2.901l8.6 8.6a3.972 3.972 0 002.9 1.257 3.986 3.986 0 003.986-3.986 3.972 3.972 0 00-1.257-2.901l-8.6-8.6z"
            fill="url(#paint5_linear_3_411236)"
          />
          <path
            d="M36.672 32.308a3.986 3.986 0 100-7.973 3.986 3.986 0 000 7.973z"
            fill="#fff"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_3_411236"
            x1={39.1099}
            y1={37.3759}
            x2={70.1253}
            y2={68.3913}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A7F3CE" />
            <stop offset={1} stopColor="#61DB99" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3_411236"
            x1={49.2627}
            y1={47.5281}
            x2={36.0891}
            y2={34.3557}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#61DB99" stopOpacity={0} />
            <stop offset={1} stopColor="#009E74" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3_411236"
            x1={16.8336}
            y1={22.8099}
            x2={49.5796}
            y2={55.5558}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#62E1FB" />
            <stop offset={1} stopColor="#00A2F3" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_3_411236"
            x1={22.9908}
            y1={37.1889}
            x2={5.74961}
            y2={19.9482}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00A2F3" stopOpacity={0} />
            <stop offset={1} stopColor="#0075CD" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_3_411236"
            x1={34.2635}
            y1={37.1884}
            x2={17.0228}
            y2={19.9478}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00A2F3" stopOpacity={0} />
            <stop offset={1} stopColor="#2A353D" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_3_411236"
            x1={45.5379}
            y1={37.1886}
            x2={28.2972}
            y2={19.9479}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00A2F3" stopOpacity={0} />
            <stop offset={1} stopColor="#0075CD" />
          </linearGradient>
          <clipPath id="clip0_3_411236">
            <path fill="#fff" transform="translate(.5)" d="M0 0H64V64H0z" />
          </clipPath>
        </defs>
      </svg>

      <Heading align="center" size="17" weight="600">
        Want to jump into the discussion?
      </Heading>
      <Grid gap={3} align="center" justify="center">
        <Button onClick={createAccount} disabled={membershipRequested}>
          {membershipRequested
            ? 'Membership Requested'
            : 'Use Throwaway Profile'}
        </Button>
      </Grid>
    </Flex>
  )
}
