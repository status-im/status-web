import React from "react";
import styled, { keyframes } from "styled-components";

const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingIcon = () => (
  <Icon
    width="13"
    height="12"
    viewBox="0 0 13 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.7682 5.07742C10.5667 4.18403 10.0777 3.37742 9.37244 2.77889C8.66702 2.18025 7.78327 1.8222 6.85295 1.7598C5.9226 1.69741 4.99749 1.93417 4.21597 2.43357C3.4346 2.93289 2.83935 3.66744 2.51731 4.52621C2.19533 5.38485 2.16318 6.32294 2.4255 7.20091C2.68785 8.07899 3.23118 8.85135 3.9762 9.40157C4.72137 9.95188 5.62791 10.25 6.56041 10.25L6.56041 11.75C5.30863 11.75 4.08949 11.3499 3.0851 10.6082C2.08057 9.86633 1.34435 8.82207 0.988276 7.63032C0.632173 6.43846 0.675924 5.16459 1.11282 3.99953C1.54966 2.8346 2.35554 1.84232 3.40827 1.16961C4.46086 0.496978 5.7044 0.179402 6.95332 0.263164C8.20227 0.346928 9.39145 0.827686 10.343 1.63521C11.2947 2.44286 11.9578 3.53431 12.2314 4.74738L10.7682 5.07742Z"
    />
  </Icon>
);

const Icon = styled.svg`
  & > path {
    fill: ${({ theme }) => theme.primary};
  }
  animation: ${rotation} 2s linear infinite;
`;
