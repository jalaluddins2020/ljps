import React from 'react';
import styles from './login.module.css';
import Button from 'react-bootstrap/Button';

class Login extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <h2>Welcome to the Learning Journey Planning System</h2>
        <div>
          <Button variant="success" className={styles.btns} href="/staff">Staff</Button>{' '}
          <Button variant="success" className={styles.btns} href="/manager">Manager</Button>{' '}
          <Button variant="success" className={styles.btns} href="/hr">HR</Button>{' '}
        </div>
      </div>
    )
  }
}


export default Login;
