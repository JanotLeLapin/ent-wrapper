import fetch from 'node-fetch';
import https from 'https';

import Message, { IMessageConfig } from './message';
import User, { UserPreview, profile } from './user';
import App from './app';

import { encodeUrl, processCookies, error } from '../util';

export interface IUser {
    classNames:          string[];
    level:               string;
    login:               string;
    lastName:            string;
    firstName:           string;
    externalId:          string;
    federated:           any;
    birthDate:           Date;
    forceChangePassword: any;
    needRevalidateTerms: boolean;
    deletePending:       boolean;
    username:            string;
    type:                string;
    hasPw:               boolean;
    functions:           IChildren;
    groupsIds:           string[];
    federatedIDP:        any;
    optionEnabled:       any[];
    userId:              string;
    structures:          string[];
    structureNames:      string[];
    uai:                 string[];
    hasApp:              boolean;
    classes:             string[];
    authorizedActions:   IAuthorizedAction[];
    apps:                App[];
    childrenIds:         any[];
    children:            IChildren;
    widgets:             IWidget[];
};

export interface IAuthorizedAction {
    name:        string;
    displayName: string;
    type:        Type;
};

export enum Type {
    SecuredActionWorkflow = 'SECURED_ACTION_WORKFLOW',
};

export interface IChildren {
};

export interface IWidget {
    application: null | string;
    i18n:        string;
    name:        string;
    path:        string;
    mandatory:   boolean;
    id:          string;
    js:          string;
};

export interface IQuery {
    classes?: string[];
    functions?: string[];
    mood?: boolean;
    profiles?: profile[];
    search?: string;
};

export default class Session {
    authCookie?: string;
    xsrf?: string;
    url?: string;

