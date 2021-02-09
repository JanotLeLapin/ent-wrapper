import Session from './session';

export interface IUser {
    id: string;
    login: string;
    displayName: string;
    type: string[];
    schools: {
        classes: string[];
        name:    string;
        id:      string;
    }[];
    motto: string;
    mood: string;
    health: string;
    address: string;
    email: string;
    tel: string;
    mobile: string;
    birthdate: string;
    hobbies: string;
}

export default class User {
    session: Session;

    id: string;
    login: string;
    displayName: string;
    type: string[];
    schools: {
        classes: string[];
        name:    string;
        id:      string;
    }[];
    motto: string;
    mood: string;
    health: string;
    address: string;
    email: string;
    tel: string;
    mobile: string;
    birthdate: string;
    hobbies: string;

    constructor(data: any) {
        this.session = data.session;

        this.id = data.id;
        this.login = data.login;
        this.displayName = data.displayName;
        this.type = data.type;
        this.schools = data.schools;
        this.motto = data.motto;
        this.mood = data.mood;
        this.health = data.health;
        this.address = data.address;
        this.email = data.email;
        this.tel = data.tel;
        this.mobile = data.mobile;
        this.birthdate = data.birthdate;
        this.hobbies = data.hobbies;
    }

    /**
     * Returns this user instance as a JSON object.
     */
    toJSON(): IUser {
        return {
            id: this.id,
            login: this.login,
            displayName: this.displayName,
            type: this.type,
            schools: this.schools,
            motto: this.motto,
            mood: this.mood,
            health: this.health,
            address: this.address,
            email: this.email,
            tel: this.tel,
            mobile: this.mobile,
            birthdate: this.birthdate,
            hobbies: this.hobbies,
        };
    };

    /**
     * Sends a message to this user and returns the message id.
     * @param subject The subject of the message
     * @param body The body of the message
     * @param to A list of users ids
     * @param parseBody Wether the body should be parsed or not
     * @param signature A custom signature
     * @param attachments A list of attachments
     * @param cc
     * @param bcc
     */
    sendMessage(subject: string, body: string, parseBody?: boolean, signature?: string, attachments?: string[], cc?: string[], bcc?: string[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            try {
                if (!this.session.authCookie) return reject('Missing auth cookie.');
                const id = await this.session.sendMessage(subject, body, [this.id], parseBody, signature, attachments, cc, bcc);
                resolve(id);
            } catch (err) {
                reject(err);
            }
        });
    }
};
