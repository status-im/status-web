import React from 'react'

import { keyframes } from '../../../../styles/config'
import { Box, Text } from '../../../../system'

interface Props {
  label: string
}
const fadeIn = keyframes({
  from: { opacity: 0, top: 0 },
  to: { opacity: 1 },
})

const spin = keyframes({
  to: {
    transform: 'rotate(1turn)',
  },
})

export const LoadingToast = (props: Props) => {
  const { label } = props

  return (
    <Box
      css={{
        width: 'max-content',
        position: 'sticky',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '$accent-11',
        color: '$accent-1',
        boxShadow:
          '0px 2px 4px rgba(0, 34, 51, 0.16), 0px 4px 12px rgba(0, 34, 51, 0.08)',
        borderRadius: 8,
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        animation: `${fadeIn} .2s linear`,

        svg: {
          animation: `${spin} 1s linear infinite`,
          marginBottom: -1,
        },
      }}
    >
      <svg
        width="13"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.7692 5.07742C10.5677 4.18403 10.0787 3.37742 9.37342 2.77889C8.668 2.18025 7.78425 1.8222 6.85392 1.7598C5.92358 1.69741 4.99847 1.93417 4.21695 2.43357C3.43557 2.93289 2.84032 3.66744 2.51829 4.52621C2.1963 5.38485 2.16416 6.32294 2.42647 7.20091C2.68883 8.07899 3.23215 8.85135 3.97718 9.40157C4.72235 9.95188 5.62888 10.25 6.56139 10.25L6.56139 11.75C5.30961 11.75 4.09047 11.3499 3.08608 10.6082C2.08155 9.86633 1.34532 8.82207 0.989253 7.63032C0.63315 6.43846 0.676901 5.16459 1.11379 3.99953C1.55064 2.8346 2.35652 1.84232 3.40925 1.16961C4.46184 0.496978 5.70538 0.179402 6.9543 0.263164C8.20325 0.346928 9.39243 0.827686 10.344 1.63521C11.2957 2.44286 11.9588 3.53431 12.2324 4.74738L10.7692 5.07742Z"
          fill="currentColor"
        />
      </svg>

      <Text size="13" weight="500">
        Loading {label}...
      </Text>
    </Box>
  )
}
