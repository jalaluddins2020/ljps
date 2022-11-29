import React from 'react';
import styles from './manager.module.css';
import Button from 'react-bootstrap/Button';

class Manager extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <h2>Welcome to LJPS - Manager</h2>
        <h5>Who are you logging in as?</h5>
        <div>
          <Button variant="success" className={styles.btns} href="/staff">Staff</Button>{' '}
          <Button variant="success" className={`${styles.btns} ${styles.managerBtn}`} href="/manager">Manager (more to come)</Button>{' '}
          <div>
            <Button variant="dark" className={styles.btns} href="/">Back</Button>{' '}</div>
        </div>
      </div>
    )
  }
}


export default Manager;
