// Store all student records
let students = [];


// Get the form
const studentForm = document.getElementById("studentForm");


// Get table body
const tableBody =
    document.getElementById("studentTableBody");


// Get empty message
const emptyMessage =
    document.getElementById("emptyMessage");


// Get topper elements
const topperName =
    document.getElementById("topperName");

const topperDetails =
    document.getElementById("topperDetails");

const topperPercentage =
    document.getElementById("topperPercentage");


// ================= FORM SUBMISSION =================

studentForm.addEventListener("submit", function(event) {

    // Prevent page reload
    event.preventDefault();


    // Get student details

    const name =
        document.getElementById("name").value;

    const rollNo =
        document.getElementById("rollNo").value;

    const department =
        document.getElementById("department").value;

    const semester =
        document.getElementById("semester").value;


    // Get marks

    const marks = [

        Number(
            document.getElementById("subject1").value
        ),

        Number(
            document.getElementById("subject2").value
        ),

        Number(
            document.getElementById("subject3").value
        ),

        Number(
            document.getElementById("subject4").value
        ),

        Number(
            document.getElementById("subject5").value
        )

    ];


    // ================= CALCULATE TOTAL =================

    const total =
        marks.reduce(
            (sum, mark) => sum + mark,
            0
        );


    // ================= CALCULATE PERCENTAGE =================

    const percentage =
        (total / 500) * 100;


    // ================= CALCULATE GRADE =================

    let grade;


    if (percentage >= 90) {

        grade = "A+";

    } else if (percentage >= 80) {

        grade = "A";

    } else if (percentage >= 70) {

        grade = "B";

    } else if (percentage >= 60) {

        grade = "C";

    } else if (percentage >= 50) {

        grade = "D";

    } else {

        grade = "F";

    }


    // ================= CREATE STUDENT OBJECT =================

    const student = {

        name: name,

        rollNo: rollNo,

        department: department,

        semester: semester,

        marks: marks,

        total: total,

        percentage: percentage,

        grade: grade

    };


    // Add student to array

    students.push(student);


    // Display student

    displayStudents();


    // Find topper

    findTopper();


    // Clear form

    studentForm.reset();

});


// ================= DISPLAY STUDENTS =================

function displayStudents() {

    // Clear old table rows

    tableBody.innerHTML = "";


    // If no students exist

    if (students.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    // Add each student to table

    students.forEach(function(student) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.rollNo}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.total}</td>

            <td>
                ${student.percentage.toFixed(2)}%
            </td>

            <td>${student.grade}</td>

        `;


        tableBody.appendChild(row);

    });

}


// ================= FIND TOPPER =================

function findTopper() {

    if (students.length === 0) {

        return;

    }


    let topper = students[0];


    for (let i = 1; i < students.length; i++) {

        if (
            students[i].percentage >
            topper.percentage
        ) {

            topper = students[i];

        }

    }


    // Display topper

    topperName.textContent =
        topper.name;


    topperDetails.textContent =
        `${topper.rollNo} • ${topper.department}`;


    topperPercentage.textContent =
        `${topper.percentage.toFixed(2)}%`;

}