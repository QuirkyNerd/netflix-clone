let inputTouched = {
    email: false,
    password: false
};

const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");
const warningEmail = document.getElementById("warningEmail");
const warningPassword = document.getElementById("warningPassword");

// Function to show messages
const showMessage = (message, isError = false) => {
    const messageDiv = document.getElementById("message");
    messageDiv.innerText = message;
    messageDiv.style.color = isError ? "red" : "green";
};

// Signup function
const signup = async (credentials) => {
    showMessage("Signing up...");
    try {
        const response = await axios.post("http://localhost:5000/api/v1/auth/signup", credentials);
        showMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {
        console.error("Signup error:", error);
        showMessage(error.response?.data?.message || "Signup failed", true);
    }
};


// Add event listener for signup form submission
document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const username = document.getElementById("inputUsername").value;
    const email = inputEmail.value;
    const password = inputPassword.value;

    // Validate email or phone before signup
    if (validateEmail(email)) {
        signup({ username, email, password });
    } else {
        showMessage("Please enter a valid email.", true);
    }
});

// Email validation function
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
