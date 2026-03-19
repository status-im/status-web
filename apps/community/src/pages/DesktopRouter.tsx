import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Directory } from './Directory'
import { Votes } from './Votes'
import { Info } from './Info'
import { Featured } from './Featured'
import { TopBar } from '../components/top/TopBar'

export const DesktopRouter = () => (
  <BrowserRouter>
    <TopBar />
    <PageContent>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/votes" />} />
        <Route path="/votingRoom" render={() => <Redirect to="/votes" />} />
        <Route path="/feature" render={() => <Redirect to="/directory" />} />
        <Route path="/removal" render={() => <Redirect to="/directory" />} />
        <Route exact path="/votes" component={Votes} />
        <Route exact path="/directory" component={Directory} />
        <Route exact path="/featured" component={Featured} />
        <Route exact path="/info" component={Info} />
      </Switch>
    </PageContent>
  </BrowserRouter>
)

const PageContent = styled.div`
  height: 100%;
  max-width: 996px;
  padding: 96px 32px 32px;
  margin: 0 auto;
  position: relative;
`
