import { Session } from './session';
import { IMessageConfig } from './message';

export interface IUserPreview {
  id: string;
  displayName: string;
  groupDisplayName: string;
  profile: profile;
}

export interface IHobby {
  /** The visibility of the hobby */
  visibility: 'PUBLIC' | 'PRIVE';
  /** The category of the hobby */
  category: hobby;
  /** The user input on this hobby */
  values: string;
}

export interface IUser {
  id: string;
  login: string;
  displayName: string;
  type: profile[];
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

export type hobby =
  | 'sport'
  | 'cinema'
  | 'animals'
  | 'music'
  | 'places'
  | 'books';

export class UserPreview {
  session: Session;

  /** The uuid of the user */
  id: string;
  /** The first and last name of the user */
  displayName: string;
  groupDisplayName: string;
  /** The profile of the user (eg. Student, Teacher...) */
  profile: profile;

  constructor(data: any, session: Session) {
    this.session = session;

    this.id = data.id;
    this.displayName = data.displayName;
    this.groupDisplayName = data.groupDisplayName;
    this.profile = data.profile;
  }

  /** This user preview instance as a JSON object */
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

  /** Fetches user from preview */
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

  /** The users avatar url */
  avatarURL() {
    return (
      this.session.url + 'userbook/avatar/' + this.id + '?thumbnail=381x381'
    );
  }
}

export class User {
  session: Session;

  /** The uuid of the user */
  id: string;
  /** The account login of the user */
  login: string;
  /** The first and last name of the user */
  displayName: string;
  /** The profiles of the user */
  type: profile[];
  /** The schools of the user */
  schools: {
    /** The classes uuids of the user */
    classes: string[];
    /** The name of the school */
    name: string;
    /** The uuid of the school */
    id: string;
  }[];
  /** The motto of the user */
  motto: string;
  /** The mood of the user */
  mood: string;
  health: string;
  address: string;
  email: string;
  tel: string;
  mobile: string;
  /** The birth date of the user */
  birthdate: string;
  /** The hobbies of the user */
  hobbies: IHobby[];

  constructor(data: any, session: Session) {
    this.session = session;

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

  /** This user as a JSON object */
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

  /** The users avatar url */
  avatarURL() {
    return (
      this.session.url + 'userbook/avatar/' + this.id + '?thumbnail=381x381'
    );
  }
}
