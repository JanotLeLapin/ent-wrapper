import React from 'react';

import Code from './Code';

import styles from './Home.module.css';

const example = [
  "const Ent = require('ent-wrapper')",
  '',
  'const run = async () => {',
  '  try {',
  '    // Logging in',
  "    await session.login('ent.iledefrance.fr', 'firstname.lastname', 'password');",
  '',
  '    // Fetching user informations',
  '    const userInfo = await session.fetchUserInfo();',
  '',
  '    // Logging user level',
  '    console.log(userInfo.level); // SECONDE GENERALE & TECHNO',
  '  } catch (err) {',
  '    console.error(err)',
  '  }',
  '};',
  '',
  'run();',
];

const App = () => (
  <div>
    <div className={styles.Install}>
      <Code language="bash">{'> npm install ent-wrapper'}</Code>
    </div>
    <div className={styles.Articles}>
      <div>
        <h1>About</h1>
        <p>
          ent-wrapper is a lightweight <a href="https://nodejs.org">node.js</a>{' '}
          module written in TypeScript that wraps the Ent API. It covers most of
          the API and allows you to interact with it very easily by taking an
          object-oriented approach.
          <br />
          Ent Wrapper has only been tested with the region Île-de-France. If
          your region does not work, feel free to write an issue.
        </p>
      </div>
      <div>
        <h1>Example</h1>
        <div className={styles.Code}>
          <Code language="javascript">{example.join('\n')}</Code>
        </div>
      </div>
    </div>
  </div>
);

export default App;
