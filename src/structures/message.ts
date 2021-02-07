import fetch from 'node-fetch';
import { htmlToText } from 'html-to-text';

import Session from './session';

import { baseUrl } from '../util';

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
    }

    /**
     * Fetches the message body.
     * @param parse Wether the body should be decoded or not
     */
    fetchBody(parse: boolean): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                if (!this.session.authCookie) return;
                const res = await fetch(baseUrl + 'zimbra/message/' + this.id, {
                    headers: {
                        'Cookie': this.session.authCookie,
                    },
                });
                const json = await res.json();
                resolve(parse ? htmlToText(json.body) : json.body);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Replies to this message.
     * @param subject The subject of the message
     * @param body The body of the message
     * @param to A list of users ids
     * @param parseBody Wether the body should be parsed or not
     * @param signature A custom signature
     * @param attachments A list of attachments
     * @param cc
     * @param bcc
     */
    reply(subject: string, body: string, parseBody?: boolean, signature?: string, attachments?: string[], cc?: string[], bcc?: string[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (!this.session.authCookie) return;

                const message = JSON.stringify({
                    attachments: attachments ? attachments : [],
                    bcc: bcc ? bcc : [],
                    body: (parseBody ? body.split('\n').map(line => `<div class="ng-scope">${line}</div>`).join('') : body) + (signature ? `<div class="signature new-signature ng-scope">${signature}</div>` : ''),
                    cc: cc ? cc : [],
                    subject,
                    to: [this.from],
                });

                const res = await fetch(baseUrl + 'zimbra/draft?In-Reply-To=' + this.id + '&reply=undefined', {
                    headers: {
                        'Cookie': this.session.authCookie,
                    },
                    method: 'POST',
                    body: message,
                });
                const json = await res.json();
                const id = json.id;

                await fetch(baseUrl + 'zimbra/send?id=' + id + '&In-Reply-To=' + this.id, {
                    headers: {
                        'Cookie': this.session.authCookie,
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