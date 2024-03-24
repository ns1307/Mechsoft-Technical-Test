import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


def add_meeting_to_json(meeting):
    try:
        with open('meetings.json', 'r') as file:
            meetings = json.load(file)
    except FileNotFoundError:
        meetings = []

    # Yeni toplantı için benzersiz bir ID atama
    if meetings:
        max_id = max(meeting['meetingID'] for meeting in meetings)
    else:
        max_id = -1
    meeting['meetingID'] = max_id + 1

    meetings.append(meeting)
    
    with open('meetings.json', 'w') as file:
        json.dump(meetings, file, indent=4)
    return jsonify({'status': 'success', 'message': 'Meeting added successfully'})

def update_meeting_in_json(updated_meeting):
    try:
        with open('meetings.json', 'r') as file:
            meetings = json.load(file)
    except FileNotFoundError:
        # Dosya bulunamazsa boş bir liste dönerek işlemi sonlandır
        return {'status': 'error', 'message': 'Meetings file not found'}

    # Güncellenecek toplantının meetingID'sine göre toplantıyı bul ve güncelle
    for i, meeting in enumerate(meetings):
        if meeting['meetingID'] == updated_meeting['meetingID']:
            meetings[i] = updated_meeting
            break
    else:
        # Eğer güncellenecek toplantı bulunamazsa, hata mesajı dön
        return {'status': 'error', 'message': 'Meeting not found'}

    # Güncellenmiş toplantı listesini dosyaya yaz
    with open('meetings.json', 'w') as file:
        json.dump(meetings, file, indent=4)

    # İşlem başarıyla tamamlandı mesajı dön
    return {'status': 'success', 'message': 'Meeting updated successfully'}


def read_meetings_from_json():
    try:
        with open('meetings.json', 'r') as file:
            meetings = json.load(file)
    except FileNotFoundError:
        meetings = []
    return meetings



@app.route('/get_meetings')
def get_meetings():
    meetings = read_meetings_from_json()
    return jsonify(meetings)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_meeting', methods=['POST'])
def save_meeting():
    meeting_data = request.json
    # meeting_data içindeki 'meetingID' değerini kontrol edin
    if meeting_data['meetingID'] == -1 or meeting_data['meetingID']== None:
        # 'meetingID' yok ise, yeni bir meeting ekle
        return add_meeting_to_json(meeting_data)
    else:
        # 'meetingID' -1 değilse, meeting'i güncelle
        return update_meeting_in_json(meeting_data)
       
    

if __name__ == '__main__':
    app.run(debug=True)
