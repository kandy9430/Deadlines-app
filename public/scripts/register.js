const registerForm = document.querySelector(".register-form");
const emailInput = document.querySelector(".email-input");
const usernameInput = document.querySelector(".username-input");
const passwordInput = document.querySelector(".password-input");
const inputs = document.querySelectorAll(".form-control");
const passwordInvalidFeedback = document.querySelector(
  ".password-invalid-feedback"
);

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const usernameRegex = /^[a-zA-Z\d]{1,20}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/m;

const validateInput = (input, regex) => {
  if (regex.test(input.value)) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
};

const validateInputsOnSubmit = () => {
  const emailValid = validateInput(emailInput, emailRegex);
  const usernameValid = validateInput(usernameInput, usernameRegex);
  const passwordValid = validateInput(passwordInput, passwordRegex);
  if (emailValid && usernameValid && passwordValid) {
    return true;
  } else {
    return false;
  }
};

emailInput.addEventListener("keyup", function () {
  if (registerForm.classList.contains("custom-validated")) {
    validateInput(this, emailRegex);
  }
});

usernameInput.addEventListener("keyup", function () {
  if (registerForm.classList.contains("custom-validated")) {
    validateInput(this, usernameRegex);
  }
});

passwordInput.addEventListener("keyup", function () {
  if (registerForm.classList.contains("custom-validated")) {
    validateInput(this, passwordRegex);
  }
});

registerForm.addEventListener("submit", function (event) {
  if (!validateInputsOnSubmit()) {
    event.preventDefault();
    event.stopPropagation();
  }
  this.classList.add("custom-validated");
});
