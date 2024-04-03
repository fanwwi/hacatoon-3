//! register connections
const signUpBtn = document.querySelector("#signUpBtn");
const overlay = document.querySelector(".overlay");
const usernameInp = document.querySelector("#usernameInp");
const emailInp = document.querySelector("#emailInp");
const passwordInp = document.querySelector("#passwordInp");
const confirmInp = document.querySelector("#confirmInp");
const signСonfirm = document.querySelector("#signUp");
const signForm = document.querySelector(".signForm");
const modal = document.querySelectorAll(".modal");

// //! add product
const addBtn = document.querySelector("#addBtn");
const addConfirm = document.querySelector("#addConfirm");
const addForm = document.querySelector(".addForm");
const products = document.querySelector("#products");
const imgInp = document.getElementById("imgInp");
const titleInp = document.getElementById("titleInp");
const priceInp = document.getElementById("priceInp");
const categoryInp = document.getElementById("categoryInp");
const descriptionInp = document.getElementById("descriptionInp");
// //! edit
// const editForm = document.querySelector(".editProduct");
// const imgInpEdit = document.getElementById("imgInpEdit");
// const titleInpEdit = document.getElementById("titleInpEdit");
// const priceInpEdit = document.getElementById("priceInpEdit");
// const categoryInpEdit = document.getElementById("categoryInpEdit");
// const descriptionAreaEdit = document.getElementById("descriptionAreaEdit");

// const cards = document.querySelector(".cards");
// const divImg = document.getElementById("divImg");

//! sign up

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  signForm.style.display = "block";
});

overlay.addEventListener("click", closeModal);

// addForm.addEventListener("click", function (event) {
//   event.stopPropagation();
// });

//! close modal

function closeModal() {
  modal.forEach((item) => (item.style.display = "none"));
  overlay.style.display = "none";
  signForm.style.display = "none";
  addForm.style.display = "none";
}

//! function registartion

signForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await registration();
});

async function registration() {
  if (passwordInp.value.length < 8) {
    console.error("Password must be more than 8 characters!");
    return;
  }

  if (passwordInp.value !== confirmInp.value) {
    console.error("Password and its confirmation don't match!");
    return;
  }

  let res = await fetch("http://localhost:8000/users");
  let users = await res.json();

  console.log(users);
  if (users.some((item) => item.email === emailInp.value)) {
    alert("This email is already taken!");
    return;
  }

  let data = {
    username: usernameInp.value,
    email: emailInp.value,
    password: passwordInp.value,
  };

  console.log(data);

  try {
    await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    alert("User successfully registrated!");
  } catch (error) {}

  signForm.reset();
  closeModal();
}

// //! function add products to db

addBtn.addEventListener("click", () => {
  addForm.style.display = "block";
  overlay.style.display = "block";
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

// //! function get products from db
addConfirm.addEventListener("click", async () => {
  if (
    !imgInp.value ||
    !titleInp.value ||
    !priceInp.value ||
    !categoryInp.value ||
    !descriptionInp.value
  ) {
    alert("Some inputs are empty!");
    return;
  }
  const newProduct = {
    image: imgInp.value,
    title: titleInp.value,
    price: priceInp.value,
    category: categoryInp.value,
    description: descriptionInp.value,
  };

  try {
    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    console.log(response);
    imgInp.value = "";
    titleInp.value = "";
    priceInp.value = "";
    categoryInp.value = "";
    descriptionInp.value = "";
    closeModal();
    render(newProduct);
  } catch (error) {}
});

// //! function render

// let search = "";
// let category = "";
// let page = 1;
// const limit = 2;

async function render() {
  const res = await fetch("http://localhost:8000/products");
  const data = await res.json();

  products.innerHTML = "";

  data.forEach((product) => {
    products.innerHTML += `
    <div class="block3">
        <div class="sell">
          <img src="${product.image}" alt="" />
          <h3>${product.title}</h3>
          <p class="description">
            ${product.description}
          </p>
          <span class="prise">$${product.price}</span>
        </div>
      </div>
  `;
  });
}

render();

// //! categories

// document.addEventListener("DOMContentLoaded", function () {
//   let catalogSections = document.querySelectorAll(".left-catalog-section");

//   catalogSections.forEach(function (section) {
//     section.addEventListener("click", function (event) {
//       event.preventDefault();

//       let subCategories = this.querySelector(".left-catalog-section-sections");

//       subCategories.style.display =
//         subCategories.style.display === "none" ? "block" : "none";

//       let arrow = this.querySelector("svg");
//       arrow.parentNode.classList.toggle("collapsed");
//     });
//   });
// });

// //! delete
// document.addEventListener("click", async (e) => {
//   if (e.target.classList.contains("delete-btn")) {
//     await fetch(`${PRODUCTS_API}/${e.target.id}`, { method: "DELETE" });
//     render();
//   }
// });

// //! edit

// let id = null;

// document.addEventListener("click", async (e) => {
//   if (e.target.classList.contains("edit-btn")) {
//     const productId = e.target.id;
//     editForm.style.display = "block";
//     overlay.style.display = "block";
//     const data = await getQuery(`products/${productId}`);
//     titleInpEdit.value = data.title;
//     priceInpEdit.value = data.price;
//     categoryInpEdit.value = data.category;
//     descriptionAreaEdit.value = data.description;
//     imgInpEdit.value = data.image;
//     id = productId;
//   }
// });

// editForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   if (
//     !titleInpEdit.value.trim() ||
//     !priceInpEdit.value.trim() ||
//     !descriptionAreaEdit.value.trim() ||
//     !categoryInpEdit.value.trim() ||
//     !imgInpEdit.value.trim()
//   ) {
//     alert("Some inputs are empty");
//     return;
//   }
//   const editedObj = {
//     title: titleInpEdit.value,
//     price: priceInpEdit.value,
//     description: descriptionAreaEdit.value,
//     image: imgInpEdit.value,
//     category: categoryInpEdit.value,
//   };
//   await fetch(`${PRODUCTS_API}/${id}`, {
//     method: "PATCH",
//     body: JSON.stringify(editedObj),
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//   });
//   render();
//   closeModal();
// });

// //! search
// searchInp.addEventListener("input", (e) => {
//   console.log(e.target.value);
//   search = e.target.value;
//   render();
// });

// //! category
// const categories = document.querySelectorAll(".first-level span");
// console.log(categories);

// categories.forEach((item) => {
//   item.addEventListener("click", (e) => {
//     if (e.target.innerText === "All") {
//       category = "";
//     } else {
//       category = e.target.innerText.toLowerCase();
//     }
//     render();
//   });
// });

// //!pagination
// const prevBtn = document.querySelector("#prev");
// const nextBtn = document.querySelector("#next");
// const pageSpan = document.querySelector("#pageNum");

// async function checkPagination() {
//   const data = await getQuery("products");
//   const totalCount = Math.ceil(data.length / 2);
//   if (page === totalCount) {
//     nextBtn.style.display = "none";
//   } else {
//     nextBtn.style.display = "inline";
//   }

//   if (page === 1) {
//     prevBtn.style.display = "none";
//   } else {
//     prevBtn.style.display = "inline";
//   }
// }
// checkPagination();

// prevBtn.addEventListener("click", () => {
//   page--;
//   checkPagination();
//   pageSpan.innerText = page;
//   render();
// });

// nextBtn.addEventListener("click", () => {
//   page++;
//   checkPagination();
//   pageSpan.innerText = page;
//   render();
// });
