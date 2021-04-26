import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const registeredLanguages: any = {};

export interface IProps {
  language: string;
}

class Code extends Component<IProps, { loaded: boolean }> {
  codeNode: React.RefObject<unknown>;
  static propTypes: {
    children: PropTypes.Validator<
      | string
      | number
      | boolean
      | {}
      | PropTypes.ReactElementLike
      | PropTypes.ReactNodeArray
    >;
    language: PropTypes.Requireable<string>;
  };
  constructor(props: IProps) {
    super(props);
    this.state = { loaded: false };
    this.codeNode = React.createRef();
  }

  componentDidMount() {
    const { language } = this.props;
    if (language && !registeredLanguages[language]) {
      try {
        const newLanguage = require(`highlight.js/lib/languages/${language}`);
        hljs.registerLanguage(language, newLanguage);
        registeredLanguages[language] = true;
        this.setState(
          () => {
            return { loaded: true };
          },
          () => {
            this.highlight();
          }
        );
      } catch (e) {
        console.error(e);
        throw Error(`Cannot register and higlight language ${language}`);
      }
    } else {
      this.setState({ loaded: true });
    }
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight = () => {
    this.codeNode &&
      this.codeNode.current &&
      hljs.highlightBlock(this.codeNode.current as any);
  };

  render() {
    const { language, children } = this.props;
    const { loaded } = this.state;
    if (!loaded) return '';

    return (
      <pre>
        <code ref={this.codeNode as any} className={language}>
          {children}
        </code>
      </pre>
    );
  }
}

Code.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string,
};

export default Code;
