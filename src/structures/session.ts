import fetch from 'node-fetch';
import https from 'https';

import { Message, IMessageConfig } from './message';
import { User, UserPreview, profile } from './user';
import { App } from './app';

import { encodeUrl, error, htmlToText } from '../util';

export interface IUserInfo {
  classNames: string[];
  level: string;
  login: string;
  lastName: string;
  firstName: string;
  externalId: string;
  federated: any;
  birthDate: Date;
  forceChangePassword: any;
  needRevalidateTerms: boolean;
  deletePending: boolean;
  username: string;
  type: string;
  hasPw: boolean;
  functions: IChildren;
  groupsIds: string[];
  federatedIDP: any;
  optionEnabled: any[];
  userId: string;
  structures: string[];
  structureNames: string[];
  uai: string[];
  hasApp: boolean;
  classes: string[];
  authorizedActions: IAuthorizedAction[];
  apps: App[];
  childrenIds: any[];
  children: IChildren;
  widgets: IWidget[];
}

export interface IAuthorizedAction {
  name: string;
  displayName: string;
  type: Type;
}

export enum Type {
  SecuredActionWorkflow = 'SECURED_ACTION_WORKFLOW',
}

export interface IChildren {}

export interface IWidget {
  application: null | string;
  i18n: string;
  name: string;
  path: string;
  mandatory: boolean;
  id: string;
  js: string;
}

export interface IQuery {
  classes?: string[];
  functions?: string[];
  mood?: boolean;
  profiles?: profile[];
  search?: string;
}

export class Session {
  authCookie?: string;
  xsrf?: string;
  url?: string;

  constructor(url: string, private username: string, private password: string) {
    this.url =
      (url.startsWith('https://') ? url : 'https://' + url) +
      (url.endsWith('/') ? '' : '/');
  }

  /**
   * Fetches a session cookie from the API.
   * @param url The ent url, depending on your region (eg: ent.iledefrance.fr)
   * @param username Your ENT username (usually firstname.lastname)
   * @param password Your ENT password
   */
  private login(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const data = `email=${this.username}&password=${encodeUrl(
          this.password
        )}&callBack=https%253A%252F%252Fent.iledefrance.fr%252Ftimeline%252Ftimeline&details=`;
        const req0 = https.request(
          {
            hostname: 'ent.iledefrance.fr',
            path: '/auth/login',
            method: 'POST',
            headers: {
              Accept: '*/*',
              'Accept-Encoding': 'gzip, deflate, br',
              Connection: 'keep-alive',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': data.length,
            },
          },
          (res0) => {
            res0.destroy();
            let cookies = res0.headers['set-cookie'];
            if (res0.statusCode === 200 || !cookies)
              return reject(new Error('Auth failed.'));

            cookies = cookies.map((cookie) => cookie.split(';')[0]);
            this.xsrf = cookies
              .find((cookie) => cookie.startsWith('XSRF-TOKEN'))
              ?.split('=')[1];
            this.authCookie = cookies.find((cookie) =>
              cookie.startsWith('oneSessionId')
            );
            resolve();
          }
        );
        req0.write(data);
        req0.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  fetch(path: string, body?: string, method?: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        if (!this.authCookie) await this.login();

        const res = await fetch(this.url + path, {
          headers: {
            Cookie: `${this.authCookie}; XSRF-TOKEN=${this.xsrf}`,
            'X-XSRF-TOKEN': this.xsrf as string,
          },
          method: method ? method : 'GET',
          body: body ? body : undefined,
        });

        const json = await res.json();
        if (error(json, reject))
          return reject(new Error('Could not fetch data.'));

        resolve(json);
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
        const json = await this.fetch('userbook/preference/language');
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
  fetchMessages(
    folder: 'Inbox' | 'Sent' | 'Drafts' | 'Trash',
    page = 0
  ): Promise<Message[]> {
    return new Promise<Message[]>(async (resolve, reject) => {
      try {
        if (!['Inbox', 'Sent', 'Drafts', 'Trash'].includes(folder))
          return reject(new Error('Invalid folder'));

        const json: any[] = await this.fetch(
          `zimbra/list?folder=${folder}&page=${page}&unread=false`
        );
        resolve(
          json.map((message) => new Message({ ...message, session: this }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Fetches a message.
   * @param messageId The id of the message
   * @param parse Whether the body should be decoded
   */
  fetchMessage(messageId: number, parse?: boolean): Promise<Message> {
    return new Promise<Message>(async (resolve, reject) => {
      try {
        const json = await this.fetch(`zimbra/message/${messageId}`);
        resolve(
          new Message({
            ...json,
            body: parse ? htmlToText(json.body) : json.body,
            session: this,
          })
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Fetches informations about the user.
   */
  fetchUserInfo(): Promise<IUserInfo> {
    return new Promise<IUserInfo>(async (resolve, reject) => {
      try {
        const json = await this.fetch('auth/oauth2/userinfo');
        const tempDate = json.birthDate.split('-');
        resolve({
          ...json,
          birthDate: new Date(tempDate[0], tempDate[1] - 1, tempDate[2]),
          apps: json.apps.map((app: any) => new App({ ...app, session: this })),
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Fetches the user's pinned apps.
   */
  fetchPinnedApps(): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      try {
        const json = await this.fetch('userbook/preference/apps');
        resolve(JSON.parse(json.preference).bookmarks);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Searches for user profiles and returns an UserPreview array.
   * @param query The query
   */
  searchUsers(query: IQuery): Promise<UserPreview[]> {
    return new Promise<UserPreview[]>(async (resolve, reject) => {
      try {
        const json: { users: any[] } = await this.fetch(
          'communication/visible',
          JSON.stringify(query),
          'POST'
        );
        resolve(
          json.users.map(
            (userpreview) => new UserPreview({ ...userpreview, session: this })
          )
        );
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
        const json = await this.fetch('userbook/api/person?id=' + userId);
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
        if (!config.to) return reject('No destination specified.');

        const message = JSON.stringify({
          attachments: config.attachments ? config.attachments : [],
          bcc: config.bcc ? config.bcc : [],
          body:
            (config.parseBody
              ? config.body
                  .split('\n')
                  .map((line) => `<div class="ng-scope">${line}</div>`)
                  .join('')
              : config.body) +
            (config.signature
              ? `<div class="signature new-signature ng-scope">${config.signature}</div>`
              : ''),
          cc: config.cc ? config.cc : [],
          subject: config.subject ? config.subject : '(Aucun objet)',
          to: config.to,
        });

        const draftJson = await this.fetch('zimbra/draft', message, 'POST');
        const id = draftJson.id;

        const sendJson = await this.fetch(
          `zimbra/send?id=${id}`,
          message,
          'POST'
        );
        resolve(sendJson.id);
      } catch (err) {
        reject(err);
      }
    });
  }
}
