import React, { useState } from 'react'
import styled from 'styled-components'
import { DirectorySortingEnum } from '../../models/community'
import { FilterList } from '../Filter'
import { Search } from '../Input'
import { PageBar } from '../PageBar'
import { DirectorySortingOptions } from '../../constants/SortingOptions'
import { WeeklyFeature } from '../WeeklyFeature'
import { DirectoryCardSkeleton } from './DirectoryCardSkeleton'
import { useDirectoryCommunities } from '../../hooks/useDirectoryCommunities'
import { SearchEmpty } from '../SearchEmpty'
import { DirectoryCard } from './DirectoryCard'

export function DirectoryCards() {
  const [filterKeyword, setFilterKeyword] = useState('')
  const [sortedBy, setSortedBy] = useState(DirectorySortingEnum.IncludedRecently)
  const [communities, publicKeys] = useDirectoryCommunities(filterKeyword, sortedBy)

  const renderCommunities = () => {
    if (!publicKeys) {
      return null
    }

    if (publicKeys.length === 0) {
      return <SearchEmpty />
    }

    if (communities.length === 0) {
      return publicKeys.map((publicKey: string) => {
        return <DirectoryCardSkeleton key={publicKey} />
      })
    }

    return communities.map((community) => <DirectoryCard key={community!.publicKey} community={community!} />)
  }

  return (
    <>
      <PageBar>
        <Search
          type="text"
          placeholder="Search communities..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.currentTarget.value)}
        />
        <FilterList value={sortedBy} setValue={setSortedBy} options={DirectorySortingOptions} />
      </PageBar>
      <WeeklyFeature />
      <Voting>{renderCommunities()}</Voting>
    </>
  )
}

const Voting = styled.div`
  display: flex;
  flex-direction: column;
`
