import traceback
import os
from flask import Flask, request, jsonify, url_for
from flask_cors import CORS


app = Flask(__name__)
# For Windows default

if os.getenv('SQLALCHEMY_DATABASE_URI'): #for github actions config
  app.config['SQLALCHEMY_DATABASE_URI']= 'mysql+mysqlconnector://root:root@localhost:3306/spm_project'
  print(app.config['SQLALCHEMY_DATABASE_URI'])
else:
  app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/spm_project'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:8889/spm_project' #Edit password and server number for Mac
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 100,
                                           'pool_recycle': 280}

from models import db
from models import *

CORS(app)
db.create_all()


# GET request to search for job_role based on ID works
@app.route("/job_role/<int:job_rid>")
def jobRoles_by_id(job_rid):
    jobRoles = JobRoles.get_job_role_by_id(job_rid)

    if jobRoles:
        return jsonify({
            "data": jobRoles.to_dict()
        }), 200
    else:
        return jsonify({
            "message": "Role not found."
        }), 404


@app.route("/job_role")  # GET request to READ out all job_role works
def roles():
    search_name = None
    jobRoles_list = JobRoles.get_all_job_roles(search_name)
    return jsonify(
        {
            "data": [jobRoles.to_dict() for jobRoles in jobRoles_list]
        }
    ), 200


# POST request to CREATE a new job_role works
@app.route("/job_role", methods=['POST'])
def create_roles():
    data = request.get_json()


    if data['Job_Role_Name'] == '':
        if data['Job_Role_desc'] == '':
            return jsonify({
                "message" : "You cannot create a new Job Role without filling in the name or description!"
            })
        else:
            return jsonify({
                "message" : "You cannot create a new job role without filling the name!"
            })

    if data['Job_Role_desc'] == '':
        return jsonify({
            "message" : "You cannot create a new Job Role without filling in the description!"
        })

    try:
        jobRole = JobRoles.add_job_roles(data)
        return jsonify(jobRole.to_dict()), 201
    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Unable to commit to database."
        }), 500


# UPDATE of existing job_role! The changes get reflected but it does not return 201
@app.route("/job_role/update/<int:job_rid>", methods=['PUT'])
def update_job_roles(job_rid):


    try:

        data = request.get_json()

        if data['Job_Role_desc'] == '' and data['Job_Role_Name'] == '':
                
            return jsonify({"message": "Not updated because job_role_desc and job_role_name are empty"})


        job_roles_updated= JobRoles.update_job_roles_by_id(job_rid, data)

        if job_roles_updated:
            return jsonify({"message": "Role updated successfully!"})
        else:
            return jsonify({
                "message": "Role not found"
            }), 500

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error updating in database"
        }), 500


# DELETE existing job_role works!
@app.route("/job_role/delete/<int:job_rid>", methods=['DELETE'])
def delete_job_roles(job_rid):
    # updated name form user_to_delete to role_to_delete


    try:

        job_role_deleted = JobRoles.delete_job_role_by_id(job_rid)

        if job_role_deleted:
            return jsonify({"message": "Role deleted successfully!"})
        else:
            return jsonify({
                "message": "Role not found"
            }), 500

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error deleting from database"
        }), 500



#Soft Delete
@app.route("/job_role/soft_delete/<int:job_rid>",methods=['PUT']) 
def soft_delete_job_roles(job_rid):
    data = request.get_json()

    try:
        job_role_to_soft_delete = JobRoles.soft_delete_job_role_by_id(job_rid, data)
        if job_role_to_soft_delete:
            return jsonify({"message": "Role soft deleted successfully"})
        else:
            return jsonify({
                "message" : "Job Role not found!"
            }), 500


    except Exception:
        return jsonify({
            "message" : "Error in soft deleting"
        }), 500


# POST request to CREATE a new job_role works
@app.route("/job_skill", methods=['POST'])
def create_skills():
    data = request.get_json()
    jobSkills = JobSkill(**data)

    if data['skill_Name'] == '':
        return jsonify({ 
            "message" : "You cannot create a new skill without inputting name."
        })


    try:
        jobSkills = JobSkill.add_job_skill(data)
        return jsonify(jobSkills.to_dict()), 201

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Unable to commit to database."
        }), 500


