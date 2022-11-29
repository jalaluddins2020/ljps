import React from 'react';
import styles from './staff.module.css';
import Button from 'react-bootstrap/Button';

class Staff extends React.Component {
  state = {
    staffID: ""
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div className={styles.body}>
        <h2>Please enter Staff ID</h2>
        <div>
          <input type="text" className={styles.input} placeholder="Staff ID" 
            name="staffID"
            onChange={(e) => {
            this.handleChange(e)}}>
          </input>
          </div>
        <div>
          <Button variant="dark" className={styles.btns} href="/">Back</Button>{' '}
          <Button variant="success" className={styles.btns} href={"/staff/lj?staffID=" + this.state.staffID}>Sign In</Button>{' '}
        </div>
      </div>
    )
  }
}


export default Staff;
