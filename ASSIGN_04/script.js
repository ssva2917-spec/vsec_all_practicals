// Get the form
const form =
    document.getElementById("employeeForm");


// Add submit event
form.addEventListener("submit", function(event) {

    // Prevent page reload
    event.preventDefault();


    // Get input values
    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const phone =
        document.getElementById("phone").value.trim();

    const department =
        document.getElementById("department").value;


    // Get error elements
    const nameError =
        document.getElementById("nameError");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const phoneError =
        document.getElementById("phoneError");

    const departmentError =
        document.getElementById("departmentError");

    const successMessage =
        document.getElementById("successMessage");


    // Clear old messages
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    phoneError.textContent = "";
    departmentError.textContent = "";
    successMessage.textContent = "";


    // Remove previous error styles
    document
        .getElementById("name")
        .classList.remove("error-input");

    document
        .getElementById("email")
        .classList.remove("error-input");

    document
        .getElementById("password")
        .classList.remove("error-input");

    document
        .getElementById("phone")
        .classList.remove("error-input");

    document
        .getElementById("department")
        .classList.remove("error-input");


    // Track whether form is valid
    let isValid = true;


    // ================= NAME VALIDATION =================

    const namePattern =
        /^[A-Za-z ]+$/;


    if (name === "") {

        nameError.textContent =
            "Name is required.";

        document
            .getElementById("name")
            .classList.add("error-input");

        isValid = false;

    } else if (name.length < 3) {

        nameError.textContent =
            "Name must contain at least 3 characters.";

        document
            .getElementById("name")
            .classList.add("error-input");

        isValid = false;

    } else if (!namePattern.test(name)) {

        nameError.textContent =
            "Name should contain only letters.";

        document
            .getElementById("name")
            .classList.add("error-input");

        isValid = false;
    }


    // ================= EMAIL VALIDATION =================

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (email === "") {

        emailError.textContent =
            "Email is required.";

        document
            .getElementById("email")
            .classList.add("error-input");

        isValid = false;

    } else if (!emailPattern.test(email)) {

        emailError.textContent =
            "Enter a valid email address.";

        document
            .getElementById("email")
            .classList.add("error-input");

        isValid = false;
    }


    // ================= PASSWORD VALIDATION =================

    if (password === "") {

        passwordError.textContent =
            "Password is required.";

        document
            .getElementById("password")
            .classList.add("error-input");

        isValid = false;

    } else if (password.length < 8) {

        passwordError.textContent =
            "Password must contain at least 8 characters.";

        document
            .getElementById("password")
            .classList.add("error-input");

        isValid = false;
    }


    // ================= PHONE VALIDATION =================

    const phonePattern =
        /^[0-9]{10}$/;


    if (phone === "") {

        phoneError.textContent =
            "Phone number is required.";

        document
            .getElementById("phone")
            .classList.add("error-input");

        isValid = false;

    } else if (!phonePattern.test(phone)) {

        phoneError.textContent =
            "Phone number must contain exactly 10 digits.";

        document
            .getElementById("phone")
            .classList.add("error-input");

        isValid = false;
    }


    // ================= DEPARTMENT VALIDATION =================

    if (department === "") {

        departmentError.textContent =
            "Please select a department.";

        document
            .getElementById("department")
            .classList.add("error-input");

        isValid = false;
    }


    // ================= FINAL RESULT =================

    if (isValid) {

        successMessage.textContent =
            "✓ Employee registered successfully!";

        form.reset();

    }

});