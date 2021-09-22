const documentForm = document.querySelector(".document-form");
const categoryGroup = document.querySelector(".category-group");
const categoryChecks = document.querySelectorAll(".form-check-input");

const checkCategoryChecks = function () {
  let oneSelected = false;

  for (let categoryCheck of categoryChecks) {
    if (categoryCheck.checked) {
      oneSelected = true;
    }
  }
  for (let categoryCheck of categoryChecks) {
    if (oneSelected) {
      categoryCheck.required = false;
    }
  }
};

categoryGroup.addEventListener("change", checkCategoryChecks);
documentForm.addEventListener("submit", checkCategoryChecks);
