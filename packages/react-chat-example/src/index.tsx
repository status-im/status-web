import { ReactChat, lightTheme, community } from '@dappconnect/react-chat';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <div style={{ height: '100%' }}>
    <ReactChat theme={lightTheme} community={community} />
  </div>,
  document.getElementById('root')
);
