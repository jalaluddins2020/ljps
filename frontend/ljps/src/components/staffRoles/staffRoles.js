import React from 'react';
import styles from './staffRoles.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Breadcrumb from 'react-bootstrap/Breadcrumb';


class StaffRoles extends React.Component {
  state = {
    staffID: "",
    roles: [],
  }

  componentDidMount() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const staffID = urlParams.get('staffID')
  this.setState({staffID: staffID})
// GET ALL COURSES COURSES FETCH
  let firstAPICall = fetch('http://127.0.0.1:5000/job_role');
  let secondAPICall = fetch('http://127.0.0.1:5000/learning_journey/' + staffID);

  Promise.all([firstAPICall, secondAPICall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(data => {

        const roles = data[0].data
        const journeys = data[1].data

        let templjArr = []
        for (const [key, value] of Object.entries(journeys)) {
          templjArr.push(value);
        }

        let tempRoles = []
        for (let lj of templjArr) {
          if (!tempRoles.includes(lj.jobRole)) {
            tempRoles.push(lj.jobRole)
          }
        }

        for (let role of roles) {
          if (tempRoles.includes(role.Job_Role_Name)) {
            const index = roles.indexOf(role)
            roles.splice(index, 1)
          }
        }
        this.setState({ roles: roles })
      })

      // fetch('http://127.0.0.1:5000/job_role')
    // .then(response => response.json())
    // .then(data => {
    //   this.setState({ roles: data.data })
    //   console.log(data.data)})
  }


  render() {


    return (
      <div className={styles.body}>
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/staff">Learning Journey</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href={"/staff/lj?staffID=" + this.state.staffID}>Home</Nav.Link>
            {/* <Nav.Link href="" active>Roles</Nav.Link>
            <Nav.Link href="/staff/skills" >Skills</Nav.Link>
            <Nav.Link href="#/staff/courses" >Courses</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>
      <h5 className={styles.title}><a href={"/staff/lj?staffID=" + this.state.staffID}>Learning Journey</a> &gt;&gt; Select a Role</h5>

{/* ALL COURSES DISPLAY */}
        <div className={styles.main}>
          <Container>
          
            <Row>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} >
              {
                  this.state.roles
                    .map(role =>
                      <Card key={role.Job_Role_ID} className={styles.cards}>
                      <Card.Body>
                        <Container>
                          <Row>
                            <Col xs={8}>
                              <Card.Title>{role.Job_Role_Name}</Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">ID #{role.Job_Role_ID}</Card.Subtitle>
                              <Card.Text>{role.Job_Role_desc}</Card.Text>
                            </Col>
                            <Col xs={4}>
                              <Button variant="outline-primary" size="sm" href={"/staff/skills?staffID=" + this.state.staffID + "&roleID=" + role.Job_Role_ID}
                                >Select Role
                              </Button>
                            </Col>
                          </Row>
                          <Row>

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

        {/* CANCEL BUTTON */}
        <div className={styles.title}>
        <a href={"/staff/lj?staffID=" + this.state.staffID}>
          <Button variant="outline-danger">Cancel</Button>{' '}
         </a>
        </div>

      </div>
    )
  }
}


export default StaffRoles;
