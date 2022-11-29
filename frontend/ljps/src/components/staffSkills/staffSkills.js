import React from 'react';
import styles from './staffSkills.module.css';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';



class StaffSkills extends React.Component {
  state = {
    staffID: '',
    selectedRole: [],
    assignedSkills: [],
    isCoursesOpen: false,
    modalSkill: "",
    displayAddedCoursesForSkill: [],
    displayUnaddedCoursesForSkill: [],
    updateData: {message: "Learning Journey Created"},
    courseIDs: []
  }

  openCoursesModal = () => this.setState({ isCoursesOpen: true });
  closeCoursesModal = () => this.setState({ isCoursesOpen: false });

  tempModalSkill = (skill) => this.setState({ modalSkill: skill})

  openMessageModal = () => this.setState({ isMessageOpen: true });
  closeMessageModal = () => this.setState({ isMessageOpen: false });

  refreshPage() {
    window.location.reload(false);
  }

  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const ljID = urlParams.get('ljID')
    const roleID = urlParams.get('roleID')
    const staffID = urlParams.get('staffID')
    if (urlParams.get('courseIDs')) {
      this.setState({courseIDs: urlParams.get('courseIDs').split(",")})
    }
    this.setState({ljID: ljID, roleID: roleID, staffID: staffID})

    this.setState({displayAssignedSkills: [], displayUnassignedSkills: []})

// GET ALL FETCH
  let firstAPICall = fetch('http://127.0.0.1:5000/job_role/' + Number(roleID));
  let secondAPICall = fetch('http://127.0.0.1:5000/job_skill');
  let thirdAPICall = fetch('http://127.0.0.1:5000/job_role_skill_map/' + Number(roleID));

