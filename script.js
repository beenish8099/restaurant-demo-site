// Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Mobile nav toggle
const navToggle = $("#navToggle");
const primaryNav = $("#primaryNav");
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    primaryNav.classList.toggle("hidden");
  });
}

// Year in footer
$("#year").textContent = new Date().getFullYear();

// Menu data (pricing only)
const MENU_ITEMS = [
  { id: 1, name: "Tomato Bruschetta", price: 8, category: "starters", desc: "Grilled sourdough, marinated tomatoes, basil." },
  { id: 2, name: "Shrimp Cocktail", price: 12, category: "starters", desc: "Poached shrimp, house cocktail sauce." },
  { id: 3, name: "Grilled Salmon", price: 25, category: "seafood", desc: "Citrus butter, capers, herbs." },
  { id: 4, name: "Beef Tenderloin", price: 35, category: "mains", desc: "Peppercorn jus, truffle mash." },
  { id: 5, name: "Pasta Carbonara", price: 18, category: "pasta", desc: "Smoked beef bacon, parmesan, egg sauce." },
  { id: 6, name: "Mushroom Risotto", price: 17, category: "mains", desc: "Porcini, parmesan, thyme." },
  { id: 7, name: "Seafood Linguine", price: 22, category: "seafood", desc: "Prawns, calamari, garlic chili oil." },
  { id: 8, name: "Chocolate Lava Cake", price: 9, category: "desserts", desc: "Warm center, vanilla gelato." },
  { id: 9, name: "Tiramisu", price: 8, category: "desserts", desc: "Mascarpone, espresso, cocoa." },
  { id: 10, name: "Signature Mocktail", price: 6, category: "drinks", desc: "Citrus, mint, soda." },
  { id: 11, name: "Caprese Salad", price: 10, category: "starters", desc: "Fresh mozzarella, tomatoes, basil, balsamic." },
  { id: 12, name: "Herb Crusted Chicken", price: 22, category: "mains", desc: "Roasted chicken with seasonal vegetables." },
  { id: 13, name: "Vegetable Lasagna", price: 19, category: "pasta", desc: "Layers of pasta, vegetables, and cheese." },
  { id: 14, name: "New York Cheesecake", price: 9, category: "desserts", desc: "Classic cheesecake with berry compote." },
  { id: 15, name: "Craft Beer Selection", price: 7, category: "drinks", desc: "Local and imported craft beers." }
];

// Only run menu-related code if on menu page or homepage with menu section
const menuGrid = $("#menuGrid");
const menuSearch = $("#menuSearch");
const menuFilter = $("#menuFilter");

if (menuGrid) {
  function renderMenu(items) {
    menuGrid.innerHTML = "";
    
    // Group items by category
    const categories = {};
    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    
    // Render each category
    Object.keys(categories).forEach(category => {
      // Add category title
      const categoryTitle = document.createElement("h3");
      categoryTitle.className = "menu-category-title";
      categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      menuGrid.appendChild(categoryTitle);
      
      // Render items in this category
      categories[category].forEach(item => {
        const card = document.createElement("article");
        card.className = "menu-card";
        card.innerHTML = `
          <div class="p-5">
            <div class="flex items-start justify-between gap-4">
              <h3 class="font-bold text-lg">${item.name}</h3>
              <p class="text-red-600 font-semibold whitespace-nowrap">$${item.price}</p>
            </div>
            <p class="mt-1 text-sm text-gray-600">${item.desc}</p>
          </div>
        `;
        menuGrid.appendChild(card);
      });
    });
  }

  function applyMenuFilters() {
    const q = (menuSearch.value || "").toLowerCase();
    const filter = menuFilter.value;
    const filtered = MENU_ITEMS.filter(i => {
      const matchQuery = i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q);
      const matchCat = filter === "all" ? true : i.category === filter;
      return matchQuery && matchCat;
    });
    renderMenu(filtered);
  }

  if (menuSearch) menuSearch.addEventListener("input", applyMenuFilters);
  if (menuFilter) menuFilter.addEventListener("change", applyMenuFilters);

  renderMenu(MENU_ITEMS);
}

// Contact form validation (front-end only demo)
const contactForm = $("#contactForm");
const formStatus = $("#formStatus");

function setError(field, msg) {
  const p = document.querySelector(`.form-error[data-for="${field.id}"]`);
  if (p) p.textContent = msg || "";
  field.setAttribute("aria-invalid", msg ? "true" : "false");
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formStatus) formStatus.textContent = "";

    const name = $("#name");
    const email = $("#email");
    const phone = $("#phone");
    const message = $("#message");

    let ok = true;

    if (!name.value.trim()) { setError(name, "Please enter your name."); ok = false; } else setError(name, "");
    if (!validateEmail(email.value)) { setError(email, "Please enter a valid email."); ok = false; } else setError(email, "");
    if (phone.value && phone.value.replace(/\D/g, "").length < 10) { setError(phone, "Phone number looks too short."); ok = false; } else setError(phone, "");
    if (!message.value.trim()) { setError(message, "Please include a message."); ok = false; } else setError(message, "");

    if (!ok) return;

    // Fake success (no backend). Replace with fetch() to your endpoint.
    if (formStatus) {
      formStatus.className = "text-sm text-green-700 text-center";
      formStatus.textContent = "Thanks! Your message has been queued. We'll get back to you within 1 business day.";
    }
    contactForm.reset();
  });
}

// Intersection-based fade-in (progressive enhancement)
const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fadeIn");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 }) : null;

if (io) {
  $$("section").forEach(sec => io.observe(sec));
  $$(".menu-card").forEach(card => io.observe(card));
  $$(".card-gradient").forEach(card => io.observe(card));
}