    /**
     * Fetches a session cookie from the API.
     * @param url The ent url, depending on your region (eg: ent.iledefrance.fr)
     * @param username Your ENT username (usually firstname.lastname)
     * @param password Your ENT password
     */
    login(url: string, username: string, password: string): Promise<void> {
        this.url = (url.startsWith('https://') ? url : 'https://' + url) + (url.endsWith('/') ? '' : '/');
        return new Promise<void>(async (resolve, reject) => {
            try {
                const data = `email=${username}&password=${encodeUrl(password)}&callBack=https%253A%252F%252Fent.iledefrance.fr%252Ftimeline%252Ftimeline&details=`;
                const req0 = https.request({
                    hostname: 'ent.iledefrance.fr',
                    path: '/auth/login',
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': data.length,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 OPR/73.0.3856.344',
                    },
                }, res0 => {
                    res0.destroy();
                    if (res0.statusCode === 200 || !res0.headers['set-cookie']) return reject('Auth failed.');
                    this.authCookie = processCookies([...res0.headers['set-cookie']]);
                    const req1 = https.request({
                        hostname: 'ent.iledefrance.fr',
                        path: '/timeline/timeline',
                        method: 'GET',
                        headers: {
                            'Accept': '*/*',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Cookie': processCookies(res0.headers['set-cookie']),
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 OPR/73.0.3856.344',
                        },
                    }, res1 => {
                        res1.destroy();
                        if (!res1.headers['set-cookie']) return reject('Auth failed.');
                        this.xsrf = res1.headers['set-cookie'].find(cookie => cookie.includes('XSRF'))?.split('=')[1]?.split(';')[0];
                        resolve();
                    });
                    req1.end();
                });
                req0.write(data);
                req0.end();
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches the user's preferred language.
     */
    fetchLanguage(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject('Missing auth cookie.');
                const res = await fetch(this.url + 'userbook/preference/language', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                if (error(json, reject)) return;
                resolve(JSON.parse(json.preference)['default-domain']);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches a list of messages from the user.
     * @param folder The system folder to fetch
     * @param page The messages page
     */
    fetchMessages(folder: 'Inbox' | 'Sent' | 'Drafts' | 'Trash', page: number): Promise<Message[]> {
        return new Promise<Message[]>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject('Missing auth cookie.');
                if (!['Inbox', 'Sent', 'Drafts', 'Trash'].includes(folder)) return reject('Invalid folder.');
                const res = await fetch(this.url + 'zimbra/list?folder=' + folder + '&page=' + page + '&unread=false', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json: any[] = await res.json();
                if (error(json, reject)) return;
                resolve(json.map(message => new Message({ ...message, session: this })));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches a message.
     * @param messageId The id of the message
     */
    fetchMessage(messageId: number): Promise<Message> {
        return new Promise<Message>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject('Missing auth cookie.');
                const res = await fetch(this.url + 'zimbra/message/' + messageId, {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                if (error(json, reject)) return;
                resolve(new Message({ ...json, session: this }));
            } catch (err) {
                reject(err);
            }
        })
    }

    /**
     * Fetches informations about the user.
     */
    fetchCurrenthUserInfo(): Promise<IUser> {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject('Missing auth cookie.');
                const res = await fetch(this.url + 'auth/oauth2/userinfo', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                if (error(json, reject)) return;
                const tempDate = json.birthDate.split('-');
                resolve({ ...json, birthDate: new Date(tempDate[0], tempDate[1] - 1, tempDate[2]), apps: json.apps.map((app: any) => new App({ ...app, session: this })) });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches the user's pinned apps.
     */
    fetchPinnedApps(): Promise<App[]> {
        return new Promise<App[]>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject('Missing auth cookie.');
                const res = await fetch(this.url + 'userbook/preference/apps', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                if (error(json, reject)) return;

                const parsed: any[] = JSON.parse(json.preference);
                resolve(parsed.map(app => new App({ ...app, session: this })));
            } catch (err) {
                reject(err);
            }
        });
    };

    /**
     * Searches for user profiles and returns an UserPreview array.
     * @param query The query
     */
    searchUsers(query: IQuery): Promise<UserPreview[]> {
        return new Promise<UserPreview[]>(async (resolve, reject) => {
            try {
                if (!this.authCookie || !this.xsrf) return reject('Missing auth cookie.');
                const res = await fetch(this.url + 'communication/visible', {
                    headers: {
                        'Cookie': this.authCookie,
                        'X-XSRF-TOKEN': this.xsrf,
                    },
                    method: 'POST',
                    body: JSON.stringify(query),
                });
                const json: { users: any[] } = await res.json();
                if (error(json, reject)) return;
                resolve(json.users.map(userpreview => new UserPreview({ ...userpreview, session: this })));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches an ENT user by id.
     * @param userId The id of the user
     */
    fetchUser(userId: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject('Missing auth cookie.');
                const res = await fetch(this.url + 'userbook/api/person?id=' + userId, {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                if (error(json, reject)) return;
                resolve(new User({ ...json.result[0], session: this }));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Sends a message to a list of ENT users and returns the message id.
     * @param config The configuration of the message
     */
    sendMessage(config: IMessageConfig): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject('Missing auth cookie.');
                if (!config.to) return reject('No destination specified.');

                const message = JSON.stringify({
                    attachments: config.attachments ? config.attachments : [],
                    bcc: config.bcc ? config.bcc : [],
                    body: (config.parseBody ? config.body.split('\n').map(line => `<div class="ng-scope">${line}</div>`).join('') : config.body) + (config.signature ? `<div class="signature new-signature ng-scope">${config.signature}</div>` : ''),
                    cc: config.cc ? config.cc : [],
                    subject: config.subject ? config.subject : '(Aucun objet)',
                    to: config.to,
                });

                const res = await fetch(this.url + 'zimbra/draft', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                    method: 'POST',
                    body: message,
                });
                const json = await res.json();
                if (error(json, reject)) return;
                const id = json.id;

                const sendRes = await fetch(this.url + 'zimbra/send?id=' + id, {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                    method: 'POST',
                    body: message,
                });
                const sendJson = await sendRes.json();
                if (error(sendJson, reject)) return;
                resolve(sendJson.id);
            } catch (err) {
                reject(err);
            }
        });
    }
};
