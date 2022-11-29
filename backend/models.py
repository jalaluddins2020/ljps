from __main__ import app
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)
class Roles(db.Model):
    __tablename__ = 'role'

    rid = db.Column(db.Integer, primary_key=True)
    rName = db.Column(db.String(100))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

class Staff(db.Model):
    __tablename__ = 'staff'
    staff_ID = db.Column(db.Integer, primary_key = True)
    staff_fname = db.Column(db.String(50))
    staff_lname = db.Column(db.String(50))
    dept = db.Column(db.String(50))
    email = db.Column(db.String(50))
    role = db.Column(db.Integer, db.ForeignKey(
        'role.rid')) 

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

#updated with soft delete field
class JobRoles(db.Model):
    __tablename__ = 'job_role'

    Job_Role_ID = db.Column(db.Integer, primary_key=True)
    Job_Role_Name = db.Column(db.String(50))
    Job_Role_desc = db.Column(db.String(255))
    Job_Role_Deleted = db.Column(db.Boolean)
    __mapper_args__ = {
        'polymorphic_identity': 'roles',
    }

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

    def add_job_roles(data):
        try:
            to_add = JobRoles(**data)
            db.session.add(to_add)
            db.session.commit()
            return to_add

        except Exception:
            raise Exception

    def update_job_roles_by_id(job_rid, data):

        role_to_update = JobRoles.query.filter_by(Job_Role_ID=job_rid).first()

        if not role_to_update:
            return 0

        try:

            job_role_name = data['Job_Role_Name']
            job_role_desc = data['Job_Role_desc']

            if job_role_name == '' and job_role_desc != '':
                
                role_to_update.Job_Role_desc = data['Job_Role_desc']

            elif job_role_desc == '' and job_role_name != '':
                
                role_to_update.Job_Role_Name = data['Job_Role_Name']
    

            else:
                # role_to_update.Job_Role_ID = data['Job_Role_ID']
                role_to_update.Job_Role_desc = data['Job_Role_desc']
                role_to_update.Job_Role_Name = data['Job_Role_Name']

            db.session.commit()
            return 1

        except Exception:
            raise Exception

    def delete_job_role_by_id(job_rid):
        
        role_to_delete = JobRoles.query.filter_by(Job_Role_ID=job_rid).first()

        if not role_to_delete:
            return 0

        try:
            db.session.delete(role_to_delete)
            db.session.commit()
            return 1

        except Exception:
            raise Exception

    def soft_delete_job_role_by_id(job_rid, data):

            job_role_to_soft_delete = JobRoles.query.filter_by(Job_Role_ID = job_rid).first()

            if not job_role_to_soft_delete:
                return 0

            try:
        
                #TINYINT , pass either 0 (false), 1 (true)
                job_role_to_soft_delete.Job_Role_Deleted = data['Job_Role_Deleted']
                db.session.commit()
                return 1

            except Exception:
                raise Exception


    def get_all_job_roles(search_name):
        if search_name:
            jobRoles_list = JobRoles.query.filter(
                JobRoles.name.contains(search_name))
        else:
            jobRoles_list = JobRoles.query.filter_by(Job_Role_Deleted=0).all()

        return jobRoles_list

    def get_job_role_by_id(job_rid):
        jobRoles = JobRoles.query.filter_by(Job_Role_ID=job_rid).first()

        return jobRoles

