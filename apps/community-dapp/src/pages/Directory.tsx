import React from 'react'
import { DirectoryInfo } from '../components/directory/DirectoryInfo'
import { DirectoryCards } from '../components/directory/DirectoryCards'

export function Directory() {
  return (
    <div>
      <DirectoryInfo />
      <DirectoryCards />
    </div>
  )
}
