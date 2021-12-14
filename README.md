<div align="center">
    <br/>
    <p>
        <h1>Ent Wrapper</h1>
        <h3>A wrapper for the Ent api written in Typescript.</h3>
    </p>
    <p>
        <a href="https://nodei.co/npm/ent-wrapper/">
          <img src="https://nodei.co/npm/ent-wrapper.png?downloads=true&stars=true" alt="npm installnfo" />
        </a>
    </p>
</div>

## About

Ent Wrapper is a promise based wrapper for the Ent api. It takes an object-oriented approach, which makes the code easier to read.  
For now, Ent Wrapper has only been tested with the region iledefrance. If your region is not supported, feel free to add an issue.

## Table of contents

- [Example](#example)
- [API](#api)

## Example

```js
const Ent = require('ent-wrapper');

const run = async () => {
  try {
    // Create a session
    const session = new Ent.Session(
      'ent.iledefrance.fr',
      'firstname.lastname',
      'password'
    );

    // Fetch user informations
    const userInfo = await session.fetchUserInfo();

    // Log user level
    console.log(userInfo.level); // SECONDE GENERALE & TECHNO
  } catch (err) {
    console.error(err);
  }
};

run();
```

## API

You can access the documentation of the API [here](https://janotlelapin.github.io/ent-wrapper) (work in progress.)
