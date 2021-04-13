import fetch from 'node-fetch';
import { htmlToText } from 'html-to-text';

import Session from './session';
import User from './user';

import { error } from '../util';

export interface IMessage {
  attachments: any[];
  bcc: any[];
  cc: any[];
  date: Date;
  displayNames: string[][];
  from: string;
  hasAttachment: boolean;
  id: string;
  parentId: string;
  response: boolean;
  state: string;
  subject: string;
  systemFolder: string;
  threadId: string;
  to: string[];
  unread: boolean;
  body?: string;
}

export interface IMessageConfig {
  body: string;
  subject?: string;
  parseBody?: boolean;
  signature?: string;
  attachments?: string;
  cc?: string[];
  bcc?: string;
  to?: string[];
}

export default class Message {
  session: Session;

  attachments: any[];
  bcc: any[];
  cc: any[];
  date: Date;
  displayNames: string[][];
  from: string;
  hasAttachment: boolean;
  id: string;
  parentId: string;
  response: boolean;
  state: string;
  subject: string;
  systemFolder: string;
  threadId: string;
  to: string[];
  unread: boolean;
  body?: string;

  constructor(data: any) {
    this.session = data.session;

    this.attachments = data.attachments;
    this.bcc = data.bcc;
    this.cc = data.cc;
    this.date = new Date(data.date);
    this.displayNames = data.displayNames;
    this.from = data.from;
    this.hasAttachment = data.hasAttachment;
    this.id = data.id;
    this.parentId = data.parent_id;
    this.response = data.response;
    this.state = data.state;
    this.subject = data.subject;
    this.systemFolder = data.systemFolder;
    this.threadId = data.thread_id;
    this.to = data.to;
    this.unread = data.unread;
    this.body = data.body;
  }

  /**
   * Returns this message instance as a JSON object.
   */
  toJSON(): IMessage {
    return {
      attachments: this.attachments,
      bcc: this.bcc,
      cc: this.cc,
      date: this.date,
      displayNames: this.displayNames,
      from: this.from,
      hasAttachment: this.hasAttachment,
      id: this.id,
      parentId: this.parentId,
      response: this.response,
      state: this.state,
      subject: this.subject,
      systemFolder: this.systemFolder,
      threadId: this.threadId,
      to: this.to,
      unread: this.unread,
      body: this.body,
    };
  }

  /**
   * Fetches the message body and marks the message as read.
   * @param parse Wether the body should be decoded or not
   */
  fetchBody(parse: boolean): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie) return reject('Missing auth cookie.');
        if (this.body) return resolve(this.body);
        const res = await fetch(
          this.session.url + 'zimbra/message/' + this.id,
          {
            headers: {
              Cookie: this.session.authCookie,
            },
          }
        );
        const json = await res.json();
        if (error(json, reject)) return;
        resolve(parse ? htmlToText(json.body) : json.body);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Fetches the author of the message.
   */
  fetchAuthor(): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie) return reject('Missing auth cookie.');
        const user = await this.session.fetchUser(this.from);
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Replies to this message and returns the reply's id.
   * @param config The configuration of the message
   */
  reply(config: IMessageConfig): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie) return reject('Missing auth cookie.');

        const currentUserInfo = await this.session.fetchUserInfo();

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
              : '') +
            (config.parseBody
              ? `<p class="ng-scope">&nbsp;</p>\n<p class="row ng-scope"></p>\n<hr class="ng-scope">\n<p class="ng-scope"></p>\n<p class="medium-text ng-scope">\n    <span translate=""><span class="no-style ng-scope">De :</span></span><em class="ng-binding"> ${
                  (await this.fetchAuthor()).displayName
                }</em>\n    <br><span class="medium-importance" translate=""><span class="no-style ng-scope">Date :</span></span><em class="ng-binding"> ${this.date.toLocaleString(
                  'fr'
                )} </em>\n    <br><span class="medium-importance" translate=""><span class="no-style ng-scope">Objet :</span></span><em class="ng-binding"> ${
                  this.subject
                }</em>\n    <br><span class="medium-importance" translate=""><span class="no-style ng-scope">À :</span></span>\n    <!-- ngRepeat: receiver in mail.to --><em class="medium-importance ng-scope"><em class="ng-binding"> ${
                  currentUserInfo.lastName
                } ${
                  currentUserInfo.firstName
                }</em>\n    <!-- ngIf: $index !== mail.to.length - 1 && receiver.displayName -->\n    </em>\n    <!-- end ngRepeat: receiver in mail.to -->\n    <br><span class="medium-importance" translate=""><span class="no-style ng-scope">Copie à :</span></span>\n    <!-- ngRepeat: receiver in mail.cc -->\n</p>\n<blockquote class="ng-scope">${await this.fetchBody(
                  false
                )}</blockquote>`
              : ''),
          cc: config.cc ? config.cc : [],
          subject: config.subject ? config.subject : `Re : ${this.subject}`,
          to: [this.from],
        });

        const res = await fetch(
          this.session.url +
            'zimbra/draft?In-Reply-To=' +
            this.id +
            '&reply=undefined',
          {
            headers: {
              Cookie: this.session.authCookie,
            },
            method: 'POST',
            body: message,
          }
        );
        const json = await res.json();
        if (error(json, reject)) return;
        const id = json.id;

        const sendRes = await fetch(
          this.session.url + 'zimbra/send?id=' + id + '&In-Reply-To=' + this.id,
          {
            headers: {
              Cookie: this.session.authCookie,
            },
            method: 'POST',
            body: message,
          }
        );
        const sendJson = await sendRes.json();
        if (error(sendJson, reject)) return;
        resolve(sendJson.id);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Moves the message to the trash folder.
   */
  moveToTrash(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie) return reject('Missing auth cookie.');

        const res = await fetch(
          this.session.url + 'zimbra/trash?id=' + this.id,
          {
            headers: {
              Cookie: this.session.authCookie,
            },
            method: 'PUT',
          }
        );
        const json = await res.json();
        if (error(json, reject)) return;

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
