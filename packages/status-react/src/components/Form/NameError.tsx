import React from 'react'
import styled from 'styled-components'

import { NameErrors } from '../../hooks/useNameError'
import { Hint } from '../Modals/ModalStyle'

type NameErrorProps = {
  error: NameErrors
}

export function NameError({ error }: NameErrorProps) {
  switch (error) {
    case NameErrors.NoError:
      return null
    case NameErrors.NameExists:
      return (
        <ErrorText>
          Sorry, the name you have chosen is not allowed, try picking another
          username
        </ErrorText>
      )
    case NameErrors.BadCharacters:
      return (
        <ErrorText>
          Only letters, numbers, underscores and hypens allowed
        </ErrorText>
      )
    case NameErrors.EndingWithEth:
      return (
        <ErrorText>
          Usernames ending with “_eth” or "-eth" are not allowed
        </ErrorText>
      )
    case NameErrors.TooLong:
      return <ErrorText>24 character username limit</ErrorText>
  }
}

const ErrorText = styled(Hint)`
  color: ${({ theme }) => theme.redColor};
  text-align: center;
  width: 328px;
  margin: 8px 0;
`
