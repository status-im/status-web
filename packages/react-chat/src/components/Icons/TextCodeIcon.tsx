import React from "react";
import styled from "styled-components";

export const TextCodeIcon = () => {
  return (
    <Icon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.5771 3.6662C12.6494 3.23234 13.0615 2.93893 13.4977 3.01084C13.9338 3.08275 14.2287 3.49276 14.1564 3.92662L11.4227 20.3342C11.3504 20.7681 10.9383 21.0615 10.5021 20.9896C10.066 20.9176 9.77109 20.5076 9.84337 20.0738L12.5771 3.6662Z" />
      <path d="M7.5274 7.24389C7.82093 7.53589 7.82093 8.00933 7.5274 8.30133L4.37771 11.4347C4.06461 11.7462 4.06461 12.2512 4.37771 12.5627L7.5274 15.696C7.82093 15.988 7.82093 16.4615 7.5274 16.7535C7.23388 17.0455 6.75798 17.0455 6.46445 16.7535L2.21636 12.5274C1.92283 12.2354 1.92283 11.762 2.21636 11.47L6.46445 7.24389C6.75798 6.95188 7.23388 6.95188 7.5274 7.24389Z" />
      <path d="M16.4727 8.30133C16.1792 8.00933 16.1792 7.53589 16.4727 7.24389C16.7662 6.95188 17.2421 6.95188 17.5357 7.24389L21.7838 11.47C22.0773 11.762 22.0773 12.2354 21.7838 12.5274L17.5357 16.7535C17.2421 17.0455 16.7662 17.0455 16.4727 16.7535C16.1792 16.4615 16.1792 15.988 16.4727 15.696L19.6224 12.5627C19.9355 12.2512 19.9355 11.7462 19.6224 11.4347L16.4727 8.30133Z" />
    </Icon>
  );
};

const Icon = styled.svg`
  fill: ${({ theme }) => theme.secondary};
`;
