import React from 'react';
import styles from './hrCourses.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';


class HrCourses extends React.Component {
  state = {
    courses: [],
  }

  componentDidMount() {
// GET ALL COURSES COURSES FETCH
    fetch('http://127.0.0.1:5000/courses')
    .then(response => response.json())
    .then(data => {
      this.setState({ courses: data.data })
      console.log(data.data)})
  }


  render() {


    return (
      <div className={styles.body}>
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/hr">Learning Journey</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/hr/roles" >Roles</Nav.Link>
            <Nav.Link href="/hr/skills" >Skills</Nav.Link>
            <Nav.Link href="" active>Courses</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <h2 className={styles.title}>All Courses</h2>

{/* ALL COURSES DISPLAY */}
        <div className={styles.main}><Container>
          
            <Row>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} >
                {
                  this.state.courses
                    .map(course =>
                      <Card key={course.course_ID} className={styles.cards}>
                      <Card.Body>
                        <Container>
                          <Row>
                            <Col xs={12}>
                              <Card.Title>{course.course_Name}</Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">ID #{course.course_ID}</Card.Subtitle>
                              <Card.Text>{course.course_Desc}</Card.Text>
                              <Badge bg="primary" className={styles.badges}>{course.course_Category}</Badge>
                              <Badge bg="dark" className={styles.badges}>{course.course_Status}</Badge>
                              <Badge bg="secondary" className={styles.badges}>{course.course_Type}</Badge>
                            </Col>
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
        <Button variant="outline-success" disabled>More to come!</Button>{' '} 
        </div>

      </div>
    )
  }
}


export default HrCourses;
