<div align="center">
    <br/>
    <p>
        <h1>Ent Wrapper</h1>
        <h3>A wrapper for the Ent api written in Typescript.</h3>
    </p>
    <p>
        <a href="https://nodei.co/npm/ent-wrapper/"><img src="https://nodei.co/npm/ent-wrapper.png?downloads=true&stars=true" alt="npm installnfo" /></a>
    </p>
</div>

Ent Wrapper is a promise based wrapper for the Ent api. It takes an object-oriented approach, which makes the code easier to read.

## Warning
For now, this library has only been tested with the region ildedefrance. If your region does not work, feel free to open an issue.

## Example usage
```ts
const Ent = require('ent-wrapper');

const run = async () => {
    try {
        const session = new Ent.Session();

        // Logging in
        await session.login('ent.iledefrance.fr', 'firstname.lastname', 'password');

        // Fetching user informations
        const userInfo = await session.fetchCurrenthUserInfo();

        // Logging user level
        console.log(userInfo.level); // SECONDE GENERALE & TECHNO
    } catch (err) {
        console.error(err);
    }
};

run();
```

## Messages

### Fetching messages

```ts
// Fetching every inbox messages at page 0
const messages = await session.fetchMessages('Inbox', 0);

// Getting the latest message
const message = messages[0];

// Fetching the body of the message and converting it from HTML to text
const body = await message.fetchBody(true);

// Fetching the author of the message
const author = await message.fetchAuthor();

// Logging the message
console.log(`A message from ${author.displayName}:\n\nSubject: ${message.subject}\n${body}`);
// A message from ARMEL Samuel:

// Subject: Hello
// Hey how are you
```

### Sending messages
```ts
// Fetching an user
const user = await session.fetchUser('user id');

// Sending the user a message
user.sendMessage({
    subject: 'Hello',
    body: `Hey there ${user.displayName}, just wanted to let you know you're a great person!`,
    parseBody: true,
    signature: 'JanotLeLapin',
});

// Or replying to a message

// Fetching inbox messages
const messages = await session.fetchMessages('Inbox', 0);

// Getting the latest message
const message = messages[0];

// Replying to the message
message.reply({
    body: `The message you just sent, "${message.subject}", was very insightful.`,
    parseBody: true,
    signature: 'JanotLeLapin',
});

// Or sending a message to multiple people
session.sendMessage({
    subject: 'Hello everyone',
    body: 'How are you guys doing?',
    parseBody: true,
    to: ['user 1 id', 'user 2 id'],
    signature: 'JanotLeLapin',
});
```

### Deleting messages
```ts
// Fetch sent messages
const messages = await session.fetchMessages('Sent', 0);

// Getting the latest message
const message = messages[0];

// Deleting the message
await message.moveToTrash();
```
