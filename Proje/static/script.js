document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);
  var dateElems = document.querySelectorAll('.datepicker');
  M.Datepicker.init(dateElems, {format: 'yyyy-mm-dd'});
  var timeElems = document.querySelectorAll('.timepicker');
  M.Timepicker.init(timeElems, {twelveHour: false});
  fetchMeetings(); // Sayfa yüklendiğinde toplantıları çek
});

let meetings = JSON.parse(localStorage.getItem("meetings")) || [];
let editingMeetingId = null;
updateDisplay(); // Ensure any existing meetings are displayed when the page loads.

function fetchMeetings() {
  fetch('/get_meetings')
    .then(response => response.json())
    .then(data => {
      meetings = data; // Global meetings değişkenini güncelle
      updateDisplay(); // Toplantıları göstermek için mevcut fonksiyonu kullan
    })
    .catch(error => console.error('Error:', error));
}

function saveMeeting() {
  const meetingID = document.getElementById('meetingID');
  if (meetingID && meetingID.value) {
    // meetingID değeri var ve null değil,.
    const meetingID = document.getElementById('meetingID').value;
    console.log('Meeting ID:', meetingIDElement.value);
  } else {
    // meetingID değeri null veya meetingID elementi bulunamadı.
    const meetingID = -1;
    console.log('Meeting ID bulunamadı veya null.');
  }
  const meetingSubject = document.getElementById('meetingSubject').value;
  const meetingDate = document.getElementById('meetingDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const participants = document.getElementById('participants').value.split(',').map(p => p.trim());

  // Mevcut doğrulamalarını koru
  if (!validateMeeting(meetingSubject, meetingDate, startTime, endTime, participants)) {
    return;
  }

  const meeting = { meetingID: meetingID, subject: meetingSubject, date: meetingDate, startTime, endTime, participants };

  // AJAX ile Flask'a veri gönder
  fetch('/save_meeting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meeting),
  })
  .then(response => response.json())
  .then(data => {
    console.log('SUCCESS:', data);
    // Başarı mesajı veya güncelleme işlemi
    fetchMeetings();
    // Modalı kapat
    var modalElem = document.querySelector('#newMeetingModal');
    var modalInstance = M.Modal.getInstance(modalElem);
    modalInstance.close(); // Modalı kapat
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


function validateMeeting(subject, date, startTime, endTime, participants) {
  const now = new Date();
  const startMeetingDate = new Date(date + ' ' + startTime);
  const endMeetingTime = new Date(date + ' ' + endTime);
  if (subject.trim() === '') {
    showWarning('Toplantı konusu boş olamaz.');
    return false;
  }
  if (date.trim() === '') {
    showWarning('Bir tarih seçiniz.');
    return false;
  }
  if (startMeetingDate <= now) {
    showWarning('Geçmiş bir tarihe toplantı planlanamaz.');
    return false;
  }
  if (startTime.trim() === '') {
    showWarning('Başlangıç saati seçiniz.');
    return false;
  }
  if (endTime.trim() === '') {
    showWarning('Bitiş saati seçiniz.');
    return false;
  }
  if (endMeetingTime < startMeetingDate) {
      showWarning('Toplantı bitişi, başlangıcından sonra olmalıdır.');
      return false;
    }
  if (participants.length === 0 || participants.some(participant => participant === '')) {
    showWarning('Toplantıya en az 1 katılımcı eklenmelidir.');
    return false;
  }
  return true; // All validations passed
}


function removeMeeting(index) {
  meetings.splice(index, 1);
  localStorage.setItem("meetings", JSON.stringify(meetings));
  updateDisplay();
}

function editMeeting(index) {
  editingMeetingId = index;
  const meeting = meetings[index];

  document.getElementById('meetingID').value = meeting.meetingID;
  document.getElementById('meetingSubject').value = meeting.subject;
  document.getElementById('meetingDate').value = meeting.date;
  document.getElementById('startTime').value = meeting.startTime;
  document.getElementById('endTime').value=meeting.endTime;
  document.getElementById('participants').value = meeting.participants.join(', ');

  M.updateTextFields(); // This re-initializes Materialize CSS labels for input elements.
  document.getElementById('modalTitle').innerText = "Toplantıyı Düzenle"; // Change modal title to reflect editing state

  // Open the modal programmatically for editing
  const modal = M.Modal.getInstance(document.querySelector('#newMeetingModal'));
  modal.open();

  // Initialize datepicker and timepicker with existing values
  const datePickerElems = document.querySelectorAll('.datepicker');
  M.Datepicker.init(datePickerElems, {format: 'yyyy-mm-dd', defaultDate: new Date(meeting.date), setDefaultDate: true});
  
  const timePickerElems = document.querySelectorAll('.timepicker');
  M.Timepicker.init(timePickerElems, {twelveHour: false, defaultTime: meeting.startTime}); // Assuming startTime format is suitable
}

function updateDisplay() {
  const container = document.getElementById("meetingList");
  container.innerHTML = "";
  if(meetings.length>0){
  meetings.forEach((meeting, index) => {
    const html = `
      <div class="row">
        <div class="col s12 m6">
          <div class="card blue darken-2">
            <div class="card-content white-text">
              <span class="card-title">Toplantı: ${meeting.subject}</span>
              <p>Tarih: ${meeting.date}</p>
              <p>Saat aralığı: ${meeting.startTime} - ${meeting.endTime}</p>
              <p>Katılımcılar: ${meeting.participants.join(', ')}</p>
            </div>
            <div class="card-action">
              <a href="#" onclick="editMeeting(${index})">Düzenle</a>
              <a href="#" onclick="removeMeeting(${index})">Kaldır</a>
            </div>
          </div>
        </div>
      </div>`;
    
    container.innerHTML += html;
    });
  }
  else {
    const html = `
      <div class="row">
        <div class="col s10 m3">
          <div class="card grey darken-2">
            <div class="card-content white-text">
              <p>Henüz planlanmış toplantı yok.</p>
            </div>
          </div>
        </div>
      </div>`;
    container.innerHTML += html;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateDisplay(); // To refresh the meeting list display
});

function showWarning(message) {
  document.getElementById('warningText').innerText = message;
  const warningModal = M.Modal.getInstance(document.querySelector('#warningModal'));
  warningModal.open();
}