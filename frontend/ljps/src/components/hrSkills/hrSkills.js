import React from 'react';
import styles from './hrSkills.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Modal } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';


class HrSkills extends React.Component {
  state = {
    skills: [],
    isNewOpen: false,
    isEditOpen: false,
    isAssignOpen: false,
    isDeleteMessageOpen: false,
    isConfirmDeleteOpen: false,
    skillID: '',
    skillName: '',
    editSkillID: '',
    displayAssignedCourses: [],
    displayUnassignedCourses: [],
    deleteMessage: 'Error Deleting',
  }

  componentDidMount() {
// GET ALL JOB SKILLS FETCH
    fetch('http://127.0.0.1:5000/job_skill')
    .then(response => response.json())
    .then(data => this.setState({ skills: data.data }));
  }

  openNewModal = () => this.setState({ isNewOpen: true });
  closeNewModal = () => this.setState({ isNewOpen: false });

  openEditModal = () => this.setState({ isEditOpen: true });
  closeEditModal = () => this.setState({ isEditOpen: false });

  openAssignModal = () => this.setState({ isAssignOpen: true });
  closeAssignModal = () => this.setState({ isAssignOpen: false });

  openDeleteModal = () => {
    this.closeConfirmDeleteModal()
    this.setState({ isDeleteMessageOpen: true })
  };
  closeDeleteModal = () => {
    this.setState({ isDeleteMessageOpen: false })
    this.refreshPage()
  };

  openConfirmDeleteModal = () => this.setState({ isConfirmDeleteOpen: true });
  closeConfirmDeleteModal = () => this.setState({ isConfirmDeleteOpen: false });

