import React, { render } from 'react-dom';
import { CommunityChat, lightTheme } from '@status-im/react';
import { StrictMode } from 'react';

const App = () => {
  return (
    <div>
      <CommunityChat
        theme={lightTheme}
        communityKey="<YOUR_COMMUNITY_KEY>"
        config={{
          environment: '<ENVIRONMENT>',
          dappUrl: '<URL>',
        }}
      />
    </div>
  );
};

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