@app.route("/job_skill")  # GET request to READ out all job_skill
def job_skill():
    search_name = request.args.get('job_skill')
    jobSkills_list = JobSkill.get_all_job_skills(search_name)
    return jsonify(
        {
            "data": [jobSkills.to_dict() for jobSkills in jobSkills_list]
        }
    ), 200

@app.route("/job_skill/<int:skill_sid>") #GET request to search for job_skill based on ID 
def jobSkills_by_id(skill_sid):

    jobSkills = JobSkill.get_job_skill_by_id(skill_sid)
    if jobSkills:
        return jsonify({
            "data": jobSkills.to_dict()
        }), 200
    else:
        return jsonify({
            "message": "Skill not found."
        }), 404


# UPDATE of existing job_skills!
@app.route("/job_skill/update/<int:skill_ID>", methods=['PUT'])
def update_job_skills(skill_ID):
    try:
        data = request.get_json()

        if data['skill_Name'] == '':
             return jsonify({"message": "Not updated because skill_Name is empty"})


        skill_updated = JobSkill.update_job_skill_by_id(skill_ID, data)


        if skill_updated:
            return jsonify({"message": "Skill updated successfully!"})
        else:
            return jsonify({
                "message": "Skill not found"
            }), 500

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error updating in database"
        }), 500


# Deletion of skills
@app.route("/job_skill/delete/<int:skill_ID>", methods=['DELETE'])
def delete_job_skills(skill_ID):
    try:

        skill_deleted = JobSkill.delete_job_skill_by_id(skill_ID)

        if skill_deleted:
            return jsonify({"message": "Skill deleted successfully!"})
        else:
            return jsonify({
                "message": "Skill not found"
            }), 500

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error deleting from database"
        }), 500


#Soft deletion of skills
@app.route("/job_skill/soft_delete/<int:job_sid>",methods=['PUT']) # update Deleted column
def soft_delete_job_skills(job_sid):
    data = request.get_json()

    try:
        job_skill_to_soft_delete = JobSkill.soft_delete_job_skill_by_id(job_sid, data)
        if job_skill_to_soft_delete:
            return jsonify({"message": "Skill soft deleted successfully"})
        else:
            return jsonify({
                "message" : "Skill not found!"
            }), 500


    except Exception:
        return jsonify({
            "message" : "Error in soft deleting"
        }), 500


# create mapping, takes selected mapping as input e.g. {"role_id" : ["skilld_id1", skill_id2"]}
@app.route("/job_role_skill_map/create", methods=["POST"])
def create_role_skill_map():
    data = request.get_json()
    try:
        JobRolesSkills.create_role_skill_map(data)
        return jsonify({"message": "Mapping created successfully"})

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error in creating mapping"
        }), 500


@app.route("/job_role_skill_map/<int:role_id>", methods = ["GET"]) #get mappings for one role by id

def get_role_skill_map_by_id(role_id): #compiles the different rows of roles_skills into one dictionary to be returned
    try:
        # returns all skills related to the role_id
        to_return = JobRolesSkills.get_role_skill_map_by_id(role_id)

        print(to_return)
        # returns: {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}
        return jsonify({"data": to_return})

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error in retrieving mapping"
        }), 500

@app.route("/job_role_skill_map", methods = ["GET"]) #get mappings for all roles
def get_role_skill_maps(): #compiles the different rows of roles_skills into one dictionary to be returned
    try:
        to_return = JobRolesSkills.get_role_skill_maps()
    

        return jsonify({"data": to_return}) #returns: {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}


    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message" : "Error in retrieving mapping"
        }), 500

# update mapping, takes in selected role mapping {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}
@app.route("/job_role_skill_map/update", methods=["PUT"])
def update_role_skill_map():

    # delete if exist, create if not exist
    try:
        data = request.get_json()
        JobRolesSkills.update_job_roles_skills(data)
        return jsonify({"message" : "Mapping updated successfully"})

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error in updating mapping"
        }), 500


