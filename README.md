# ent-wrapper
A wrapper for the ent api written in TypeScript

## Warning
For now this library only works with the region iledefrance. If you want your region to be supported, feel free to open an issue.

### Example usage
```ts
const Ent = require('ent-wrapper');

const run = async () => {
    const user = new Ent.User();

    // Logging in
    await user.login('firstname.lastname', 'password');

    // Fetching messages at page 0
    const messages = await user.fetchMessages(0);
    // Logging messages subjects
    console.log(messages.map(message => message.subject));

    // Fetching, parsing and logging the body of the latest message
    const messageBody = await messages[0].fetchBody(true);
    console.log(messageBody);
};

run();
```
