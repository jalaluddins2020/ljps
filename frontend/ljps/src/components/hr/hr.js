import React from 'react';
import styles from './hr.module.css';
import Button from 'react-bootstrap/Button';

class hrDashboard extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <h2>Welcome to LJPS - HR (Admin)</h2>
        <h5>Who are you logging in as?</h5>
        <div>
          <Button variant="success" className={styles.btns} href="/staff">Staff</Button>{' '}
          <Button variant="success" className={styles.btns} href="/hr/roles">HR</Button>{' '}
          <div>
            <Button variant="dark" className={styles.btns} href="/">Back</Button>{' '}
          </div>
        </div>
      </div>

      
    )
  }
}


export default hrDashboard;
