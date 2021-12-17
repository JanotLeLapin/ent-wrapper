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

### Warning

As the Ent api does not seem to perform any data validation, using methods which should modify data on the server (such as `App#pin`) might mess up your Ent if they decide to update their Api or if you pass in wrong arguments. Please be careful when using this library.

## Table of contents

- [About](#about)
  - [Warning](#warning)
- [Table of contents](#table-of-contents)
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
