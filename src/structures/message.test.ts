import Session from './session';

test('Fetch body', async () => {
    const session = new Session();
    await session.login(process.env.ENT_URL, process.env.ENT_USERNAME, process.env.ENT_PASSWORD);

    const message = await session.fetchMessage(parseInt(process.env.MESSAGE_TO_FETCH));
    const body = await message.fetchBody(true);
    expect(body).not.toBe(undefined);
});

test('Fetch author', async () => {
    const session = new Session();
    await session.login(process.env.ENT_URL, process.env.ENT_USERNAME, process.env.ENT_PASSWORD);

    const message = await session.fetchMessage(parseInt(process.env.MESSAGE_TO_FETCH));
    const author = await message.fetchAuthor();
    expect(author.id).not.toBe(undefined);
});
