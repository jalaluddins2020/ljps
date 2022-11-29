import unittest
from app import JobRoles , JobSkill , JobRolesSkills, LearningJourney

class TestJobRole(unittest.TestCase):
    def test_to_dict(self):
        JobRole1 = JobRoles(Job_Role_ID = 1, Job_Role_Name = 'testJobRole', Job_Role_desc ='testDesc')
        self.assertEqual(JobRole1.to_dict(), {
            'Job_Role_ID': 1,
            'Job_Role_Name': 'testJobRole',
            'Job_Role_desc' :'testDesc',
            'Job_Role_Deleted' : None
}
        )

    def test_add_role(self):
        data = {'Job_Role_ID': 9, 'Job_Role_Name': "Teacher", "Job_Role_desc": "Teach students", "Job_Role_Deleted": 0}
        self.assertEqual(JobRoles.add_job_roles(data), data)

    def test_soft_delete_role(self):
        data = {'Job_Role_ID': 9, 'Job_Role_Name': "Teacher", "Job_Role_desc": "Teach students", "Job_Role_Deleted": 1}
        JobRoles.soft_delete_job_role_by_id(9, data)
        self.assertEqual(JobRoles.get_job_role_by_id(9).to_dict(), data)

    def test_update_role(self):
        #update role name only
        data = {'Job_Role_ID': 9, 'Job_Role_Name': "Sensei", "Job_Role_desc": "Teach students", "Job_Role_Deleted": 1}
        JobRoles.update_job_roles_by_id(9, data)
        self.assertEqual(JobRoles.get_job_role_by_id(9).to_dict(), data)

        #update desc only

        data = {'Job_Role_ID': 9, 'Job_Role_Name': "Sensei", "Job_Role_desc": "Teach students but Japanese", "Job_Role_Deleted": 1}
        JobRoles.update_job_roles_by_id(9, data)
        self.assertEqual(JobRoles.get_job_role_by_id.to_dict(), data)

        #update role and desc
        data = {'Job_Role_ID': 9, 'Job_Role_Name': "Guru", "Job_Role_desc": "Teach students but Indian", "Job_Role_Deleted": 1}
        JobRoles.update_job_roles_by_id(9, data)
        self.assertEqual(JobRoles.get_job_role_by_id.to_dict(), data)


        
    def test_get_role_by_id(self):
        data = {'Job_Role_ID': 9, 'Job_Role_Name': "Guru", "Job_Role_desc": "Teach students but Indian", "Job_Role_Deleted": 1}
        self.assertEqual(JobRoles.get_job_role_by_id(9).to_dict(), data)

    def test_get_all_role(self):
        #adding one more job_jole since there's only one
        pass
       

class TestJobSkill(unittest.TestCase):
    def test_to_dict(self):
        JobSkill1 = JobSkill(skill_ID = 1,  skill_Name = 'TestSkillName' )
        self.assertEqual(JobSkill1.to_dict(), {
            'skill_ID' : 1,
            'skill_Name' : 'TestSkillName',
            'skill_Deleted' : None
            }
        )
    def test_add_skill(self):
        pass

    def test_soft_delete_skill(self):
        pass
    def test_update_skill(self):
        pass
    def test_get_skill_by_id(self):
        pass
    def test_get_all_skill(self):
        pass

class TestJobRolesSkills(unittest.TestCase):
    def test_to_dict(self):
        JobRolesSkills1 = JobRolesSkills(Skill_ID = 1,Job_Role_ID = 1)
        self.assertEqual(JobRolesSkills1.to_dict(), {
          'Skill_ID' : 1,
          'Job_Role_ID' : 1
            }
        )

    def test_add_job_roles_skill(self):
        pass

    def test_update_job_roles_skill(self):
        pass
    def test_get_role_skill_maps(self):
        pass
    def test_get_role_skill_map_by_id(self):
        pass

class TestCourse(unittest.TestCase):
    def test_get_courses(self):
        pass

class TestCourseSkill(unittest.TestCase):
    def test_to_dict(self):
        JobRolesSkills1 = JobRolesSkills(Skill_ID = 1,Job_Role_ID = 1)
        self.assertEqual(JobRolesSkills1.to_dict(), {
          'Skill_ID' : 1,
          'Job_Role_ID' : 1
            }
        )

    def test_add_course_skill_map(self):
        pass

    def test_update_course_skill_map(self):
        pass
    def test_get_course_skill_maps(self):
        pass
    def test_get_course_skill_map_by_id(self):
        pass



class TestLearningJourney(unittest.TestCase):
    def test_to_dict(self):
        LearningJourney1 = LearningJourney(job_role_ID = 1, courses = ['1','2','3','4'] , staff_ID = 1)
        self.assertEqual(LearningJourney1.to_dict(), {
            'learning_journey_ID': None,
            'job_role_ID': 1,
            'courses': ['1','2','3','4'],
            'staff_ID': 1
           
            }
        )
    
    def test_add_learning_journey(self):
        pass

    def test_get_learning_journey(self):
        pass
    def test_delete_learning_journey(self):
        pass
    def test_update_learning_journey(self):
        pass

if __name__ == "__main__":
    unittest.main()
