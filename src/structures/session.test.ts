import Session from './session';

test('Authentication', async () => {
    const session = new Session();
    await session.login(process.env.ENT_URL, process.env.ENT_USERNAME, process.env.ENT_PASSWORD);

    const userInfo = await session.fetchCurrenthUserInfo();
    expect(userInfo.login).toEqual(process.env.ENT_USERNAME);
});

test('Fetch user', async () => {
    const session = new Session();
    await session.login(process.env.ENT_URL, process.env.ENT_USERNAME, process.env.ENT_PASSWORD);

    const user = await session.fetchUser(process.env.USER_TO_FETCH);
    expect(user.id).not.toBe(undefined);
});

test('Fetch message', async () => {
    const session = new Session();
    await session.login(process.env.ENT_URL, process.env.ENT_USERNAME, process.env.ENT_PASSWORD);

    const message = await session.fetchMessage(parseInt(process.env.MESSAGE_TO_FETCH));
    expect(message.id).not.toBe(undefined);
});
