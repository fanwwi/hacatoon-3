//! register connections
const signUpBtn = document.querySelector("#signUp");
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
const descriptionInp = document.getElementById("descriptionInp");
// //! edit
const editForm = document.querySelector(".editForm");
const imgInpEdit = document.getElementById("imgInpEdit");
const titleInpEdit = document.getElementById("titleInpEdit");
const priceInpEdit = document.getElementById("priceInpEdit");
const descriptionInpEdit = document.getElementById("descriptionInpEdit");

const PRODUCTS_API = 'http://localhost:8000/products'
const searchInp = document.querySelector('#search')
const modalInfo = document.querySelector('#modal-info')

//! emails
const emailConfirm = document.querySelector("#button");

//! sign up
signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.style.display = "block";
  signForm.style.display = "block";
});

overlay.addEventListener("click", closeModal);

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
  } catch (error) { }

  signForm.reset();
  closeModal();
}

//! function add products

addConfirm.addEventListener("click", () => {
  addForm.style.display = "block";
  overlay.style.display = "block";
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

addConfirm.addEventListener("click", async () => {
  if (
    !imgInp.value ||
    !titleInp.value ||
    !priceInp.value ||
    !descriptionInp.value
  ) {
    alert("Some inputs are empty!");
    return;
  }
  const newProduct = {
    image: imgInp.value,
    title: titleInp.value,
    price: priceInp.value,
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
    imgInp.value = "";
    titleInp.value = "";
    priceInp.value = "";
    descriptionInp.value = "";
    closeModal();
    render(newProduct);
  } catch (error) { }
});

// //! function render

let search = "";
let category = "";
let page = 1;
const limit = 4;
// !


async function render() {
  let API = category
    ? `${PRODUCTS_API}?q=${search}&category=${category}&_page=${page}&_limit=${limit}`
    : `${PRODUCTS_API}?q=${search}&_page=${page}&_limit=${limit}`;
  const res = await fetch(API)
  const data = await res.json()




  console.log(data);
  products.innerHTML = '';
  data.forEach(product => {
    products.innerHTML += `
    <div class="block3">
      <div class="sell">
        <img src="${product.image}" alt="" />
        <h3>${product.title}</h3>
        <p class="description">
          ${product.description}
        </p>
        <span class="prise">$${product.price}</span><br />
        <button id="${product.id}" class="editBtn">Edit</button>
        <button id="${product.id}" class="deleteBtn">Delete</button>
      </div>
    </div>
    `
  })

}
render()
let id = null;


// document.addEventListener('click', async (e) => {
//   if (e.target.classList.contains('sell')) {
//     const id = e.target.id;
//       modalInfo.style.display = "block";
//       overlay.style.display = "block";

//       const res = await fetch(`http://localhost:8000/products/${id}`);
//       const data = await res.json();
//       modalInfo.innerHTML = `
//         <div>
//           <img src="${data.image}" alt="">
//           <div class="info">
//             <h3>${data.title}</h3>
//             <p>${data.description}</p>
//             <p>${data.price}</p>
//           </div>
//         </div>
//       `;
//   }
// });


// //! delete

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    let answer = confirm("Are you sure?");
    if (!answer) {
      return;
    }
    await fetch(`http://localhost:8000/products/${e.target.id}`, {
      method: "DELETE",
    });
    render()
  }
});

// //! edit



document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("editBtn")) {
    editForm.style.display = "block";
    overlay.style.display = "block";

    const response = await fetch(
      `http://localhost:8000/products/${e.target.id}`
    );
    const data = await response.json();

    titleInpEdit.value = data.title;
    priceInpEdit.value = data.price;
    descriptionInpEdit.value = data.description;
    imgInpEdit.value = data.image;
    id = e.target.id;

    console.log(
      titleInpEdit.value,
      priceInpEdit.value,
      descriptionInpEdit.value,
      imgInpEdit.value
    );
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !titleInpEdit.value.trim() ||
    !priceInpEdit.value.trim() ||
    !descriptionInpEdit.value.trim() ||
    !imgInpEdit.value.trim()
  ) {
    alert("Some inputs are empty");
    return;
  }
  const editedObj = {
    title: titleInpEdit.value,
    price: priceInpEdit.value,
    description: descriptionInpEdit.value,
    image: imgInpEdit.value,
  };
  await fetch(`http://localhost:8000/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
  closeModal();
});

// //! search




searchInp.addEventListener("input", (e) => {
  console.log(e.target.value);
  search = e.target.value;
  render();
});





// //!pagination
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const pageSpan = document.querySelector("#pageNum");

async function fetchData() {
  const response = await fetch('http://localhost:8000/products');
  const data = await response.json();
  return data;
}

async function checkPagination() {
  const data = await fetchData();
  const totalCount = Math.ceil(data.length / limit);

  if (page === totalCount) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "inline";
  }

  if (page === 1) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline";
  }
}
checkPagination();

prevBtn.addEventListener("click", async () => {
  if (page > 1) {
    page--;
    pageSpan.innerText = page;
    await checkPagination();
    render();
  }
});

nextBtn.addEventListener("click", async () => {
  page++;
  pageSpan.innerText = page;
  await checkPagination();
  render();
});



// const prevBtn = document.querySelector("#prevBtn");
// const nextBtn = document.querySelector("#nextBtn");
// const pageSpan = document.querySelector("#pageNum");

// async function checkPagination() {
//   const data = await fetch(`http://localhost:8000/products`);
//   const totalCount = Math.ceil(data.length / limit);

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

// prevBtn.addEventListener("click", async () => {
//   if (page > 1) {
//     page--;
//     pageSpan.innerText = page;
//     await checkPagination();
//     render();
//   }
// });

// nextBtn.addEventListener("click", async () => {
//   page++;
//   pageSpan.innerText = page;
//   await checkPagination();
//   render();
// });
