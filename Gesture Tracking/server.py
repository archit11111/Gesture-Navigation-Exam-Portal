from flask import Flask
from flask import *
from flask_cors import CORS, cross_origin

import json
import datetime
from dateutil import parser
from itsdangerous import exc
import pytz

from server_image_processing import server_image_processing

from database.db import initialize_db
from database.models import UserLogs, Exams

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['MONGODB_SETTINGS'] = {
    'host':'mongodb://localhost:27017/Exams'
}

initialize_db(app)

process_image = server_image_processing()


@app.route('/fetch/<user>/<exam_id>', methods=['GET'])
@cross_origin()
def fetch_logs(user,exam_id):
    user_log = UserLogs.objects(name=user,exam_id=exam_id).get()
    print('dsdsds',user_log)
    return user_log.to_json()


@app.route('/fetch/<user>', methods=['GET'])
@cross_origin()
def fetch_user_log(user):
    user_log = UserLogs.objects(name=user)
    return user_log.to_json()


@app.route('/fetch', methods=['GET'])
@cross_origin()
def fetch_all_logs():
    user_logs = UserLogs.objects()
    return json.dumps(json.loads(user_logs.to_json()))


@app.route('/', methods=['POST'])
@cross_origin()
def image_processing():
    json_data = request.get_json()

    data_uri = json_data['imageSrc']

    user = json_data['user']
    exam_id = json_data['examID']
    time_limit = json_data['timeLimit']
        

    user_log=None
    print(user, exam_id)
    try:
        user_log = UserLogs.objects(name=user, exam_id=exam_id).get()
    except:
        user_log = UserLogs(name=user, exam_id=exam_id, created_at=str(datetime.datetime.now(pytz.timezone('Asia/Kolkata'))), time_limit=time_limit).save()

    json_response = json.dumps(None)
    if data_uri != None:
        response = process_image.process_image(data_uri)
        json_response = json.dumps(response, indent = 4)   
    # print(json_response)    

    user_log.save()
    return json_response



def evaluate(questions, answers):
    marks_obtained = 0
    for idx, question in enumerate(questions):
        marks = float(question['marks'])
        if question['questionType'] == 'radio':
            correct_options = question['correctOption']
            answered_options = answers.get(str(idx))
            if answered_options == None:
                continue
            if correct_options == answered_options:
                marks_obtained += marks

        elif question['questionType'] == 'checkbox':
            correct_options = question['correctOption']
            answered_options = answers.get(str(idx))
            if answered_options == None:
                continue
            total_correct, correctly_checked, wrongly_checked = 0, 0, 0
            for i in range(4):
                if correct_options[i] == True:
                    total_correct += 1
                    if answered_options[i] == correct_options[i] :
                        correctly_checked += 1
                else :
                    if answered_options[i] == True:
                        wrongly_checked += 1
            if wrongly_checked > 0:
                pass
            else:
                marks_obtained += (marks/total_correct) * correctly_checked
                
        elif question['questionType'] == 'number':
            try:
                if float(question['correctOption']) == float(answers.get(str(idx))):
                    marks_obtained += marks
            except:
                pass
    return marks_obtained


# Ends exam (referenced by examId) for a given user (referenced by user name) and evaluates the result
@app.route('/end', methods=['POST'])
@cross_origin()
def end():
    json_data = request.get_json()

    user = json_data['user']
    exam_id = json_data['examID']
    finish_t = json_data.get('finishTime', None)

    user_log = UserLogs.objects(name=user,exam_id=exam_id).get()
    if(finish_t == None):
        user_log.finished_at = str(datetime.datetime.now(pytz.timezone('Asia/Kolkata')))
    else:
        user_log.finished_at = str(parser.parse(finish_t))
    if (parser.parse(user_log.finished_at) - parser.parse(user_log.created_at)).total_seconds() * 1000 > user_log.time_limit:
        user_log.finished_at = str(parser.parse(user_log.created_at) + datetime.timedelta(seconds=user_log.time_limit / 1000))

    exam = Exams.objects.get(id=exam_id)
    marks_obtained = evaluate(exam.questions, user_log.answers)
    user_log.marks_obtained = marks_obtained
    user_log.save()
    response = {'success': True, 'marks': marks_obtained}
    json_response = json.dumps(response, indent=4)
    return json_response



@app.route('/time', methods=['POST'])
@cross_origin()        
def get_initial_values():
    json_data = request.get_json()
    
    user = json_data['user']
    exam_id = json_data['examID']    

    user_log=None
    try:
        user_log = UserLogs.objects(name=user,exam_id=exam_id).get()
    except:
        response = {'created_at':-1, 'finished_at':'-'}
        json_response = json.dumps(response, indent = 4)   
        return json_response

    created_at = user_log.created_at
    finished_at = user_log.finished_at
    response = {'created_at':str(created_at), 'finished_at':str(finished_at)}
    json_response = json.dumps(response, indent = 4)   
    print('********', created_at)
    
    return json_response


@app.route('/getAnswers', methods=['POST'])
@cross_origin()   
def get_answers():
    json_data = request.get_json()
    
    user = json_data['user']
    exam_id = json_data['examID'] 

    user_log = UserLogs.objects(name=user,exam_id=exam_id).get()

    answers = user_log.answers
    response = {'answers':answers}    
    json_response = json.dumps(response, indent = 4)   
    
    return json_response


@app.route('/saveAnswers', methods=['POST'])
@cross_origin()   
def save_answers():
    json_data = request.get_json()
    
    user = json_data['user']
    exam_id = json_data['examID'] 
    answers = json_data['answers']

    user_log = UserLogs.objects(name=user,exam_id=exam_id).get()
    user_log.answers = answers
    user_log.save()

    return 'success'
