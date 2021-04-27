import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Doc from './Doc';
import docs from './documentation';

import styles from './Docs.module.css';

export interface IParams {
  type?: string;
}

const Docs = () => {
  const { type } = useParams<IParams>();
  const doc = docs.find((d) => d.name === type);
  return (
    <div className={styles.Docs}>
      <ul className={styles.Navbar}>
        <li>General</li>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/docs">Welcome</Link>
          </li>
          <li>
            <a href="https://github.com/JanotLeLapin/ent-wrapper">GitHub</a>
          </li>
        </ul>
        <li>Classes</li>
        <ul>
          {docs.map((t) => (
            <li key={t.name}>
              <Link to={'/docs/' + t.name}>{t.name}</Link>
            </li>
          ))}
        </ul>
      </ul>
      <div className={styles.DocWrapper}>
        {doc ? (
          <Doc doc={doc} />
        ) : (
          <div>
            <h1>Working on it...</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Docs;