@app.route("/courses")  # GET_REQUEST to display all courses
def courses():
    search_name = request.args.get('course')
    course_list = Course.get_course(search_name)
    return jsonify(
        {
            "data": [course.to_dict() for course in course_list]
        }
    ), 200

@app.route("/job_skill_course_map/create", methods=["POST"])
def create_skill_course_map():
    data = request.get_json()
    try:
        CourseSkill.create_course_skills(data)
        return jsonify({"message": "Mapping created successfully"}), 200

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error in creating mapping"
        }), 500


@app.route("/job_skill_course_map/<int:skill_id>", methods = ["GET"]) #get course mappings for one skill by id

def get_skill_course_map_by_id(skill_id): #compiles the different rows of roles_skills into one dictionary to be returned
    try:
        to_return = CourseSkill.get_course_skill_map_by_id(skill_id)
        return jsonify({"data": to_return}), 200

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error in retrieving mapping"
        }), 500

@app.route("/job_skill_course_map", methods = ["GET"]) #get mappings for all roles

def get_skill_course_maps(): #compiles the different rows of roles_skills into one dictionary to be returned
    try:
        data = CourseSkill.query.all() #returns all skills related to the role_id
        to_return = {}
        for job_skill_course in data:
            sc_row_dict = job_skill_course.to_dict() #one item of role_skill_map row
            courseSkills_sid = sc_row_dict["skill_ID"]
            courseSkills_cid = sc_row_dict["course_ID"]
            if courseSkills_sid not in to_return:
                to_return[courseSkills_sid] = [courseSkills_cid]
            else:
                to_return[courseSkills_sid].append(courseSkills_cid)
        
        
        return jsonify({"data": to_return}), 200 #returns: {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}


    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message" : "Error in retrieving mapping"
        }), 500

# update mapping, takes in selected role mapping {"role_id": ["skill_id1", "skill_id2"]} e.g. {"1":["1","5","6"]}
@app.route("/job_skill_course_map/update", methods=["PUT"])
def update_skill_course_map():

    # delete if exist, create if not exist

    data = request.get_json()
    try:
        CourseSkill.update_course_skills(data)

        return jsonify({"message" : "Mapping updated successfully"}), 200

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Error in updating mapping"
        }), 500

# 1. Need to find out what exactly is passed in the JSON string from the frontend, will skills and courses be in a list or dict?
@app.route("/learning_journey", methods=['POST'])
# data to contain:  job_role_ID , staff_ID, courses (This is the list of course IDs)

def create_learning_journies():
    data = request.get_json()
    try:
        learningJourney = LearningJourney.add_learning_journey(data)
        return jsonify(learningJourney.to_dict()), 201
    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Unable to commit to database."
        }), 500

# Get based on staff ID 
@app.route("/learning_journey/<int:staff_id>", methods = ["GET"]) #get all learning journey 

def get_learning_journey_staffID(staff_id): #Returns all learning journey
    try:
        to_return = LearningJourney.get_learning_journey(staff_id)
        return jsonify({"data": to_return}), 200

    except Exception:
       print(traceback.format_exc())
       return jsonify({
           "message" : "Error in retrieving mapping"
       }), 500

# based on the specific learning journey id
@app.route("/learning_journey/update/<int:lj_ID>", methods=['PUT'])
def update_learning_journeys(lj_ID):
    try:
        data = request.get_json()
        LearningJourney.update_learning_journey(data, lj_ID)
        return jsonify({"message": "Learning Journey updated successfully!"})

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Learning Journey not found! You screwed up big time!"
        }), 500
   
# Deletion of learning journey
@app.route("/learning_journey/delete", methods=['DELETE'])
def delete_learning_journey():
    data = request.get_json()


    try:
        LearningJourney.delete_learning_journey(data)
        return jsonify({"message": "Learning Journey deleted successfully"})

    except Exception:
        print(traceback.format_exc())
        return jsonify({
            "message": "Learning Journey not found!"
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
