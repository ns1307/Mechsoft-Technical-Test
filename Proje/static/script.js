document.addEventListener('DOMContentLoaded', function() {
  // Initialize materialize modals
  var elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);
  // Initialize materialize datepickers
  var dateElems = document.querySelectorAll('.datepicker');
  M.Datepicker.init(dateElems, {format: 'yyyy-mm-dd'});
  // Initialize materialize timepickers
  var timeElems = document.querySelectorAll('.timepicker');
  M.Timepicker.init(timeElems, {twelveHour: false});
  // Fetch and display meetings on page load
  fetchMeetings();
});

// Editing meeting ID initialization
let editingMeetingId = null;
// Initialize or load meetings from local storage
let meetings = JSON.parse(localStorage.getItem("meetings")) || [];
// Display meetings on page load
updateDisplay();

function fetchMeetings() {
  // Fetch meetings from server
  fetch('/get_meetings')
    .then(response => response.json())
    .then(data => {
      meetings = data; // Update global meetings variable
      updateDisplay(); // Use existing function to display meetings
    })
    .catch(error => console.error('Error:', error));
}

function saveMeeting() {
  // If editing, meetingID is set
  var meetingID = editingMeetingId;
  // Gather form values
  const meetingSubject = document.getElementById('meetingSubject').value;
  const meetingDate = document.getElementById('meetingDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const participants = document.getElementById('participants').value.split(',').map(p => p.trim());

  // Validation checks
  if (!validateMeeting(meetingSubject, meetingDate, startTime, endTime, participants)) {
    return;
  }

  // Construct meeting object
  const meeting = { meetingID: meetingID, subject: meetingSubject, date: meetingDate, startTime, endTime, participants };

  // Send meeting data to server via POST
  fetch('/save_meeting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meeting),
  })
  .then(response => response.json())
  .then(data => {
    console.log('SUCCESS:', meeting);
    // Close modal and clear form after successful save
    closeModel();
    clearForm();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function validateMeeting(subject, date, startTime, endTime, participants) {
  // Validation logic for new or edited meeting
  const now = new Date();
  const startMeetingDate = new Date(date + ' ' + startTime);
  const endMeetingTime = new Date(date + ' ' + endTime);
  // Various validation checks
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
  // Delete meeting by index
  const meetingID = meetings[index].meetingID;

  fetch('/delete_meeting', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({meetingID: meetingID}),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Delete Success:', data);
    // Refresh meeting list after delete
    fetchMeetings();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function editMeeting(index) {
  // Prepare and open the form for editing a meeting
  const meeting = meetings[index];
  editingMeetingId = meeting.meetingID; // Set ID for editing
  console.log(meetings);
  // Set form values to selected meeting details
  document.getElementById('meetingSubject').value = meeting.subject;
  document.getElementById('meetingDate').value = meeting.date;
  document.getElementById('startTime').value = meeting.startTime;
  document.getElementById('endTime').value = meeting.endTime;
  document.getElementById('participants').value = meeting.participants.join(', ');
  // Re-initialize Materialize labels for input elements
  M.updateTextFields();
  // Set modal title to indicate editing state
  document.getElementById('modalTitle').innerText = "Toplantıyı Düzenle";
  
  // Programmatically open the modal for editing
  const modal = M.Modal.getInstance(document.querySelector('#newMeetingModal'));
  modal.open();

  // Initialize datepicker and timepicker with existing meeting values
  const datePickerElems = document.querySelectorAll('.datepicker');
  M.Datepicker.init(datePickerElems, {format: 'yyyy-mm-dd', defaultDate: new Date(meeting.date), setDefaultDate: true});
  
  const timePickerElems = document.querySelectorAll('.timepicker');
  M.Timepicker.init(timePickerElems, {twelveHour: false, defaultTime: meeting.startTime}); // Assuming startTime format is compatible
}

function updateDisplay() {
  // Sort and display meetings
  meetings.sort((a, b) => {
    const aDate = new Date(a.date + ' ' + a.startTime);
    const bDate = new Date(b.date + ' ' + b.startTime);
    return aDate - bDate;
  });
  const container = document.getElementById("meetingList");
  container.innerHTML = '<div class="row"><div class="col s2 m6"><h5 style="text-align:center;"><b>Yaklaşan Toplantılar: </b></h5></div></div>';
  if (meetings.length > 0) {
    meetings.forEach((meeting, index) => {
      const html = `
        <div class="row">
          <div class="col s12 m6">
            <div class="card blue darken-2">
              <div class="card-content white-text">
                <span class="card-title">Konu: ${meeting.subject}</span>
                <p>Tarih: ${meeting.date}</p>
                <p>Saat: ${meeting.startTime} - ${meeting.endTime}</p>
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
  } else {
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

function clearForm() {
  // Clear form fields
  document.getElementById('meetingSubject').value = '';
  document.getElementById('meetingDate').value = '';
  document.getElementById('startTime').value = '';
  document.getElementById('endTime').value = '';
  document.getElementById('participants').value = '';

  // Re-initialize Materialize CSS input fields
  M.updateTextFields();

  // Reset datepicker and timepicker elements
  var dateElems = document.querySelectorAll('.datepicker');
  var timeElems = document.querySelectorAll('.timepicker');
  M.Datepicker.init(dateElems, {format: 'yyyy-mm-dd'}).forEach(function(instance) {
    instance.setDate(null);
  });
  M.Timepicker.init(timeElems, {twelveHour: false}).forEach(function(instance) {
    instance.time = ''; // Reset timepicker
  });

  // Reset editingMeetingId variable
  editingMeetingId = null;

  // Reset modal title to "New Meeting"
  document.getElementById('modalTitle').innerText = "Yeni Toplantı";
}

function closeModel() {
  // Close modal and reset editingMeetingId
  editingMeetingId = null;
  var modalElem = document.querySelector('#newMeetingModal');
  var modalInstance = M.Modal.getInstance(modalElem);
  modalInstance.close();
  fetchMeetings(); // Refresh meetings list
}

function showWarning(message) {
  // Display warning message
  document.getElementById('warningText').innerText = message;
  const warningModal = M.Modal.getInstance(document.querySelector('#warningModal'));
  warningModal.open();
}

