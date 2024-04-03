const signUpBtn = document.querySelector("#signUp");
const closeModal = document.querySelector(".close");
const modal = document.querySelector(".modal");

//! close modal

function close() {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

close();
//! sign up

signUpBtn.addEventListener("click", function () {
  modal.style.display = "block";
});
