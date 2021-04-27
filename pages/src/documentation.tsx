import { Link } from 'react-router-dom';

export const mdnUrl =
  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/';

export const MdnType = (type: string, label?: string) => (
  <div>
    <a href={mdnUrl + type}>{label || type}</a>
  </div>
);

export const EntType = (type: string, label?: string) => (
  <div>
    <Link to={'/docs/' + type}>{label || type}</Link>
  </div>
);

export const PromiseType = (type: any, array?: boolean) => (
  <div
    style={{
      display: 'flex',
    }}
  >
    <div>{MdnType('Promise')}</div>
    <div>{'<'}</div>
    <div>{type}</div>
    <div>{array && '[ ]'}</div>
    <div>{'>'}</div>
  </div>
);

export interface IParam {
  name: string;
  type: JSX.Element;
  required: boolean;
  default: string | null;
  description: string;
}

export interface IMethod {
  name: string;
  returns: JSX.Element;
  params: IParam[];
  description: string;
}

export interface IType {
  name: string;
  description: string;
  methods: IMethod[];
}

const documentation: IType[] = [
  {
    name: 'Session',
    description: 'The core Ent Wrapper class.',
    methods: [
      {
        name: 'login',
        description: 'Fetches a session cookie from the API.',
        returns: PromiseType(MdnType('Undefined', 'Void')),
        params: [
          {
            name: 'url',
            type: MdnType('String'),
            required: true,
            default: null,
            description:
              'The Ent url, depends on your region (eg: ent.iledefrance.fr)',
          },
          {
            name: 'username',
            type: MdnType('String'),
            required: true,
            default: null,
            description: 'Your Ent username (ususally firstname.lastname)',
          },
          {
            name: 'password',
            type: MdnType('String'),
            required: true,
            default: null,
            description: 'Your Ent password',
          },
        ],
      },
      {
        name: 'fetchLanguage',
        description: "Fetches the current user's preferred language.",
        returns: MdnType('String'),
        params: [],
      },
      {
        name: 'fetchMessages',
        description: 'Fetches a list of messages from the current user.',
        returns: PromiseType(EntType('Message'), true),
        params: [
          {
            name: 'folder',
            type: MdnType('String'),
            required: true,
            default: null,
            description: 'The system folder to fetch the messages from',
          },
          {
            name: 'page',
            type: MdnType('Number'),
            required: false,
            default: '0',
            description: 'The page of the folder to fetch the messages from',
          },
        ],
      },
      {
        name: 'fetchMessage',
        description: 'Fetches a message.',
        returns: PromiseType(EntType('Message')),
        params: [
          {
            name: 'messageId',
            type: MdnType('Number'),
            required: true,
            default: null,
            description: 'The id of the message',
          },
        ],
      },
      {
        name: 'fetchUserInfo',
        description: 'Fetches information about the current user.',
        returns: PromiseType(MdnType('Object'), false),
        params: [],
      },
      {
        name: 'fetchPinnedApps',
        description: "Fetches the current user's pinned apps.",
        returns: PromiseType(EntType('App'), true),
        params: [],
      },
      {
        name: 'searchUsers',
        description:
          'Searches for user profiles and returns an UserPreview array.',
        returns: PromiseType(EntType('UserPreview'), true),
        params: [
          {
            name: 'classes',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'An array of classes id',
          },
          {
            name: 'functions',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'An array of functions id',
          },
          {
            name: 'mood',
            type: MdnType('Boolean'),
            required: false,
            default: null,
            description: 'Not sure what this does...',
          },
          {
            name: 'profiles',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'An array of profiles (Student, Teacher...)',
          },
          {
            name: 'search',
            type: MdnType('String'),
            required: false,
            default: null,
            description: 'The query',
          },
        ],
      },
      {
        name: 'fetchUser',
        description: 'Fetches an Ent user by id.',
        returns: PromiseType(EntType('User')),
        params: [
          {
            name: 'userId',
            type: MdnType('Number'),
            required: true,
            default: null,
            description: 'The id of the user',
          },
        ],
      },
      {
        name: 'sendMessage',
        description:
          'Sends a message to a list of Ent users and returns the message id.',
        returns: PromiseType(MdnType('Number')),
        params: [
          {
            name: 'body',
            type: MdnType('String'),
            required: true,
            default: null,
            description: 'The body of the message',
          },
          {
            name: 'subject',
            type: MdnType('String'),
            required: false,
            default: '(Aucun objet)',
            description: 'The subject of the message',
          },
          {
            name: 'parseBody',
            type: MdnType('Boolean'),
            required: false,
            default: 'false',
            description:
              'Wether the body of the message should be converted from text to HTML or not',
          },
          {
            name: 'signature',
            type: MdnType('String'),
            required: false,
            default: null,
            description: 'The signature of the message',
          },
          {
            name: 'attachments',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Not implemented yet.',
          },
          {
            name: 'cc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of cc users id',
          },
          {
            name: 'bcc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of bcc users id',
          },
          {
            name: 'to',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of users id to send this message to',
          },
        ],
      },
    ],
  },
  {
    name: 'Message',
    description: 'The Ent Message class.',
    methods: [
      {
        name: 'toJSON',
        description: 'Returns this message instance as a JSON object.',
        returns: MdnType('Object'),
        params: [],
      },
      {
        name: 'fetchBody',
        description: 'Fetches the message body and marks the message as read.',
        returns: PromiseType(MdnType('String')),
        params: [
          {
            name: 'parse',
            type: MdnType('Boolean'),
            required: true,
            default: null,
            description: 'Wether the HTML should be decoded or not.',
          },
        ],
      },
      {
        name: 'fetchAuthor',
        description: 'Fetches the author of the message.',
        returns: PromiseType(EntType('User')),
        params: [],
      },
      {
        name: 'reply',
        description: 'Replies to this message and return the reply id.',
        returns: PromiseType(MdnType('Number')),
        params: [
          {
            name: 'body',
            type: MdnType('String'),
            required: true,
            default: null,
            description: 'The body of the message',
          },
          {
            name: 'subject',
            type: MdnType('String'),
            required: false,
            default: 'Re : *the subject of this message*',
            description: 'The subject of the message',
          },
          {
            name: 'parseBody',
            type: MdnType('Boolean'),
            required: false,
            default: 'false',
            description:
              'Wether the body of the message should be converted from text to HTML or not',
          },
          {
            name: 'signature',
            type: MdnType('String'),
            required: false,
            default: null,
            description: 'The signature of the message',
          },
          {
            name: 'attachments',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Not implemented yet.',
          },
          {
            name: 'cc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of cc users id',
          },
          {
            name: 'bcc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of bcc users id',
          },
          {
            name: 'to',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of users id to send this message to',
          },
        ],
      },
      {
        name: 'moveToTrash',
        description: 'Moves the message to the trash folder.',
        returns: PromiseType(MdnType('Undefined', 'Void')),
        params: [],
      },
    ],
  },
  {
    name: 'User',
    description: 'The Ent User class.',
    methods: [
      {
        name: 'toJSON',
        description: 'Returns this user instance as a JSON object.',
        returns: MdnType('Object'),
        params: [],
      },
      {
        name: 'sendMessage',
        description: 'Sends a message to this user and returns the message id.',
        returns: PromiseType(MdnType('Number')),
        params: [
          {
            name: 'body',
            type: MdnType('String'),
            required: true,
            default: null,
            description: 'The body of the message',
          },
          {
            name: 'subject',
            type: MdnType('String'),
            required: false,
            default: '(Aucun objet)',
            description: 'The subject of the message',
          },
          {
            name: 'parseBody',
            type: MdnType('Boolean'),
            required: false,
            default: 'false',
            description:
              'Wether the body of the message should be converted from text to HTML or not',
          },
          {
            name: 'signature',
            type: MdnType('String'),
            required: false,
            default: null,
            description: 'The signature of the message',
          },
          {
            name: 'attachments',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Not implemented yet.',
          },
          {
            name: 'cc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of cc users id',
          },
          {
            name: 'bcc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of bcc users id',
          },
          {
            name: 'to',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of users id to send this message to',
          },
        ],
      },
      {
        name: 'avatarURL',
        description: "Returns the user's avatar url.",
        returns: MdnType('String'),
        params: [],
      },
    ],
  },
  {
    name: 'UserPreview',
    description:
      'The Ent UserPreview class, similar to User but with some missing properties.',
    methods: [
      {
        name: 'toJSON',
        description: 'Returns this current as a JSON object.',
        returns: MdnType('Object'),
        params: [],
      },
      {
        name: 'sendMessage',
        description: 'Sends a message to this user and returns the message id.',
        returns: PromiseType(MdnType('Number')),
        params: [
          {
            name: 'body',
            type: MdnType('String'),
            required: true,
            default: null,
            description: 'The body of the message',
          },
          {
            name: 'subject',
            type: MdnType('String'),
            required: false,
            default: '(Aucun objet)',
            description: 'The subject of the message',
          },
          {
            name: 'parseBody',
            type: MdnType('Boolean'),
            required: false,
            default: 'false',
            description:
              'Wether the body of the message should be converted from text to HTML or not',
          },
          {
            name: 'signature',
            type: MdnType('String'),
            required: false,
            default: null,
            description: 'The signature of the message',
          },
          {
            name: 'attachments',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Not implemented yet.',
          },
          {
            name: 'cc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of cc users id',
          },
          {
            name: 'bcc',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of bcc users id',
          },
          {
            name: 'to',
            type: MdnType('String', 'String[ ]'),
            required: false,
            default: null,
            description: 'Array of users id to send this message to',
          },
        ],
      },
      {
        name: 'fetchUser',
        description: 'Fetches the user from UserPreview.',
        returns: PromiseType(EntType('User')),
        params: [],
      },
      {
        name: 'avatarURL',
        description: "Returns the user's avatar url",
        returns: MdnType('String'),
        params: [],
      },
    ],
  },
  {
    name: 'App',
    description: 'The Ent App class.',
    methods: [
      {
        name: 'toJSON',
        description: 'Returns this app instance as a JSON object.',
        returns: MdnType('Object'),
        params: [],
      },
      {
        name: 'fullAddress',
        description: 'Returns the full address of the app.',
        returns: MdnType('String'),
        params: [],
      },
      {
        name: 'pin',
        description: 'Pins the app.',
        returns: PromiseType(MdnType('Undefined', 'Void')),
        params: [],
      },
      {
        name: 'unpin',
        description: 'Unins the app.',
        returns: PromiseType(MdnType('Undefined', 'Void')),
        params: [],
      },
    ],
  },
];

export default documentation;
