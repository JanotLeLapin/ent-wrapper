import fetch from 'node-fetch';
import { htmlToText } from 'html-to-text';

import Session from './session';
import User from './user';

import { error } from '../util';

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
     * Fetches the message body.
     * @param parse Wether the body should be decoded or not
     */
    fetchBody(parse: boolean): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                if (!this.session.authCookie) return reject('Missing auth cookie.');
                if (this.body) return resolve(this.body);
                const res = await fetch(this.session.url + 'zimbra/message/' + this.id, {
                    headers: {
                        'Cookie': this.session.authCookie,
                    },
                });
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
        })
    }

    /**
     * Replies to this message and returns the reply's id.
     * @param subject The subject of the message
     * @param body The body of the message
     * @param to A list of users ids
     * @param parseBody Wether the body should be parsed or not
     * @param signature A custom signature
     * @param attachments A list of attachments
     * @param cc
     * @param bcc
     */
    reply(subject: string, body: string, parseBody?: boolean, signature?: string, attachments?: string[], cc?: string[], bcc?: string[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            try {
                if (!this.session.authCookie) return reject('Missing auth cookie.');

                const message = JSON.stringify({
                    attachments: attachments ? attachments : [],
                    bcc: bcc ? bcc : [],
                    body: (parseBody ? body.split('\n').map(line => `<div class="ng-scope">${line}</div>`).join('') : body) + (signature ? `<div class="signature new-signature ng-scope">${signature}</div>` : ''),
                    cc: cc ? cc : [],
                    subject,
                    to: [this.from],
                });

                const res = await fetch(this.session.url + 'zimbra/draft?In-Reply-To=' + this.id + '&reply=undefined', {
                    headers: {
                        'Cookie': this.session.authCookie,
                    },
                    method: 'POST',
                    body: message,
                });
                const json = await res.json();
                if (error(json, reject)) return;
                const id = json.id;

                const sendRes = await fetch(this.session.url + 'zimbra/send?id=' + id + '&In-Reply-To=' + this.id, {
                    headers: {
                        'Cookie': this.session.authCookie,
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

    /**
     * Moves the message to the trash folder.
     */
    moveToTrash(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (!this.session.authCookie) return reject('Missing auth cookie.');

                const res = await fetch(this.session.url + 'zimbra/trash?id=' + this.id, {
                    headers: {
                        'Cookie': this.session.authCookie,
                    },
                    method: 'PUT',
                });
                const json = await res.json();
                if (error(json, reject)) return;

                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Permanently deletes the message.
     */
    delete(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (!this.session.authCookie) return reject('Missing auth cookie.');

                const res = await fetch(this.session.url + 'zimbra/delete?id=' + this.id, {
                    headers: {
                        'Cookie': this.session.authCookie,
                    },
                    method: 'DELETE',
                });
                const json = await res.json();
                if (error(json, reject)) return;

                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }
};
