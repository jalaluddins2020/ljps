import React from 'react';
import styles from './hrDashboard.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Modal } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';


class HrRoles extends React.Component {
  state = {
    roles: [],
    isNewOpen: false,
    isEditOpen: false,
    isAssignOpen: false,
    isDeleteMessageOpen: false,
    isConfirmDeleteOpen: false,
    roleID: '',
    roleName: '',
    roleDesc: '',
    editRoleID: '',
    skills: [],
    roleSkillsID: [],
    displayAssignedSkills: [],
    displayUnassignedSkills: [],
    deleteMessage: 'Error Deleting',

  }

  componentDidMount() {
// GET ALL JOB ROLES FETCH
    fetch('http://127.0.0.1:5000/job_role')
    .then(response => response.json())
    .then(data => this.setState({ roles: data.data }));
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

  getTempRole = currRole => this.setState({ editRoleID: currRole.Job_Role_ID, tempJobRole: currRole.Job_Role_Name, tempJobDesc: currRole.Job_Role_desc})

// Setting states for creation of new job roles
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // CREATE JOB ROLE FETCH
  handleNewSubmit = event => {
    // event.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            Job_Role_ID: this.state.roleID,
            Job_Role_Name: this.state.roleName,
            Job_Role_desc: this.state.roleDesc,
            Job_Role_Deleted: 0
          })
  };
  console.log(requestOptions)
    fetch('http://127.0.0.1:5000/job_role', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }))
  }

  refreshPage() {
    window.location.reload(false);
  }

  // UPDATE JOB ROLE FETCH - CURRENTLY A POST (BEST PRACTICE IS A PUT)
  handleEditSubmit = event => {
    // event.preventDefault();
    console.log("current roleID:" + this.state.editRoleID)
    console.log("http://127.0.0.1:5000/job_role/update/" + this.state.editRoleID)

    const requestOptions = {
      method: 'Put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            Job_Role_ID: Number(this.state.editRoleID),
            Job_Role_Name: this.state.roleName,
            Job_Role_desc: this.state.roleDesc
          })
  };
  console.log(requestOptions)
    fetch(('http://127.0.0.1:5000/job_role/update/' + this.state.editRoleID), requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));

  }


  // SOFT DELETE ROLE FETCH
  handleDeleteRole = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'Put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Job_Role_Deleted: 1
      })
    };
    fetch(('http://127.0.0.1:5000/job_role/soft_delete/' + this.state.editRoleID), requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({ deleteMessage: data.message })
        // console.log(data)
      });
    this.openDeleteModal()
  }

  // GET ROLE/SKILL MAP
    getDataRoleSkills(role_id) {
    // reset state first
    this.setState({displayAssignedSkills: [], displayUnassignedSkills: []})

    let firstAPICall = fetch('http://127.0.0.1:5000/job_skill');
    let secondAPICall = fetch('http://127.0.0.1:5000/job_role_skill_map/' + role_id);
  
    Promise.all([firstAPICall, secondAPICall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(data => {

        const skills = data[0].data
        const roleSkillsID = Object.values(data[1].data)[0]

        let tempAssignedSkill = []
        let tempNotAssignedSkill = []

        if (!roleSkillsID) {
          this.setState({displayUnassignedSkills: skills})
        } else {
          for (let one_skill of skills) {
            if (roleSkillsID.includes(one_skill.skill_ID)) {
              tempAssignedSkill.push(one_skill)
            } else {
              tempNotAssignedSkill.push(one_skill)
            }
          }

          this.setState({displayAssignedSkills: tempAssignedSkill, displayUnassignedSkills: tempNotAssignedSkill, newRoleSkillAssignment: Object.values(data[1].data)[0]})
        }
        
      })

  }

  // Getting array of new assignment as checkboxes are checked/unchecked
  handleChangeAssign = e => {
    if (this.state.newRoleSkillAssignment) {
      var tempNewArray = this.state.newRoleSkillAssignment
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

    this.setState({newRoleSkillAssignment: tempNewArray})
  }


  handleAssignSubmit = event => {
    const role_ID = this.state.editRoleID
    // event.preventDefault();
    console.log(this.state.newRoleSkillAssignment)
    const requestOptions = {
      method: 'Put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
            [role_ID] : this.state.newRoleSkillAssignment
          })
  };
  console.log(requestOptions)
    fetch(('http://127.0.0.1:5000/job_role_skill_map/update'), requestOptions)
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
            <Nav.Link href="" active>Roles</Nav.Link>
            <Nav.Link href="/hr/skills">Skills</Nav.Link>
            <Nav.Link href="/hr/courses">Courses</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <h2 className={styles.title}>All Roles</h2>

{/* ALL ROLES DISPLAY */}
        <div className={styles.main}><Container>
          
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
                            <Col xs={4} >
                              <Button variant="primary" size="sm"
                                onClick={() => {
                                  this.openEditModal();
                                  this.getTempRole(role);
                                  }}
                                >Edit
                              </Button>
                              <Button variant="danger"  size="sm"
                                onClick={() => {
                                  this.openConfirmDeleteModal()
                                  this.getTempRole(role);
                                  // this.deleteRole(role.Job_Role_ID);
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
                                  this.getTempRole(role);
                                  this.getDataRoleSkills(role.Job_Role_ID);
                                  }}
                                >Assign Skills
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

{/* CREATE NEW ROLE BUTTON */}
        <div className={styles.title}>
        <Button variant="outline-success" onClick={this.openNewModal}>Create New Role</Button>{' '} 
        </div>

{/* CREATE NEW ROLE MODAL */}
        <Modal show={this.state.isNewOpen} onHide={this.closeNewModal}>
          <form onSubmit={this.handleNewSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <label className={styles.createLabel}>
              <b>Job ID</b>
            </label>
            <input type="text" name="roleID" value={this.state.roleID}  onChange={(e) => {
              this.handleChange(e)
            }}/>
            <label className={styles.createLabel}>
              <b>Job Role</b>
            </label>
            <input type="text" name="roleName" value={this.state.roleName} onChange={(e) => {
              this.handleChange(e)
            }} />
            <label className={styles.createLabel}>
              <b>Job Description</b>
            </label>
            <textarea name="roleDesc" value={this.state.roleDesc} onChange={(e) => {
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
              <Modal.Title>Edit Role (ID #{this.state.editRoleID})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <label className={styles.createLabel}>
              <b>Updated Job Role</b>
            </label>
            <input className={styles.textInput} type="text" name="roleName" placeholder={this.state.tempJobRole} value={this.state.roleName} onChange={(e) => {
              this.handleChange(e)
            }} />
            <label className={styles.createLabel}>
              <b>Updated Job Description</b>
            </label>
            <textarea name="roleDesc" placeholder={this.state.tempJobDesc} value={this.state.roleDesc} onChange={(e) => {
              this.handleChange(e)
            }} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={this.closeEditModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

{/* ASSIGN MODAL */}
        <Modal show={this.state.isAssignOpen} onHide={this.closeAssignModal}>
          <form onSubmit={this.handleAssignSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Assign Skills</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <label className={styles.createLabel}>
              <h5>Which skill is required for Role: {this.state.tempJobRole}?</h5>
            </label>
            <div className={styles.badgesList} >
              <ul>
                {this.state.displayAssignedSkills
                  .map(skill =>
                    <li className={styles.badges} key={skill.skill_ID}>
                      <Badge bg="info" >{skill.skill_Name}</Badge>
                    </li>
                )}
              </ul>
            </div>
            <hr></hr>
            <label className={styles.createLabel}>
              <h5>Assign/Remove Skills to {this.state.tempJobRole}?</h5>
            </label>
            <label className={styles.createLabel}>
              <b>Remove Current Assigned Skills </b>(Check to remove)
            </label>
            <ul>
              {this.state.displayAssignedSkills
                  .map(skill =>
                    <li className={styles.checksList} key={skill.skill_ID}>
                      <input  type="checkbox" className={`${styles.checks} ${styles.checkRemove}`} onChange={(e) => {
                this.handleChangeAssign(skill.skill_ID)
              }}/>
                      <label >{skill.skill_Name}</label>
                    </li>
              )}
            </ul>
            <label className={styles.createLabel}>
              <b>Assign Other Skills</b> (Check to add)
            </label>
            <ul>
              {this.state.displayUnassignedSkills
                  .map(skill =>
                    <li className={styles.checksList} key={skill.skill_ID}>
                        <input className={`${styles.checks} ${styles.checkAdd}`} type="checkbox" onChange={(e) => {
                this.handleChangeAssign(skill.skill_ID)
              }}/>
                        <label >{skill.skill_Name}</label>
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
          <form onSubmit={this.handleDeleteRole}>
            <Modal.Header closeButton>
              <Modal.Title>Deleting Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You are deleting role: {this.state.tempJobRole}
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
              <Modal.Header><Modal.Title>Deletion of Role</Modal.Title></Modal.Header>
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


export default HrRoles;
