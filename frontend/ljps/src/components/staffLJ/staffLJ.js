import React from 'react';
import styles from './staffLJ.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { Modal } from "react-bootstrap";


class StaffLJ extends React.Component {
  state = {
    staffID: "",
    courses: [],
    journeys: [],
    isConfirmDeleteOpen: false,
    isDeleteMessageOpen: false
  }

  openDeleteModal = () => {
    this.closeConfirmDeleteModal()
    this.setState({ isDeleteMessageOpen: true })
  };
  closeDeleteModal = () => {
    this.setState({ isDeleteMessageOpen: false })
    this.refreshPage()
  };

  refreshPage() {
    window.location.reload(false);
  }

  getTempRole = journey => this.setState({tempRoleID: journey.jobRoleID, tempRoleName: journey.jobRole})

  openConfirmDeleteModal = () => this.setState({ isConfirmDeleteOpen: true });
  closeConfirmDeleteModal = () => this.setState({ isConfirmDeleteOpen: false });

  componentDidMount() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const staffID = urlParams.get('staffID')
  this.setState({staffID: staffID})
// GET ALL COURSES COURSES FETCH
    fetch('http://127.0.0.1:5000/learning_journey/' + staffID)
    .then(response => response.json())
    .then(data => {
      let templjArr = []
      for (const [key, value] of Object.entries(data.data)) {
        templjArr.push(value);
      }

      this.setState({ journeys: templjArr})
    })
      
  }

  handleDeleteSkill = event => {
    event.preventDefault();
    const requestOptions = {
      method: 'Delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        staff_ID: this.state.staffID,
        job_role_ID: this.state.tempRoleID
      })
    };
    console.log(requestOptions)
    fetch('http://127.0.0.1:5000/learning_journey/delete', requestOptions)
    .then(response => response.json())
    .then(data => {
      this.setState({ deleteMessage: data.message })
          console.log(data)
    })
    this.openDeleteModal()
  }


  render() {


    return (
      <div className={styles.body}>
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/staff">Learning Journey</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="" active>Home</Nav.Link>
            {/* <Nav.Link href={"/staff/roles?staffID=" + this.state.staffID}>Roles</Nav.Link>
            <Nav.Link href="/staff/skills" >Skills</Nav.Link>
            <Nav.Link href="#/staff/courses" >Courses</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>
      <h2 className={styles.title}>Welcome to Learning Journey Planning System</h2>
      {/* <h5 className={styles.title}>Go to roles/skills - use dashboard</h5> */}

{/* ALL COURSES DISPLAY */}
<div className={styles.main}>
          <Container>
          
            <Row>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} >
              {
                  this.state.journeys
                    .map((journey, index)=>
                      // <div key={journey.jobRole}>{journey.staffID}</div>
                      <Card key={index} className={styles.cards}>
                      <Card.Body>
                        <Container>
                          <Row>
                            <Col xs={10}>
                              <Card.Title>
                                Learning Journey {index + 1} - {journey.jobRole}</Card.Title>
                              <Card.Text>
                                {/* Skills currently fulfilling: 
                                {journey.skills.map((skill, index) => (
                                <Badge bg="primary" key={index} className={styles.badges}>{skill}</Badge>
                                ))}
                              <br></br> */}
                              Courses Added
                                {journey.courseNames.map((course, index) => (
                                  <li key={index}>
                                    <Badge bg="primary"  className={styles.badges}>{course}</Badge>
                                  </li>
                                  ))}
                              </Card.Text>
                            </Col>
                            <Col xs={2}>
                              <Button variant="danger" size="sm" onClick={() => {this.getTempRole(journey);this.openConfirmDeleteModal()}}
                                >Delete
                              </Button>
                            </Col>
                          </Row>
                          <hr></hr>
                          <Row>
                            <Button variant="outline-primary" size="sm" href={"/staff/skills?ljID=" + journey.ljID + "&staffID=" + this.state.staffID + "&roleID=" + journey.jobRoleID + "&courseIDs=" + journey.courseIDs}
                              >Edit Learning Journey
                            </Button>
                          </Row>
                        </Container>
                      </Card.Body>
                    </Card>
                    )
                }
              </Col>
            </Row>
        </Container>
        </div>

        {/* CREATE NEW SKILL BUTTON */}
        <div className={styles.title}>
        <a href={"/staff/roles?staffID=" + this.state.staffID}>
          <Button variant="outline-success">Create Learning Journey</Button>
          </a>
        </div>

    {/* DELETE CONFIRM MODAL */}
    <Modal show={this.state.isConfirmDeleteOpen} onHide={this.closeConfirmDeleteModal}>
          <form onSubmit={this.handleDeleteSkill}>
            <Modal.Header closeButton>
              <Modal.Title>Deleting Learning Journey</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You are deleting a learning journey for role: {this.state.tempRoleName}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.closeConfirmDeleteModal}>
                Close
              </Button>
              <Button variant="outline-primary" type="submit">
                Confirm Delete
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

      {/* DELETE MESSAGE MODAL */}
        <Modal show={this.state.isDeleteMessageOpen} onHide={this.closeDeleteModal}>
              <Modal.Header><Modal.Title>Deletion of Learning Journey</Modal.Title></Modal.Header>
            <Modal.Body>
              <b>{this.state.deleteMessage}</b>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.closeDeleteModal}>
                Close
              </Button>
            </Modal.Footer>
        </Modal>
      </div>
    )
  }
}


export default StaffLJ;
