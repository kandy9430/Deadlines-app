const categoryForm = document.querySelector(".category-form");
const select = document.querySelector(".category-select");

select.addEventListener("change", function () {
  categoryForm.submit();
});
