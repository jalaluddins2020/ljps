# SPM G10T5 LJPS

## Software Requirements
### React.js
1. Download node from https://nodejs.org/en/
### Python version and Modules
1. Python version: Python 3.10.4
2. Navigate to spmg10t5  
  1.In command prompt  pip install -r requirements.txt
## Running the program
1. Download WAMP/MAMP/LAMP from https://www.wampserver.com/en/
2. Launch WAMP/MAMP/LAMP
3. Load the spm_project_dataLoaded -3.sql file into mysql database
4. Open spmg10t5/backend/app.py 
  1. Update the database connection string: app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://<username>:<password>@localhost:<portNumber>/spm_project'
  2. in command prompt, python app.py
5. Navigate to spmg10t5/frontend/ljps , in command prompt
  1. npm i
  2. npm start
