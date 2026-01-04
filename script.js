// Simple JavaScript for Attendance Management System
// Made by 2nd year students

var currentUser = null;
var students = [];
var attendanceRecords = [];

window.onload = function() {
    var today = new Date();
    var dateInput = document.getElementById('dateSelect');
    if (dateInput) {
        dateInput.value = today.toISOString().split('T')[0];
    }
    
    loadSampleData();
    
    var savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showPage('dashboardPage');
    } else {
        showPage('loginPage');
    }
    
    setupEvents();
};

function setupEvents() {
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    var addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', handleAddStudent);
    }
    
    var profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    var passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

function showPage(pageId) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }
    
    var selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    if (pageId === 'markAttendancePage') {
        loadStudents();
    } else if (pageId === 'viewReportsPage') {
        generateReport();
    } else if (pageId === 'manageStudentsPage') {
        loadStudentsList();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    if (username && password) {
        currentUser = {
            name: 'Teacher',
            email: username
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showPage('dashboardPage');
        showMessage('Login successful!');
    } else {
        showMessage('Please enter username and password', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('loginPage');
    showMessage('Logged out successfully');
}

function loadSampleData() {
    students = [
        { id: 1, name: 'Arya Patil', rollNo: 'CO001', class: 'CO-A', email: 'arya@ppce.edu', phone: '1234567890' },
        { id: 2, name: 'Siddhi Masal', rollNo: 'CO002', class: 'CO-A', email: 'siddhi@ppce.edu', phone: '1234567891' },
        { id: 3, name: 'Raj Patel', rollNo: 'CO003', class: 'CO-A', email: 'raj@ppce.edu', phone: '1234567892' },
        { id: 4, name: 'Priya Sharma', rollNo: 'CO004', class: 'CO-B', email: 'priya@ppce.edu', phone: '1234567893' },
        { id: 5, name: 'Amit Kumar', rollNo: 'CO005', class: 'CO-B', email: 'amit@ppce.edu', phone: '1234567894' },
        { id: 6, name: 'Sneha Singh', rollNo: 'CO006', class: 'CO-C', email: 'sneha@ppce.edu', phone: '1234567895' },
        { id: 7, name: 'Vikram Joshi', rollNo: 'Civil001', class: 'Civil-A', email: 'vikram@ppce.edu', phone: '1234567896' },
        { id: 8, name: 'Anita Desai', rollNo: 'Civil002', class: 'Civil-A', email: 'anita@ppce.edu', phone: '1234567897' },
        { id: 9, name: 'Rohit Gupta', rollNo: 'Civil003', class: 'Civil-B', email: 'rohit@ppce.edu', phone: '1234567898' },
        { id: 10, name: 'Kavya Reddy', rollNo: 'Civil004', class: 'Civil-B', email: 'kavya@ppce.edu', phone: '1234567899' },
        { id: 11, name: 'Arjun Singh', rollNo: 'Civil005', class: 'Civil-C', email: 'arjun@ppce.edu', phone: '1234567800' },
        { id: 12, name: 'Pooja Mehta', rollNo: 'CO007', class: 'CO-C', email: 'pooja@ppce.edu', phone: '1234567801' }
    ];
    
    var savedStudents = localStorage.getItem('students');
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    
    var savedAttendance = localStorage.getItem('attendanceRecords');
    if (savedAttendance) {
        attendanceRecords = JSON.parse(savedAttendance);
    }
}

function loadStudents() {
    var classSelect = document.getElementById('classSelect');
    var selectedClass = classSelect.value;
    
    if (!selectedClass) {
        document.getElementById('studentList').innerHTML = '<tr><td colspan="4" style="text-align: center;">Please select a class first</td></tr>';
        return;
    }
    
    var classStudents = [];
    for (var i = 0; i < students.length; i++) {
        if (students[i].class === selectedClass) {
            classStudents.push(students[i]);
        }
    }
    
    var tbody = document.getElementById('studentList');
    
    if (classStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No students found for this class</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < classStudents.length; i++) {
        var student = classStudents[i];
        html += '<tr>';
        html += '<td>' + student.rollNo + '</td>';
        html += '<td>' + student.name + '</td>';
        html += '<td><input type="radio" name="attendance_' + student.id + '" value="present"></td>';
        html += '<td><input type="radio" name="attendance_' + student.id + '" value="absent"></td>';
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
}

function submitAttendance() {
    var classSelect = document.getElementById('classSelect');
    var subjectSelect = document.getElementById('subjectSelect');
    var dateSelect = document.getElementById('dateSelect');
    
    if (!classSelect.value || !subjectSelect.value || !dateSelect.value) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    var selectedClass = classSelect.value;
    var subject = subjectSelect.value;
    var date = dateSelect.value;
    
    var classStudents = [];
    for (var i = 0; i < students.length; i++) {
        if (students[i].class === selectedClass) {
            classStudents.push(students[i]);
        }
    }
    
    var attendanceData = [];
    
    for (var i = 0; i < classStudents.length; i++) {
        var student = classStudents[i];
        var attendanceRadio = document.querySelector('input[name="attendance_' + student.id + '"]:checked');
        var status = attendanceRadio ? attendanceRadio.value : 'absent';
        
        attendanceData.push({
            studentId: student.id,
            studentName: student.name,
            rollNo: student.rollNo,
            status: status,
            date: date,
            subject: subject,
            class: selectedClass
        });
    }
    
    var record = {
        id: Date.now(),
        date: date,
        subject: subject,
        class: selectedClass,
        attendance: attendanceData
    };
    
    attendanceRecords.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    
    showMessage('Attendance recorded successfully!');
    clearAttendance();
}

function clearAttendance() {
    var radioButtons = document.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].checked = false;
    }
}

// Generate attendance report
function generateReport() {
    var reportClass = document.getElementById('reportClass').value;
    var reportSubject = document.getElementById('reportSubject').value;
    var dateFrom = document.getElementById('dateFrom').value;
    var dateTo = document.getElementById('dateTo').value;
    
    var filteredRecords = attendanceRecords;
    
    // Apply filters
    if (reportClass) {
        var temp = [];
        for (var i = 0; i < filteredRecords.length; i++) {
            if (filteredRecords[i].class === reportClass) {
                temp.push(filteredRecords[i]);
            }
        }
        filteredRecords = temp;
    }
    
    if (reportSubject) {
        var temp = [];
        for (var i = 0; i < filteredRecords.length; i++) {
            if (filteredRecords[i].subject === reportSubject) {
                temp.push(filteredRecords[i]);
            }
        }
        filteredRecords = temp;
    }
    
    if (dateFrom) {
        var temp = [];
        for (var i = 0; i < filteredRecords.length; i++) {
            if (filteredRecords[i].date >= dateFrom) {
                temp.push(filteredRecords[i]);
            }
        }
        filteredRecords = temp;
    }
    
    if (dateTo) {
        var temp = [];
        for (var i = 0; i < filteredRecords.length; i++) {
            if (filteredRecords[i].date <= dateTo) {
                temp.push(filteredRecords[i]);
            }
        }
        filteredRecords = temp;
    }
    
    // Flatten attendance data
    var reportData = [];
    for (var i = 0; i < filteredRecords.length; i++) {
        var record = filteredRecords[i];
        for (var j = 0; j < record.attendance.length; j++) {
            reportData.push({
                rollNo: record.attendance[j].rollNo,
                studentName: record.attendance[j].studentName,
                class: record.attendance[j].class,
                subject: record.attendance[j].subject,
                date: record.attendance[j].date,
                status: record.attendance[j].status
            });
        }
    }
    
    // Update statistics
    updateReportStats(reportData);
    
    // Display report table
    displayReportTable(reportData);
}

// Update report statistics
function updateReportStats(reportData) {
    var uniqueStudents = [];
    for (var i = 0; i < reportData.length; i++) {
        var found = false;
        for (var j = 0; j < uniqueStudents.length; j++) {
            if (uniqueStudents[j] === reportData[i].studentName) {
                found = true;
                break;
            }
        }
        if (!found) {
            uniqueStudents.push(reportData[i].studentName);
        }
    }
    
    var presentCount = 0;
    var absentCount = 0;
    for (var i = 0; i < reportData.length; i++) {
        if (reportData[i].status === 'present') {
            presentCount++;
        } else {
            absentCount++;
        }
    }
    
    document.getElementById('totalStudents').textContent = uniqueStudents.length;
    document.getElementById('presentToday').textContent = presentCount;
    document.getElementById('absentToday').textContent = absentCount;
}

// Display report table
function displayReportTable(reportData) {
    var tbody = document.getElementById('reportData');
    
    if (reportData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No attendance records found</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < reportData.length; i++) {
        var item = reportData[i];
        html += '<tr>';
        html += '<td>' + item.rollNo + '</td>';
        html += '<td>' + item.studentName + '</td>';
        html += '<td>' + item.class + '</td>';
        html += '<td>' + item.subject + '</td>';
        html += '<td>' + item.date + '</td>';
        html += '<td><span class="status-badge ' + item.status + '">' + item.status + '</span></td>';
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
}

// Load students list for management
function loadStudentsList() {
    var tbody = document.getElementById('studentsList');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No students found</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        html += '<tr>';
        html += '<td>' + student.rollNo + '</td>';
        html += '<td>' + student.name + '</td>';
        html += '<td>' + student.class + '</td>';
        html += '<td>' + student.email + '</td>';
        html += '<td>' + student.phone + '</td>';
        html += '<td>';
        html += '<button onclick="editStudent(' + student.id + ')">Edit</button>';
        html += '<button onclick="deleteStudent(' + student.id + ')">Delete</button>';
        html += '</td>';
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
}

// Filter students
function filterStudents() {
    var searchTerm = document.getElementById('studentSearchInput').value.toLowerCase();
    var filteredStudents = [];
    
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        if (student.name.toLowerCase().indexOf(searchTerm) !== -1 || 
            student.rollNo.indexOf(searchTerm) !== -1 ||
            student.email.toLowerCase().indexOf(searchTerm) !== -1) {
            filteredStudents.push(student);
        }
    }
    
    var tbody = document.getElementById('studentsList');
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No students found matching your search</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < filteredStudents.length; i++) {
        var student = filteredStudents[i];
        html += '<tr>';
        html += '<td>' + student.rollNo + '</td>';
        html += '<td>' + student.name + '</td>';
        html += '<td>' + student.class + '</td>';
        html += '<td>' + student.email + '</td>';
        html += '<td>' + student.phone + '</td>';
        html += '<td>';
        html += '<button onclick="editStudent(' + student.id + ')">Edit</button>';
        html += '<button onclick="deleteStudent(' + student.id + ')">Delete</button>';
        html += '</td>';
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
}

// Show add student modal
function showAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'block';
}

// Close add student modal
function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    document.getElementById('addStudentForm').reset();
}