#updated with soft delete field
class JobSkill(db.Model):
    __tablename__ = 'job_skill'

    skill_ID = db.Column(db.Integer, primary_key=True)
    skill_Name = db.Column(db.String(50))
    skill_Deleted = db.Column(db.Boolean)
    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result


    def add_job_skill(data):
        try:
            to_add = JobSkill(**data)
            db.session.add(to_add)
            db.session.commit()
            return to_add

        except Exception:
            raise Exception

    def update_job_skill_by_id(skill_ID, data):

        skill_to_update = JobSkill.query.filter_by(skill_ID=skill_ID).first()

        if not skill_to_update:
            return 0

        try:
    
            skill_to_update.skill_Name = data['skill_Name']
            db.session.commit()
            return 1

        except Exception:
            raise Exception

    def delete_job_skill_by_id(skill_ID):
        
        skill_to_delete = JobSkill.query.filter_by(skill_ID=skill_ID).first()

        if not skill_to_delete:
            return 0

        try:
            db.session.delete(skill_to_delete)
            db.session.commit()
            return 1

        except Exception:
            raise Exception

    def soft_delete_job_skill_by_id(job_sid, data):

            job_skill_to_soft_delete = JobSkill.query.filter_by(skill_ID = job_sid).first()

            if not job_skill_to_soft_delete:
                return 0

            try:
        
                #TINYINT , pass either 0 (false), 1 (true)
                job_skill_to_soft_delete.skill_Deleted = data['skill_Deleted']
                db.session.commit()
                return 1

            except Exception:
                raise Exception


    def get_all_job_skills(search_name):
        if search_name:
            JobSkill_list = JobSkill.query.filter(
                JobSkill.name.contains(search_name))
        else:
            JobSkill_list = JobSkill.query.filter_by(skill_Deleted=0).all()

        return JobSkill_list

    def get_job_skill_by_id(skill_sid):
        job_skill_by_id = JobSkill.query.filter_by(skill_ID = skill_sid).first()

        return job_skill_by_id

class JobRolesSkills(db.Model):
    __tablename__ = 'job_role_skill'

    Skill_ID = db.Column(db.Integer, db.ForeignKey(
        'job_skill.skill_ID'), primary_key=True)
    Job_Role_ID = db.Column(db.Integer, db.ForeignKey(
        'job_role.Job_Role_ID'), primary_key=True)

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

    def create_role_skill_map(data):
        try:
            for role_id in data:
                for skill_id in data[role_id]:
                    job_role_skill = JobRolesSkills(
                        Skill_ID=int(skill_id), Job_Role_ID=int(role_id))
                    db.session.add(job_role_skill)
            db.session.commit()
            return 1
        except:
            raise Exception

    def update_job_roles_skills(data):
    
    # delete if exist, create if not exist
        try:
            for role_id in data:

                if JobRolesSkills.get_role_skill_map_by_id(role_id) == {}:
                    JobRolesSkills.create_role_skill_map(data)
                else:
                    existing_mapping = JobRolesSkills.get_role_skill_map_by_id(role_id)[int(role_id)]
                    new_mapping = data[role_id]

                    app.logger.info(existing_mapping) 
                    app.logger.info(new_mapping) 
                    
                    diff = list(set(existing_mapping).symmetric_difference(set(new_mapping))) #get items that doesnt exist in both mappings, then convert it back to list

                    app.logger.info(diff) 
                    

                    for skill_id in diff:
                        exists = JobRolesSkills.query.filter_by(Skill_ID = int(skill_id), Job_Role_ID = int(role_id)).first()
                        if exists:
                            JobRolesSkills.query.filter_by(Skill_ID = int(skill_id), Job_Role_ID = int(role_id)).delete()
                        else: #exists == None, mapping does not currently exist
                            job_role_skill = JobRolesSkills(Skill_ID = int(skill_id), Job_Role_ID = int(role_id))
                            db.session.add(job_role_skill)

                    db.session.commit()
                    return 1

        except Exception:
            raise Exception
    
    def get_role_skill_maps():
        try:
            data = JobRolesSkills.query.all() #returns all skills related to the role_id
            to_return = {}
            for job_role_skill in data:
                rs_row_dict = job_role_skill.to_dict() #one item of role_skill_map row
                jobRoles_id = rs_row_dict["Job_Role_ID"]
                jobRoles_sid = rs_row_dict["Skill_ID"]
                if jobRoles_id not in to_return:
                    to_return[jobRoles_id] = [jobRoles_sid]
                else:
                    to_return[jobRoles_id].append(jobRoles_sid)
            

            return to_return #returns: {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}


        except Exception:
            raise Exception

    def get_role_skill_map_by_id(role_id):
        try:
        # returns all skills related to the role_id
            data = JobRolesSkills.query.filter_by(Job_Role_ID=role_id).all()
            to_return = {}
            for job_role_skill in data:
                rs_row_dict = job_role_skill.to_dict()  # one item of role_skill_map row
                jobRoles_id = rs_row_dict["Job_Role_ID"]
                jobRoles_sid = rs_row_dict["Skill_ID"]
                if jobRoles_id not in to_return:
                    to_return[jobRoles_id] = [jobRoles_sid]
                else:
                    to_return[jobRoles_id].append(jobRoles_sid)

            # returns: {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}

            return to_return

        except Exception:
            raise Exception




