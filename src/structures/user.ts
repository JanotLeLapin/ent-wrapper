import { Session } from './session';
import { IMessageConfig } from './message';

export interface IUserPreview {
  id: string;
  displayName: string;
  groupDisplayName: string;
  profile: profile;
}

export interface IHobby {
  visibility: 'PUBLIC' | 'PRIVE';
  category: string;
  values: string;
}

export interface IUser {
  id: string;
  login: string;
  displayName: string;
  type: string[];
  schools: {
    classes: string[];
    name: string;
    id: string;
  }[];
  motto: string;
  mood: string;
  health: string;
  address: string;
  email: string;
  tel: string;
  mobile: string;
  birthdate: string;
  hobbies: IHobby[];
}

export type profile =
  | 'Teacher'
  | 'Guest'
  | 'Relative'
  | 'Personnel'
  | 'Student';

export class UserPreview {
  session: Session;

  id: string;
  displayName: string;
  groupDisplayName: string;
  profile: profile;

  constructor(data: any) {
    this.session = data.session;

    this.id = data.id;
    this.displayName = data.displayName;
    this.groupDisplayName = data.groupDisplayName;
    this.profile = data.profile;
  }

  /**
   * Returns this user preview instance as a JSON object.
   */
  toJSON(): IUserPreview {
    return {
      id: this.id,
      displayName: this.displayName,
      groupDisplayName: this.groupDisplayName,
      profile: this.profile,
    };
  }

  /**
   * Sends a message to this user preview and returns the message id.
   * @param config The configuration of the message
   */
  sendMessage(config: IMessageConfig): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie) return reject('Missing auth cookie.');
        const id = await this.session.sendMessage({
          ...config,
          to: [...(config.to || []), this.id],
        });
        resolve(id);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Fetches user from userpreview.
   */
  fetchUser(): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      try {
        if (!this.session) return reject('Missing auth cookie.');
        const user = await this.session.fetchUser(this.id);
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Returns the users avatar url.
   */
  avatarURL() {
    return (
      this.session.url + 'userbook/avatar/' + this.id + '?thumbnail=381x381'
    );
  }
}

export class User {
  session: Session;

  id: string;
  login: string;
  displayName: string;
  type: string[];
  schools: {
    classes: string[];
    name: string;
    id: string;
  }[];
  motto: string;
  mood: string;
  health: string;
  address: string;
  email: string;
  tel: string;
  mobile: string;
  birthdate: string;
  hobbies: IHobby[];

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
  }

  /**
   * Sends a message to this user and returns the message id.
   * @param config The configuration of the message
   */
  sendMessage(config: IMessageConfig): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie) return reject('Missing auth cookie.');
        const id = await this.session.sendMessage({
          ...config,
          to: [...(config.to || []), this.id],
        });
        resolve(id);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Returns the users avatar url.
   */
  avatarURL() {
    return (
      this.session.url + 'userbook/avatar/' + this.id + '?thumbnail=381x381'
    );
  }
}
