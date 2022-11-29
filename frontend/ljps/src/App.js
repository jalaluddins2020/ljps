import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Components
import Login from './components/login/login';
import Manager from './components/manager/manager';
import Hr from './components/hr/hr';
import HrRoles from './components/hrRoles/hrRoles';
import HrSkills from './components/hrSkills/hrSkills';
import HrCourses from './components/hrCourses/hrCourses';
import Staff from './components/staff/staff';
import StaffLJ from './components/staffLJ/staffLJ';
import StaffRoles from './components/staffRoles/staffRoles';
import StaffSkills from './components/staffSkills/staffSkills';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/staff" element={<Staff/>}/>
        <Route path="/manager" element={<Manager/>}/>

        {/* HR paths */}
        <Route path="/hr" element={<Hr/>}/>
        <Route path="/hr/roles" element={<HrRoles/>}/>
        <Route path="/hr/skills" element={<HrSkills/>}/>
        <Route path="/hr/courses" element={<HrCourses/>}/>

        {/* Staff paths */}
        <Route path="/staff/lj" element={<StaffLJ/>}/>
        <Route path="/staff/roles" element={<StaffRoles/>}/>
        <Route path="/staff/skills" element={<StaffSkills/>}/>
      </Routes>
    </Router>
  );
}

export default App;