class Course(db.Model):
    __tablename__ = 'course'

    course_ID = db.Column(db.String(20), primary_key=True)
    course_Name = db.Column(db.String(50))
    course_Desc = db.Column(db.String(255))
    course_Status = db.Column(db.String(15))
    course_Type = db.Column(db.String(10))
    course_Category = db.Column(db.String(50))

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result
    
    def get_course(search_name):
        if search_name:
            courses = Course.query.filter(Course.name.contains(search_name))
        else:
            courses = Course.query.all()
        return courses


class CourseSkill(db.Model):

    __tablename__ = 'course_skill'

    course_ID = db.Column(db.String(20), db.ForeignKey(
        'course.course_ID'), primary_key=True)
    skill_ID = db.Column(db.Integer, db.ForeignKey(
        'job_skill.skill_ID'), primary_key=True)

    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

    def create_course_skills(data):
        try:
            for skill_id in data:
                for course_id in data[skill_id]:
                    job_skill_course = CourseSkill(
                        course_ID=str(course_id), skill_ID=int(skill_id))
                    db.session.add(job_skill_course)
            db.session.commit()
            return 1

        except Exception:
            raise Exception

    def get_course_skill_map_by_id(skill_id):
        try:
            # returns all skills related to the role_id
            data = CourseSkill.query.filter_by(skill_ID=skill_id).all()
            to_return = {}
            for job_skill_course in data:
                sc_row_dict = job_skill_course.to_dict()  # one item of job_skill_course_map row
                courseSkills_sid = sc_row_dict["skill_ID"]
                courseSkills_cid = sc_row_dict["course_ID"]
                if courseSkills_sid not in to_return:
                    to_return[courseSkills_sid] = [courseSkills_cid]
                else:
                    to_return[courseSkills_sid].append(courseSkills_cid)

            # returns: {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}
            return to_return

        except:
            raise Exception

    def update_course_skills(data):
        try:
            for skill_id in data:
                if CourseSkill.get_course_skill_map_by_id(skill_id) == {}:
                    CourseSkill.create_skill_course_map(data)
                else:
                    existing_mapping = CourseSkill.get_course_skill_map_by_id(skill_id)[int(skill_id)]
                    new_mapping = data[skill_id]
                    
                    diff = list(set(existing_mapping).symmetric_difference(set(new_mapping))) #get items that doesnt exist in both mappings, then convert it back to list

                    for course_id in diff:
                        exists = CourseSkill.query.filter_by(skill_ID = int(skill_id), course_ID = str(course_id)).first()
                        if exists:
                            CourseSkill.query.filter_by(skill_ID = int(skill_id), course_ID = str(course_id)).delete()
                        else: #exists == None, mapping does not currently exist
                            skill_course = CourseSkill(skill_ID = int(skill_id), course_ID = str(course_id))
                            db.session.add(skill_course)

                    db.session.commit()
                    return 1

        except Exception:
            raise Exception      