  getTempSkill = currSkill => this.setState({editSkillID: currSkill.skill_ID, tempSkillName: currSkill.skill_Name})

// Setting states for creation of new job skills
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // CREATE JOB SKILL FETCH
  handleNewSubmit = event => {
    // event.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            skill_ID: this.state.skillID,
            skill_Name: this.state.skillName,
            skill_Deleted: 0
          })
  };
  console.log(requestOptions)
    fetch('http://127.0.0.1:5000/job_skill', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }))
  }

  refreshPage() {
    window.location.reload(false);
  }


  handleEditSubmit = event => {
    // event.preventDefault();
    console.log("current skillID:" + this.state.editSkillID)
    console.log("http://127.0.0.1:5000/job_skill/update/" + this.state.editSkillID)

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            skill_ID: Number(this.state.editSkillID),
            skill_Name: this.state.skillName,
          })
  };
  console.log(requestOptions)
    fetch(('http://127.0.0.1:5000/job_skill/update/' + this.state.editSkillID), requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));

  }

    // SOFT DELETE SKILL FETCH
    handleDeleteSkill = (event) => {
      event.preventDefault();
      const requestOptions = {
        method: 'Put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_Deleted: 1
        })
      };
      fetch(('http://127.0.0.1:5000/job_skill/soft_delete/' + this.state.editSkillID), requestOptions)
        .then(response => response.json())
        .then(data => {
          this.setState({ deleteMessage: data.message })
          // console.log(data)
        });
      this.openDeleteModal()
    }

  // GET SKILL/COURSE MAP
  getDataSkillsCourse(skill_id) {
    // reset state first
    this.setState({displayAssignedCourses: [], displayUnassignedCourses: []})

    let firstAPICall = fetch('http://127.0.0.1:5000/courses');
    let secondAPICall = fetch('http://127.0.0.1:5000/job_skill_course_map/' + skill_id);
    
    Promise.all([firstAPICall, secondAPICall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(data => {

        const courses = data[0].data
        const skillsCourseID = Object.values(data[1].data)[0]

        let tempAssignedCourse = []
        let tempNotAssignedCourse = []

        if (!skillsCourseID) {
          this.setState({displayUnassignedCourses: courses})
        } else {
          for (let one_course of courses) {
            if (skillsCourseID.includes(one_course.course_ID)) {
              tempAssignedCourse.push(one_course)
            } else {
              tempNotAssignedCourse.push(one_course)
            }
          }

          this.setState({displayAssignedCourses: tempAssignedCourse, displayUnassignedCourses: tempNotAssignedCourse, newSkillCourseAssignment: Object.values(data[1].data)[0]})
        }

      })
      

  }

   // Getting array of new assignment as checkboxes are checked/unchecked
   handleChangeAssign = e => {
    if (this.state.newSkillCourseAssignment) {
      var tempNewArray = this.state.newSkillCourseAssignment
    } else {
      tempNewArray = []
    }
    
    if (tempNewArray.length === 0) {
      tempNewArray.push(e)
    } else if (!tempNewArray.includes(e)) {
      tempNewArray.push(e)
    } else {
      const idx = tempNewArray.indexOf(e)
      tempNewArray.splice(idx, 1)
    }
    console.log(tempNewArray)
    this.setState({newSkillCourseAssignment: tempNewArray})
  }

  handleAssignSubmit = event => {
    const skill_ID = this.state.editSkillID
    // event.preventDefault();
    console.log(this.state.newSkillCourseAssignment)
    const requestOptions = {
      method: 'Put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            [skill_ID] : this.state.newSkillCourseAssignment
          })
  };
  console.log(requestOptions)
    fetch(('http://127.0.0.1:5000/job_skill_course_map/update'), requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
  }

  render() {


    return (
      <div className={styles.body}>
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/hr">Learning Journey</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/hr/roles" >Roles</Nav.Link>
            <Nav.Link href="" active>Skills</Nav.Link>
            <Nav.Link href="/hr/courses">Courses</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <h2 className={styles.title}>All Skills</h2>

{/* ALL SKILLS DISPLAY */}
        <div className={styles.main}><Container>
          
            <Row>
              <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} >
                {
                  this.state.skills
                    .map(skill =>
                      <Card key={skill.skill_ID} className={styles.cards}>
                      <Card.Body>
                        <Container>
                          <Row>
                            <Col xs={8}>
                              <Card.Title>{skill.skill_Name}</Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">ID #{skill.skill_ID}</Card.Subtitle>
                            </Col>
                            <Col xs={4}>
                              <Button variant="primary"
                                onClick={() => {
                                  this.openEditModal();
                                  this.getTempSkill(skill);
                                  }}
                                >Edit
                              </Button>
                              <Button variant="danger"
                                onClick={() => {
                                  this.openConfirmDeleteModal()
                                  this.getTempSkill(skill);
                                  }}
                                >Delete
                              </Button>
                            </Col>
                          </Row>
                          <Row>
                          <Col>
                              <Button variant="outline-primary" size="sm"
                                onClick={() => {
                                  this.openAssignModal();
                                  this.getTempSkill(skill);
                                  this.getDataSkillsCourse(skill.skill_ID);
                                  }}
                                >Assign Courses
                              </Button>
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
        <Button variant="outline-success" onClick={this.openNewModal}>Create New Skill</Button>{' '} 
        </div>

{/* CREATE NEW SKILL MODAL */}
        <Modal show={this.state.isNewOpen} onHide={this.closeNewModal}>
          <form onSubmit={this.handleNewSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Skill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <label className={styles.createLabel}>
              <b>Skill ID</b>
            </label>
            <input type="text" name="skillID" value={this.state.skillID}  onChange={(e) => {
              this.handleChange(e)
            }}/>
            <label className={styles.createLabel}>
              <b>Skill Name</b>
            </label>
            <input type="text" name="skillName" value={this.state.skillName} onChange={(e) => {
              this.handleChange(e)
            }} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.closeNewModal}>
                Close
              </Button>
              <Button variant="secondary" type="submit">
                Create
              </Button>
            </Modal.Footer>
          </form>
        </Modal>


{/* EDIT MODAL */}
        <Modal show={this.state.isEditOpen} onHide={this.closeEditModal}>
          <form onSubmit={this.handleEditSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Skill (ID #{this.state.editSkillID})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <label className={styles.createLabel}>
              <b>Updated Skill Name</b>
            </label>
            <input type="text" name="skillName" placeholder={this.state.tempSkillName} value={this.state.skillName} onChange={(e) => {
              this.handleChange(e)
            }} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.closeEditModal}>
                Close
              </Button>
              <Button variant="secondary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* ASSIGN MODAL */}
        <Modal show={this.state.isAssignOpen} onHide={this.closeAssignModal}>
          <form onSubmit={this.handleAssignSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Assign Courses</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <label className={styles.createLabel}>
              <h5>Which courses will acquire skill: {this.state.tempSkillName}?</h5>
            </label>
            <div className={styles.badgesList} >
              <ul>
                {this.state.displayAssignedCourses
                  .map(course =>
                    <li className={styles.badges} key={course.course_ID}>
                      <Badge bg="info" >{course.course_Name}</Badge>
                    </li>
                )}
              </ul>
            </div>
            <hr></hr>
            <label className={styles.createLabel}>
              <h5>Assign/Remove {this.state.tempSkillName} to courses?</h5>
            </label>
            <label className={styles.createLabel}>
              <b>Remove Current Assigned Courses </b>(Check to remove)
            </label>
            <ul>
              {this.state.displayAssignedCourses
                  .map(course =>
                    <li className={styles.checksList} key={course.course_ID}>
                      <input  type="checkbox" className={`${styles.checks} ${styles.checkRemove}`} onChange={(e) => {
                this.handleChangeAssign(course.course_ID)
              }}/>
                      <label >{course.course_Name}</label>
                    </li>
              )}
            </ul>
            <label className={styles.createLabel}>
              <b>Assign Other Courses</b> (Check to add)
            </label>
            <ul>
              {this.state.displayUnassignedCourses
                  .map(course =>
                    <li className={styles.checksList} key={course.course_ID}>
                        <input className={`${styles.checks} ${styles.checkAdd}`} type="checkbox" onChange={(e) => {
                this.handleChangeAssign(course.course_ID)
              }}/>
                        <label >{course.course_Name}</label>
                    </li>
              )}
            </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.closeAssignModal}>
                Close
              </Button>
              <Button variant="outline-primary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

    {/* DELETE CONFIRM MODAL */}
      <Modal show={this.state.isConfirmDeleteOpen} onHide={this.closeConfirmDeleteModal}>
          <form onSubmit={this.handleDeleteSkill}>
            <Modal.Header closeButton>
              <Modal.Title>Deleting Skill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You are deleting skill: {this.state.tempSkillName}
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
              <Modal.Header><Modal.Title>Deletion of Skill</Modal.Title></Modal.Header>
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


export default HrSkills;
