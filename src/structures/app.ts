import { Session } from './session';

export type target = '_blank' | '';
export type scope = '' | 'myinfos' | 'userinfo';

export interface IApp {
  name: string;
  address: string;
  icon: string;
  target?: target;
  displayName: string;
  display: boolean;
  prefix?: string;
  casType?: string;
  scope: scope[];
  isExternal: boolean;
}

export class App {
  session: Session;

  /** The code name of the app */
  name: string;
  /** The app uri path */
  address: string;
  icon: string;
  /** Html link target */
  target?: target;
  /** The display name of the app */
  displayName: string;
  /** Whether the end user should see this app */
  display: boolean;
  prefix?: string;
  casType?: string;
  scope: scope[];
  /** Whether this is a third-party app */
  isExternal: boolean;

  constructor(data: any, session: Session) {
    this.session = session;

    this.name = data.name;
    this.address = data.address;
    this.icon = data.icon;
    this.target = data.target;
    this.displayName = data.displayName;
    this.display = data.display;
    this.prefix = data.prefix;
    this.casType = data.casType;
    this.scope = data.scope;
    this.isExternal = data.isExternal;
  }

  /** Returns this app as a JSON object */
  toJSON(): IApp {
    return {
      name: this.name,
      address: this.address,
      icon: this.icon,
      target: this.target,
      displayName: this.displayName,
      display: this.display,
      prefix: this.prefix,
      casType: this.casType,
      scope: this.scope,
      isExternal: this.isExternal,
    };
  }

  /** Returns the full address of the app */
  fullAddress() {
    return this.address.startsWith('/')
      ? this.session.url + this.address.substring(1)
      : this.address;
  }
}
