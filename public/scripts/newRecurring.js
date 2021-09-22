const form = document.querySelector("form");
const categoryField = document.querySelector("fieldset");
const otherRadio = document.querySelector("#other");
const otherCategoryInput = document.querySelector("#other-category-input");

categoryField.addEventListener("change", function () {
  otherCategoryInput.disabled = true;
  if (otherRadio.checked) {
    otherCategoryInput.disabled = false;
  }
});

form.addEventListener("submit", function () {
  otherRadio.value = otherCategoryInput.value;
});
