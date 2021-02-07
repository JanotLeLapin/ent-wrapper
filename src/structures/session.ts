import fetch from 'node-fetch';
import https from 'https';

import Message from './message';

import { baseUrl } from '../util';
import User from './user';

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
    apps:                IApp[];
    childrenIds:         any[];
    children:            IChildren;
    widgets:             IWidget[];
};

export interface IApp {
    name:        string;
    address:     string;
    icon:        string;
    target:      Target | null;
    displayName: string;
    display:     boolean;
    prefix:      null | string;
    casType:     null | string;
    scope:       Scope[];
};

export enum Scope {
    Empty = '',
    Myinfos = 'myinfos',
    Userinfo = 'userinfo',
};

export enum Target {
    Blank = '_blank',
    Empty = '',
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

export default class Session {
    authCookie?: string;

    /**
     * Fetches a session cookie from the API.
     * @param username Your ENT username (usually first name.last name)
     * @param password Your ENT password
     */
    login(username: string, password: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const data = `email=${username}&password=${password}&callBack=https%253A%252F%252Fent.iledefrance.fr%252Ftimeline%252Ftimeline&details=`;
                const req = https.request({
                    hostname: 'ent.iledefrance.fr',
                    path: '/auth/login',
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cookie': 'webviewignored=true:1hPTD+eIINwwCLLaCxDmq1mvlTs=',
                        'Connection': 'keep-alive',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': data.length,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 OPR/73.0.3856.344',
                    },
                }, res => {
                    this.authCookie = res.headers['set-cookie']?.map(cookie => cookie.split(';')[0]).join(';');
                    res.destroy();
                    resolve();
                });
                req.write(data);
                req.end();
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
                if (!this.authCookie) return reject();
                const res = await fetch(baseUrl + 'userbook/preference/language', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                resolve(JSON.parse(json.preference)['default-domain']);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches a list of messages from the user's inbox.
     * @param page The inbox page
     */
    fetchMessages(page: number): Promise<Message[]> {
        return new Promise<Message[]>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject();
                const res = await fetch(baseUrl + 'zimbra/list?folder=Inbox&page=' + page + '&unread=false', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json: any[] = await res.json();
                resolve(json.map(message => new Message({ ...message, session: this })));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches informations about the user.
     */
    fetchCurrenthUserInfo(): Promise<IUser> {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject();
                const res = await fetch(baseUrl + 'auth/oauth2/userinfo', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                const tempDate = json.birthDate.split('-');
                resolve({ ...json, birthDate: new Date(tempDate[0], tempDate[1] - 1, tempDate[2]) });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Fetches an ENT user from its id.
     * @param userId The id of the user
     */
    fetchUser(userId: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject();
                const res = await fetch(baseUrl + 'userbook/api/person?id=' + userId, {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                });
                const json = await res.json();
                resolve(new User({ ...json.result[0], session: this }));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Sends a message to a list of ENT users.
     * @param subject The subject of the message
     * @param body The body of the message
     * @param to A list of users ids
     * @param parseBody Wether the body should be parsed or not
     * @param signature A custom signature
     * @param attachments A list of attachments
     * @param cc
     * @param bcc
     */
    sendMessage(subject: string, body: string, to: string[], parseBody?: boolean, signature?: string, attachments?: string[], cc?: string[], bcc?: string[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (!this.authCookie) return reject();

                const message = JSON.stringify({
                    attachments: attachments ? attachments : [],
                    bcc: bcc ? bcc : [],
                    body: (parseBody ? body.split('\n').map(line => `<div class="ng-scope">${line}</div>`).join('') : body) + (signature ? `<div class="signature new-signature ng-scope">${signature}</div>` : ''),
                    cc: cc ? cc : [],
                    subject,
                    to,
                });

                const res = await fetch(baseUrl + 'zimbra/draft', {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                    method: 'POST',
                    body: message,
                });
                const json = await res.json();
                const id = json.id;

                await fetch(baseUrl + 'zimbra/send?id=' + id, {
                    headers: {
                        'Cookie': this.authCookie,
                    },
                    method: 'POST',
                    body: message,
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
};