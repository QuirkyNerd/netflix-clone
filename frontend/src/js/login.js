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

// Function to handle input focus
const inputOnFocus = (input) => {
    inputTouched[input.name] = true;
    const warningDiv = document.getElementById(`warning${capitalizeFirstLetter(input.name)}`);
    warningDiv.style.display = "none"; // Hide warning on focus
};

// Function to handle input blur
const inputOnBlur = (input) => {
    if (!input.value) {
        const warningDiv = document.getElementById(`warning${capitalizeFirstLetter(input.name)}`);
        warningDiv.style.display = "block"; // Show warning on blur if input is empty
    }
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Login function
const login = async (credentials) => {
    showMessage("Logging in...");
    try {
        const response = await axios.post("http://localhost:5000/api/v1/auth/login", credentials, {
            withCredentials: true
        });
        showMessage("Login successful! Redirecting...");
        console.log(response.data);
        
        // Redirect to homepage
        window.location.href = "netflix/homepage.html";
    } catch (error) {
        console.error("Login error:", error);
        showMessage(error.response?.data?.message || "Wrong credentials", true);
    }
};


// Add event listener for login form submission
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = inputEmail.value;
    const password = inputPassword.value;

    // Validate email before login
    if (validateEmail(email)) {
        login({ email, password }); // Call login function
    } else {
        showMessage("Please enter a valid email.", true);
    }
});

// Email validation function
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};