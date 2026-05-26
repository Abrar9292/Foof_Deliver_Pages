document.addEventListener("DOMContentLoaded", function () {

  let foodCart = JSON.parse(localStorage.getItem("foodCart")) || [];
  let wishlist = JSON.parse(localStorage.getItem("foodWishlist")) || [];

  const cartCounts = document.querySelectorAll(".food-cart-count");
  const addButtons = document.querySelectorAll(".food-add-btn");
  const cartItems = document.getElementById("foodCartItems");
  const totalItems = document.getElementById("foodTotalItems");
  const subtotal = document.getElementById("foodSubtotal");
  const grandTotal = document.getElementById("foodGrandTotal");
  const clearCartBtn = document.getElementById("clearFoodCart");

  const filterButtons = document.querySelectorAll(".food-filter-btn");
  const foodItems = document.querySelectorAll(".food-item");

  const searchInput = document.getElementById("foodSearch");

  const themeToggle = document.getElementById("themeToggle");
  const backTop = document.getElementById("backToTop");

  /* PRELOADER */

  setTimeout(() => {
    const preloader = document.getElementById("preloader");

    if (preloader) {
      preloader.style.display = "none";
    }
  }, 700);

  /* TOAST */

  function showToast(message) {

    const toastBox = document.getElementById("toastBox");

    if (!toastBox) return;

    const toast = document.createElement("div");

    toast.className = "custom-toast";
    toast.innerText = message;

    toastBox.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  /* CART */

  function updateCartCount() {

    cartCounts.forEach((count) => {

      const totalQty = foodCart.reduce((sum, item) => sum + item.qty, 0);

      count.textContent = totalQty;

    });

  }

  function saveCart() {

    localStorage.setItem("foodCart", JSON.stringify(foodCart));

    updateCartCount();

  }

  addButtons.forEach((button) => {

    const card = button.closest(".food-card");

    /* WISHLIST BUTTON */

    if (card && !card.querySelector(".wishlist-btn")) {

      const wishBtn = document.createElement("button");

      wishBtn.className = "wishlist-btn";

      wishBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;

      card.appendChild(wishBtn);

      const foodName = card.querySelector("h5").textContent;

      if (wishlist.includes(foodName)) {

        wishBtn.classList.add("active");

        wishBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

      }

      wishBtn.addEventListener("click", function () {

        if (wishlist.includes(foodName)) {

          wishlist = wishlist.filter(item => item !== foodName);

          wishBtn.classList.remove("active");

          wishBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;

          showToast("Removed From Favorites");

        } else {

          wishlist.push(foodName);

          wishBtn.classList.add("active");

          wishBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

          showToast("Added To Favorites");

        }

        localStorage.setItem("foodWishlist", JSON.stringify(wishlist));

      });

    }

    /* ADD CART */

    button.addEventListener("click", function () {

      const item = {

        name: card.querySelector("h5").textContent,
        price: card.querySelector("h4").textContent,
        image: card.querySelector("img").src,
        qty: 1

      };

      const existing = foodCart.find(product => product.name === item.name);

      if (existing) {

        existing.qty += 1;

      } else {

        foodCart.push(item);

      }

      saveCart();

      showToast("Food Added Successfully");

      button.textContent = "Added ✓";

      button.classList.remove("btn-dark");

      button.classList.add("btn-success");

      setTimeout(() => {

        button.textContent = "Add to Cart";

        button.classList.remove("btn-success");

        button.classList.add("btn-dark");

      }, 1000);

    });

  });

  /* RENDER CART */

  function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (foodCart.length === 0) {

      cartItems.innerHTML = `

        <div class="empty-cart">

          <i class="fa-solid fa-cart-shopping"></i>

          <h4>Your food cart is empty</h4>

          <p>Add food items from menu page.</p>

          <a href="foodmenu.html"
          class="btn btn-warning rounded-pill px-4">

          Order Now

          </a>

        </div>

      `;

      totalItems.textContent = "0";
      subtotal.textContent = "₹0";
      grandTotal.textContent = "₹0";

      return;
    }

    let total = 0;
    let count = 0;

    foodCart.forEach((item, index) => {

      const priceNumber = Number(item.price.replace(/[₹,]/g, ""));

      total += priceNumber * item.qty;

      count += item.qty;

      cartItems.innerHTML += `

        <div class="cart-item">

          <img src="${item.image}" alt="${item.name}">

          <div class="cart-details">

            <h5>${item.name}</h5>

            <p>${item.price}</p>

            <div class="qty-box">

              <button onclick="decreaseQty(${index})">-</button>

              <span>${item.qty}</span>

              <button onclick="increaseQty(${index})">+</button>

            </div>

          </div>

          <button class="remove-btn"
          onclick="removeFoodItem(${index})">

          Remove

          </button>

        </div>

      `;
    });

    totalItems.textContent = count;

    subtotal.textContent = `₹${total}`;

    grandTotal.textContent = `₹${total + 49}`;
  }

  window.increaseQty = function (index) {

    foodCart[index].qty += 1;

    saveCart();

    renderCart();

  };

  window.decreaseQty = function (index) {

    if (foodCart[index].qty > 1) {

      foodCart[index].qty -= 1;

    } else {

      foodCart.splice(index, 1);

    }

    saveCart();

    renderCart();

  };

  window.removeFoodItem = function (index) {

    foodCart.splice(index, 1);

    saveCart();

    renderCart();

    showToast("Food Removed");

  };

  if (clearCartBtn) {

    clearCartBtn.addEventListener("click", function () {

      foodCart = [];

      saveCart();

      renderCart();

      showToast("Cart Cleared");

    });

  }

  /* FILTER */

  filterButtons.forEach((button) => {

    button.addEventListener("click", function () {

      filterButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      foodItems.forEach((item) => {

        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {

          item.style.display = "block";

        } else {

          item.style.display = "none";

        }

      });

    });

  });

  /* SEARCH */

  if (searchInput) {

    searchInput.addEventListener("keyup", function () {

      const value = searchInput.value.toLowerCase();

      foodItems.forEach((item) => {

        const name = item.querySelector("h5")
        .textContent
        .toLowerCase();

        if (name.includes(value)) {

          item.style.display = "block";

        } else {

          item.style.display = "none";

        }

      });

    });

  }

  /* DARK MODE */

  if (themeToggle) {

    if (localStorage.getItem("foodTheme") === "dark") {

      document.body.classList.add("light-mode");

      themeToggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;

    }

    themeToggle.addEventListener("click", function () {

      document.body.classList.toggle("light-mode");

      if (document.body.classList.contains("light-mode")) {

        localStorage.setItem("foodTheme", "dark");

        themeToggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;

      } else {

        localStorage.setItem("foodTheme", "light");

        themeToggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;

      }

    });

  }

  /* BACK TO TOP */

  window.addEventListener("scroll", function () {

    if (window.scrollY > 300) {

      backTop.classList.add("show");

    } else {

      backTop.classList.remove("show");

    }

  });

  backTop.addEventListener("click", function () {

    window.scrollTo({

      top: 0,
      behavior: "smooth"

    });

  });

  updateCartCount();

  renderCart();

});