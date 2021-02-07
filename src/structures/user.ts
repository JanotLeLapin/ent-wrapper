import fetch from 'node-fetch';
import https from 'https';

import Message from './message';

import { baseUrl } from '../util';

export default class User {
    private authCookie?: string;

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
                resolve(json.map(message => new Message({ ...message, authCookie: this.authCookie })));
            } catch (err) {
                reject(err);
            }
        });
    }
};
