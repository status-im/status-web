import React, { render } from 'react-dom';
import { GroupChat, lightTheme, darkTheme } from '@status-im/react';
import { StrictMode, useState } from 'react';

const App = () => {
  const [theme, setTheme] = useState(lightTheme);

  return (
    <div className="w-1/2 rounded-md shadow-lg">
      <GroupChat
        theme={theme}
        communityKey="0x033dc0109e1acde0c493961b860491fe741616e94a477ba758cd019d580d6693f9"
        config={{
          environment: 'test',
          dappUrl: 'https://0.0.0.0:8080',
        }}
      />

      <button onClick={() => setTheme(darkTheme)}>Change</button>
    </div>
  );
};

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
