const notificationReadForms = document.querySelectorAll(
  ".notification-read-form"
);

const notificationDeleteForms = document.querySelectorAll(
  ".notification-delete-form"
);

notificationReadForms.forEach((form, i) => {
  const button = document.querySelector(`#notification-read-form-btn-${i}`);
  form.addEventListener("click", (e) => {
    e.preventDefault();
    // button.classlist.remove("collapsed");
  });

  // form.addEventListener("unfocus", (e) => {
  //   button.classList.add("collapsed");
  // });
});

for (let form of notificationDeleteForms) {
  form.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("clicked");
  });
}
