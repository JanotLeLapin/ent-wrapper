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

## About

Ent Wrapper is a promise based wrapper for the Ent api. It takes an object-oriented approach, which makes the code easier to read.  
For now, Ent Wrapper has only been tested with the region iledefrance. If your region is not supported, feel free to add an issue.

## Table of contents

- [Example](#example)
- [API](#api)
  - [Session](#session)
  - [Message](#message)
  - [User](#user)
  - [UserPreview](#userpreview)
  - [App](#app)

## Example
```ts
const Ent = require('ent-wrapper');

const run = async () => {
    try {
        const session = new Ent.Session();

        // Logging in
        await session.login('ent.iledefrance.fr', 'firstname.lastname', 'password');

        // Fetching user informations
        const userInfo = await session.fetchUserInfo();

        // Logging user level
        console.log(userInfo.level); // SECONDE GENERALE & TECHNO
    } catch (err) {
        console.error(err);
    }
};

run();
```

## API

### Session
> The core Ent Wrapper class.

**Session.prototype.login(url, username, password):Promise;**
> Fetches a session cookie from the API. 

Option   | Type   | Required | Default | Description
---------|--------|----------|---------|------------
url      | String | Yes      | -       | The ent url, depending on your region (eg: ent.iledefrance.fr)
username | String | Yes      | -       | Your ENT username (usually firstname.lastname)
password | String | Yes      | -       | Your ENT password

Note that the client should be logged in before any other function is run.

**Session.prototype.fetchLanguage():string;**
> Fetches the user's preferred language. 

**Session.prototype.fetchMessages(folder, page):Promise;**
> Fetches a list of [messages](#message) from the user.

Option | Type   | Required | Default | Description
-------|--------|----------|---------|------------
folder | String | Yes      | -       | The system folder to fetch
page   | Number | No       | 0       | The page of the folder to fetch

**Session.prototype.fetchMessage(messageId):Promise;**
> Fetches a [message](#message)

Option    | Type   | Required | Default | Description
----------|--------|----------|---------|------------
messageId | Number | Yes      | -       | The id of the message

**Session.prototype.fetchUserInfo():Promise;**
> Fetches informations about the user

**Session.prototype.fetchPinnedApps():Promise;**
> Fetches the user's pinned [apps](#app)

**Session.prototype.searchUsers({classes, functions, mood, profiles, search}):Promise;**
> Searches for user profiles and returns an [UserPreview](#userpreview) array.

Option    | Type      | Required | Default | Description
----------|-----------|----------|---------|------------
classes   | String[]  | No       | -       | An array of classes id
functions | String[]  | No       | -       | An array of functions id
mood      | Boolean   | No       | -       | Not sure what this does
profiles  | String[]  | No       | -       | An array of profiles (Student, Teacher...)
search    | String    | No       | -       | The query

**Session.prototype.fetchUser(userId):Promise;**
> Fetches an ENT user by id.

Option | Type   | Required | Default | Description
-------|--------|----------|---------|------------
userId | Number | Yes      | -       | The id of the user

**Session.prototype.sendMessage({body, subject, parseBody, signature, attachments, cc, bcc, to}):Promise;**
> Sends a message to a list of ENT users and returns the message id.

Option      | Type      | Required | Default       | Description
------------|-----------|----------|---------------|------------
body        | String    | Yes      | -             | The body of the message
subject     | String    | No       | (Aucun objet) | The subject of the message
parseBody   | Boolean   | No       | false         | Wether the body of the message should be converted from text to HTML or not
signature   | String    | No       | -             | The signature of the message
attachments | String[]  | No       | -             | Not implemented yet
cc          | String[]  | No       | -             | Array of cc users id
bcc         | String[]  | No       | -             | Array of bcc users id
to          | String[]  | No       | -             | Array of users id to send this message to

### Message
> The Ent Message class.

**Message.prototype.toJSON():object**
> Returns this message instance as a JSON object.

**Message.prototype.fetchBody(parse):Promise**
> Fetches the message body and marks the message as read.

Option | Type    | Required | Default | Description
-------|---------|----------|---------|------------
parse  | Boolean | Yes      | -       | Wether the body should be decoded or not.

**Message.prototype.fetchAuthor():Promise**
> Fetches the [author](#user) of the message

**Message.prototype.reply({body, subject, parseBody, signature, attachments, cc, bcc, to}):Promise**
> Replies to this message and returns the reply's id.

Option      | Type      | Required | Default                            | Description
------------|-----------|----------|------------------------------------|------------
body        | String    | Yes      | -                                  | The body of the message
subject     | String    | No       | Re : *the subject of this message* | The subject of the message
parseBody   | Boolean   | No       | false                              | Wether the body of the message should be converted from text to HTML or not
signature   | String    | No       | -                                  | The signature of the message
attachments | String[]  | No       | -                                  | Not implemented yet
cc          | String[]  | No       | -                                  | Array of cc users id
bcc         | String[]  | No       | -                                  | Array of bcc users id
to          | String[]  | No       | -                                  | Array of users id to send this message to

**Message.prototype.moveToTrash():Promise**
> Moves the message to the trash folder.

### User
> The Ent User class.

**User.prototype.toJSON():object**
> Returns this user instance as a JSON object.

**User.prototype.sendMessage({body, subject, parseBody, signature, attachments, cc, bcc, to}):Promise**
> Sends a message to this user and returns the message id.

Option      | Type      | Required | Default       | Description
------------|-----------|----------|---------------|------------
body        | String    | Yes      | -             | The body of the message
subject     | String    | No       | (Aucun objet) | The subject of the message
parseBody   | Boolean   | No       | false         | Wether the body of the message should be converted from text to HTML or not
signature   | String    | No       | -             | The signature of the message
attachments | String[]  | No       | -             | Not implemented yet
cc          | String[]  | No       | -             | Array of cc users id
bcc         | String[]  | No       | -             | Array of bcc users id
to          | String[]  | No       | -             | Array of additionnal users id to send this message to

**User.prototype.avatarURL():string**
> Returns the users avatar url.

### UserPreview
> The Ent UserPreview class, similar to the User class but with some missing properties.

**UserPreview.prototype.toJSON():object**
> Returns this user instance as a JSON object.

**UserPreview.prototype.sendMessage({body, subject, parseBody, signature, attachments, cc, bcc, to}):Promise**
> Sends a message to this user and returns the message id.

Option      | Type      | Required | Default       | Description
------------|-----------|----------|---------------|------------
body        | String    | Yes      | -             | The body of the message
subject     | String    | No       | (Aucun objet) | The subject of the message
parseBody   | Boolean   | No       | false         | Wether the body of the message should be converted from text to HTML or not
signature   | String    | No       | -             | The signature of the message
attachments | String[]  | No       | -             | Not implemented yet
cc          | String[]  | No       | -             | Array of cc users id
bcc         | String[]  | No       | -             | Array of bcc users id
to          | String[]  | No       | -             | Array of additionnal users id to send this message to

**UserPreview.prototype.fetchUser():Promise**
> Fetches user from userpreview.

**UserPreview.prototype.avatarURL():string**
> Returns the users avatar url.

### App

**App.prototype.toJSON():object**
> Returns this app instance as a JSON object.

**App.prototype.fullAddress():string**
> Returns the full address of the map.

**App.prototype.pin():Promise**
> Pins the app.

**App.prototype.unpin():Promise**
> Unpins the app.