class LearningJourney(db.Model):

    __tablename__ = 'learning_journey'

    learning_journey_ID = db.Column(db.Integer, primary_key = True)
    job_role_ID = db.Column(db.Integer)
    courses = db.Column(db.String(1000))
    staff_ID = db.Column(db.Integer, db.ForeignKey('staff.staff_ID'))
    def to_dict(self):
        """
        'to_dict' converts the object into a dictionary,
        in which the keys correspond to database columns
        """
        columns = self.__mapper__.column_attrs.keys()
        result = {}
        for column in columns:
            result[column] = getattr(self, column)
        return result

    def add_learning_journey(data):
        learningJourney = LearningJourney(**data)
        try:
            db.session.add(learningJourney)
            db.session.commit()
            return learningJourney
        except Exception:
            raise Exception

    def get_learning_journey(staff_id):
        try:
            data = LearningJourney.query.filter_by(staff_ID = staff_id).all() #returns all skills related to the role_id
            to_return = {}
                # retrieve skills based on role or based on courses?
            for learning_journey in data:
                learning_journey_dict = learning_journey.to_dict() 
                learningJourney_ljid = learning_journey_dict['learning_journey_ID']
                
                learningJourney_jid = learning_journey_dict["job_role_ID"]
                job_role_name = JobRoles.query.filter_by(Job_Role_ID = learningJourney_jid).first() # Retrieving name of Job Role
                jr_dict = job_role_name.to_dict()
                jr_name = jr_dict['Job_Role_Name']

                #Convert from string to list
                learningJourney_course_ids = eval(learning_journey_dict["courses"])
                #for individual course ids 
                learningJourney_course_names =[]
                learningJoruney_skill_names = []
                for learningJourney_course_id in learningJourney_course_ids:
                    learningJourney_course= Course.query.filter_by(course_ID = learningJourney_course_id).first() # Retrieving name of Course
                    c_dict = learningJourney_course.to_dict()
                    learningJourney_course_names.append(c_dict['course_Name'])

                    #find  CourseSkill ID
                    csid =  CourseSkill.query.filter_by(course_ID = learningJourney_course_id).first() # Retrieving associated courseskill 
                    cs_dict = csid.to_dict()
                    #skill name
                    sid_name = JobSkill.query.filter_by(skill_ID = cs_dict['skill_ID']).first() # Retrieving name of skill selected
                    s_dict = sid_name.to_dict()
                    learningJoruney_skill_names.append(s_dict['skill_Name'])


                learningJourney_ssid = learning_journey_dict["staff_ID"]
                staffID_name = Staff.query.filter_by(staff_ID = learningJourney_ssid).first() # Retrieving name of staff 
                staff_dict = staffID_name.to_dict()
                staff_name = staff_dict['staff_lname'] + " " + staff_dict['staff_fname'] 
                
                if learning_journey not in to_return:
                    #to_return[learningJourney_ljid] = [jr_name, c_name ,s_name, staff_name]
                    # to_return[learningJourney_ljid] =  {'jobRole' : jr_name , 'courseName' : c_name, 'skillName' : s_name, 'staffName' : staff_name, 'staffID' : learningJourney_ssid}

                    to_return[learningJourney_ljid] =  {'ljID': learningJourney_ljid, 'jobRoleID': learningJourney_jid ,'jobRole' : jr_name , 'courseNames' : learningJourney_course_names,'skillNames' : learningJoruney_skill_names , 'staffName' : staff_name, 'staffID' : learningJourney_ssid, "courseIDs": learningJourney_course_ids}

            db.session.commit()
            return to_return

        except Exception:
            raise Exception

    def delete_learning_journey(data):
        try:
            staff_id = data['staff_ID']
            jr_id = data['job_role_ID']
            learning_journey_to_delete = LearningJourney.query.filter_by(staff_ID = staff_id, job_role_ID = jr_id).all()

            for learning_journey in learning_journey_to_delete:
                db.session.delete(learning_journey)

            db.session.commit()
            return 1

        except Exception:
            raise Exception
    
    def update_learning_journey(data, lj_ID):
        
        s_ID = data['staff_ID']
        learning_journey_to_update = LearningJourney.query.filter_by(learning_journey_ID=lj_ID, staff_ID=s_ID).first()

        try:
            learning_journey_to_update.courses = data["courses"]
            db.session.commit()
            return 1

        except Exception:
            raise Exception


db.create_all()