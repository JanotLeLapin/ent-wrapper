import fetch from 'node-fetch';

import { Session } from './session';

import { error } from '../util';

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
}

export class App {
  session: Session;

  name: string;
  address: string;
  icon: string;
  target?: target;
  displayName: string;
  display: boolean;
  prefix?: string;
  casType?: string;
  scope: scope[];

  constructor(data: any) {
    this.session = data.session;

    this.name = data.name;
    this.address = data.address;
    this.icon = data.icon;
    this.target = data.target;
    this.displayName = data.displayName;
    this.display = data.display;
    this.prefix = data.prefix;
    this.casType = data.casType;
    this.scope = data.scope;
  }

  /**
   * Returns this app instance as a JSON object.
   */
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
    };
  }

  /**
   * Returns the full address of the app.
   */
  fullAddress() {
    return this.address.startsWith('/')
      ? this.session.url + this.address.substring(1)
      : this.address;
  }

  /**
   * Pins this app.
   */
  pin(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie || !this.session.xsrf)
          return reject('Missing auth cookie.');
        const apps = await this.session.fetchPinnedApps();
        const res = await fetch(this.session.url + 'userbook/preference/apps', {
          headers: {
            Cookie: this.session.authCookie,
            'X-XSRF-TOKEN': this.session.xsrf,
          },
          method: 'PUT',
          body: JSON.stringify([
            ...apps.map((app) => app.toJSON()),
            this.toJSON(),
          ]),
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
   * Unpins this app.
   */
  unpin(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.session.authCookie || !this.session.xsrf)
          return reject('Missing auth cookie.');
        const apps = await this.session.fetchPinnedApps();
        const res = await fetch(this.session.url + 'userbook/preference/apps', {
          headers: {
            Cookie: this.session.authCookie,
            'X-XSRF-TOKEN': this.session.xsrf,
          },
          method: 'PUT',
          body: JSON.stringify(
            apps
              .filter((app) => app.name !== this.name)
              .map((app) => app.toJSON())
          ),
        });
        const json = await res.json();
        if (error(json, reject)) return;
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