  Promise.all([firstAPICall, secondAPICall, thirdAPICall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(data => {
      
        const skills = data[1].data
        const roleSkillsID = Object.values(data[2].data)[0]

        let assignedSkill = []

        if (roleSkillsID) {
          for (let one_skill of skills) {
            if (roleSkillsID.includes(one_skill.skill_ID)) {
              assignedSkill.push(one_skill)
            }
          }

          this.setState({selectedRole: [data[0].data], assignedSkills: assignedSkill})
        }
      })

  }

    // GET SKILL/COURSE MAP
    getDataSkillsCourse(skill_id) {
      this.setState({skillID: skill_id})
      // reset state first
      this.setState({displayCoursesForSkill: []})
  
      let firstAPICall = fetch('http://127.0.0.1:5000/courses');
      let secondAPICall = fetch('http://127.0.0.1:5000/job_skill_course_map/' + skill_id);
      
      Promise.all([firstAPICall, secondAPICall])
        .then(values => Promise.all(values.map(value => value.json())))
        .then(data => {
  
          const courses = data[0].data
          const skillsCourseID = Object.values(data[1].data)[0]
          
          let tempUnaddedCourse = []
          let addedCourse = this.state.courseIDs
  
          if (skillsCourseID) {
            for (let one_course of courses) {
              if (skillsCourseID.includes(one_course.course_ID)) {
                tempUnaddedCourse.push(one_course)
              }
            }
          }
          
          let addedCourseFull = []
          let addedCourseID = []
          let unaddedCourse =[]
          for (let course of tempUnaddedCourse) {
            if (addedCourse.includes(course.course_ID)) {
              addedCourseID.push(course.course_ID)
              addedCourseFull.push(course)
            } else {
              unaddedCourse.push(course)
            }
          }
          console.log(addedCourse, unaddedCourse)
          this.setState({displayAddedCoursesForSkill: addedCourseFull, displayUnaddedCoursesForSkill: unaddedCourse, newLjCourseAdd: addedCourseID})
        })
        
  
    }

  // Getting array of new assignment as checkboxes are checked/unchecked
  handleChangeAssign = e => {
    let tempIDs = this.state.courseIDs
    if (tempIDs.includes(e)) {
      const index = tempIDs.indexOf(e)
      tempIDs.splice(index,1)
    } else {
      tempIDs.push(e)
    }
    this.setState({newLjCourseAdd: tempIDs})
    console.log(tempIDs)
  }

  handleAddCoursesSubmit = event => {
    event.preventDefault();
    console.log(this.state.newLjCourseAdd)

    if (this.state.ljID) {
        const requestOptions = {
        method: 'Put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            role_ID : this.state.roleID,
            staff_ID: this.state.staffID,
            courses: JSON.stringify(this.state.newLjCourseAdd)
            })
    };
    console.log(requestOptions)
      fetch(('http://127.0.0.1:5000/learning_journey/update/' + this.state.ljID), requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({ updateData: data })
        
      });
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            job_role_ID : this.state.roleID,
            staff_ID: this.state.staffID,
            courses: JSON.stringify(this.state.newLjCourseAdd)
            })
    };
    console.log(requestOptions)
    fetch(('http://127.0.0.1:5000/learning_journey'), requestOptions)
    .then(response => response.json())
    .then(data => {
      this.setState({ createData: data })
      
    });
    }
  // this.refreshPage()
    this.closeCoursesModal()
    this.openMessageModal()
  }



  render() {


    return (
      <div className={styles.body}>
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/staff">Learning Journey</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href={"/staff/lj?staffID=" + this.state.staffID}>Home</Nav.Link>
            {/* <Nav.Link href={"/staff/roles?staffID=" + this.state.staffID} >Roles</Nav.Link>
            <Nav.Link href="#" active>Skills</Nav.Link>
            <Nav.Link href="#/staff/courses" >Courses</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>
      <h5 className={styles.title}><a href={"/staff/lj?staffID=" + this.state.staffID}>Learning Journey</a> &gt;&gt; Select a Role &gt;&gt; <b>Select a Skill</b></h5>

{/* ALL COURSES DISPLAY */}
        <div className={styles.main}>
          <Container>
          
            <Row>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} >

                      <Card>
                      <Card.Body>
                        <Container>
                          {
                            this.state.selectedRole
                              .map(role =>
                          <Row key={role.Job_Role_ID} className={styles.cards}>
                            <Col xs={8}>
                              <Card.Title>{role.Job_Role_Name}</Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">ID #{role.Job_Role_ID}</Card.Subtitle>
                              <Card.Text>{role.Job_Role_desc}</Card.Text>
                            </Col>
                            <Col xs={4}>
                            <Badge bg="success">Role Selected</Badge>
                            </Col>
                          </Row>
                            )
                          }
                          <hr></hr>
                          <Row>
                          <Card.Title>Select skill to fulfill (Add course)</Card.Title>
                          <ListGroup>
                          {
                            this.state.assignedSkills
                            .map(skill =>
                            <ListGroup.Item key={skill.skill_ID} className={styles.itemList} 
                              onClick={() => {this.setState({newRoleSkillAssignment: []}); this.openCoursesModal(); this.tempModalSkill(skill); this.getDataSkillsCourse(skill.skill_ID)}}
                            >
                              {skill.skill_Name}
                            </ListGroup.Item>
                            )
                          }
                          </ListGroup>
                          </Row>
                          <p className={styles.fineprint}>*Add course to create/update learning journey</p>
                        </Container>
                      </Card.Body>
                    </Card>

              </Col>
            </Row>
        </Container>
        </div>

      {/* CANCEL BUTTON */}
        <div className={styles.title}>
        <a href={"/staff/lj?staffID=" + this.state.staffID}>
          <Button variant="outline-success">Return to home</Button>{' '}
         </a>
        </div>

    {/* Add/Remove Courses Modal */}
        <Modal show={this.state.isCoursesOpen} onHide={() => {this.closeCoursesModal(); this.refreshPage()}}>
        <form onSubmit={this.handleAddCoursesSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Select courses to acquire skill: {this.state.modalSkill.skill_Name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Card.Text><b>Courses added</b> (check to remove)</Card.Text>
          <ul>
            {this.state.displayAddedCoursesForSkill
                    .map(course =>
                      <li className={styles.checksList} key={course.course_ID}>
                        <input  type="checkbox" className={`${styles.checks} ${styles.checkRemove}`}
                        onChange={(e) => {this.handleChangeAssign(course.course_ID)}}
                        />
                        <label >{course.course_Name}</label>
                      </li>
                )}
          </ul>
          <hr></hr>
          <Card.Text><b>Add new courses</b> (check to add)</Card.Text>
          <ul>
            {this.state.displayUnaddedCoursesForSkill
                    .map(course =>
                      <li className={styles.checksList} key={course.course_ID}>
                        <input  type="checkbox" className={`${styles.checks} ${styles.checkAdd}`}
                        onChange={(e) => {this.handleChangeAssign(course.course_ID)}}
                        />
                        <label >{course.course_Name}</label>
                      </li>
                )}
          </ul>
          {/* <p className={styles.fineprint}>*Once saved, learning journey will be created</p> */}
          </Modal.Body>
          <Modal.Footer>
          
            <Button variant="secondary" onClick={() => {this.closeCoursesModal(); this.refreshPage()}}>
              Close
            </Button>
            <Button variant="primary" type="submit" >
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* COURSE ADD/REMOVE MESSAGE MODAL */}
      <Modal show={this.state.isMessageOpen}>
        <Modal.Header><Modal.Title>Learning Journey Add/Remove</Modal.Title></Modal.Header>
        <Modal.Body>
          <b>{this.state.updateData.message}</b>
        </Modal.Body>
        <Modal.Footer>
          <a href={'/staff/lj?staffID=' + this.state.staffID}>
            <Button variant="outline-success" onClick={this.closeMessageModal}>
              Return Home
            </Button>
          </a>
        </Modal.Footer>
      </Modal>
      </div>
    )
  }
}


export default StaffSkills;
