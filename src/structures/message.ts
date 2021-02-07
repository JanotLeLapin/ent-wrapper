import fetch from 'node-fetch';
import { htmlToText } from 'html-to-text';

import { baseUrl } from '../util';

export default class Message {
    authCookie: string;

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
        this.authCookie = data.authCookie;

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
                const res = await fetch(baseUrl + 'zimbra/message/' + this.id, {
                    headers: {
                        'Cookie': this.authCookie,
                    }
                });
                const json = await res.json();
                resolve(parse ? htmlToText(json.body) : json.body);
            } catch (err) {
                reject(err);
            }
        });
    }
};
