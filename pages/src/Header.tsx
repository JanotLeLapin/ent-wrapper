import { Link } from 'react-router-dom';

import styles from './Header.module.css';

const Header = () => (
  <header className={styles.Header}>
    <h1>Ent Wrapper</h1>
    <div className={styles.Links}>
      <h2>
        <Link to="/docs">Docs</Link>
      </h2>
      <h2>
        <a href="https://github.com/JanotLeLapin/ent-wrapper">GitHub</a>
      </h2>
    </div>
  </header>
);

export default Header;
