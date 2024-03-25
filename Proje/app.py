import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def add_meeting_to_json(meeting):
    # Load existing meetings from file or initialize empty list
    try:
        with open('meetings.json', 'r') as file:
            meetings = json.load(file)
    except FileNotFoundError:
        meetings = []

    # Assign new meeting ID
    if meetings:
        max_id = max(meeting['meetingID'] for meeting in meetings)
    else:
        max_id = -1
    meeting['meetingID'] = max_id + 1

    meetings.append(meeting)
    
    # Save updated meetings list to file
    with open('meetings.json', 'w') as file:
        json.dump(meetings, file, indent=4)
    return jsonify({'status': 'success', 'message': 'Meeting added successfully'})

def update_meeting_in_json(updated_meeting):
    # Update an existing meeting in the meetings file
    print(updated_meeting);
    try:
        with open('meetings.json', 'r') as file:
            meetings = json.load(file)
    except FileNotFoundError:
        return {'status': 'error', 'message': 'Meetings file not found'}

    # Find and update the meeting by ID
    for i, meeting in enumerate(meetings):
        if str(meeting['meetingID']) == str(updated_meeting['meetingID']):
            meetings[i] = updated_meeting
            break
    else:
        return {'status': 'error', 'message': 'Meeting not found'}

    # Save the updated meetings list
    with open('meetings.json', 'w') as file:
        json.dump(meetings, file, indent=4)

    return {'status': 'success', 'message': 'Meeting updated successfully'}


def read_meetings_from_json():
    # Read meetings from file or return an empty list if file not found
    try:
        with open('meetings.json', 'r') as file:
            meetings = json.load(file)
    except FileNotFoundError:
        meetings = []
    return meetings

@app.route('/delete_meeting', methods=['DELETE'])
def delete_meeting():
    # Delete a meeting by ID
    meeting_id = request.json.get('meetingID')
    try:
        with open('meetings.json', 'r') as file:
            meetings = json.load(file)
    except FileNotFoundError:
        return jsonify({'status': 'error', 'message': 'Meetings file not found'})

    # Filter out the meeting to delete
    meetings = [meeting for meeting in meetings if str(meeting['meetingID']) != str(meeting_id)]

    # Save the updated meetings list
    with open('meetings.json', 'w') as file:
        json.dump(meetings, file, indent=4)

    return jsonify({'status': 'success', 'message': 'Meeting deleted successfully'})

@app.route('/get_meetings')
def get_meetings():
    # Return all meetings
    meetings = read_meetings_from_json()
    return jsonify(meetings)

@app.route('/')
def index():
    # Serve the main page
    return render_template('index.html')

@app.route('/save_meeting', methods=['POST'])
def save_meeting():
    # Save or update a meeting based on the meetingID
    meeting_data = request.json
    if meeting_data['meetingID'] == -1 or meeting_data['meetingID'] == None:
        return add_meeting_to_json(meeting_data)
    else:
        return update_meeting_in_json(meeting_data)
    
if __name__ == '__main__':
    app.run(debug=True)