// Handle add student
function handleAddStudent(e) {
    e.preventDefault();
    
    var newStudent = {
        id: Date.now(),
        name: document.getElementById('newStudentName').value,
        rollNo: document.getElementById('newStudentRoll').value,
        class: document.getElementById('newStudentClass').value,
        email: document.getElementById('newStudentEmail').value,
        phone: document.getElementById('newStudentPhone').value
    };
    
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    
    showMessage('Student added successfully!');
    closeAddStudentModal();
    loadStudentsList();
}

// Edit student
function editStudent(studentId) {
    var student = null;
    for (var i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
            student = students[i];
            break;
        }
    }
    if (student) {
        showMessage('Edit functionality for ' + student.name + ' coming soon!');
    }
}

// Delete student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        var newStudents = [];
        for (var i = 0; i < students.length; i++) {
            if (students[i].id !== studentId) {
                newStudents.push(students[i]);
            }
        }
        students = newStudents;
        localStorage.setItem('students', JSON.stringify(students));
        showMessage('Student deleted successfully!');
        loadStudentsList();
    }
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    showMessage('Profile updated successfully!');
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();
    var currentPassword = document.getElementById('currentPassword').value;
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    showMessage('Password changed successfully!');
    document.getElementById('passwordForm').reset();
}

// Show message function
function showMessage(message, type) {
    var messageContainer = document.getElementById('messageContainer');
    var messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    if (type === 'error') {
        messageDiv.classList.add('error');
    }
    messageDiv.innerHTML = message;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
        messageDiv.remove();
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    var modal = document.getElementById('addStudentModal');
    if (event.target === modal) {
        closeAddStudentModal();
    }
}