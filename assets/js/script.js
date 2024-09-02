document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const searchInput = document.getElementById("searchInput");
  const table = document.getElementById("attendeesTable");
  const pagination = document.getElementById("pagination");
  const rowsPerPage = 5;
  let tableRows = Array.from(table.rows);

  function updateActiveLink() {
    const currentSection = [...sections].find(section => window.pageYOffset >= section.offsetTop - 150)?.id || "";
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href").slice(1) === currentSection);
    });
  }

  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    updateActiveLink();
  }

  function smoothScroll(e) {
    e.preventDefault();
    if (navbarCollapse.classList.contains("show")) {
      navbarToggler.click();
    }
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  }

  function displayRows(startIndex, endIndex) {
    tableRows.forEach((row, index) => {
      row.style.display = (index >= startIndex && index < endIndex) ? "" : "none";
    });
  }

  function generatePagination(totalRows) {
    const pageCount = Math.ceil(totalRows / rowsPerPage);
    pagination.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const li = document.createElement("li");
      li.className = "page-item";
      li.innerHTML = `<a class="page-link" href="#" style="color: #c35839;">${i + 1}</a>`;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        displayRows(i * rowsPerPage, (i + 1) * rowsPerPage);
      });
      pagination.appendChild(li);
    }
  }

  function searchTable() {
    const query = searchInput.value.toLowerCase();
    tableRows = Array.from(table.rows).filter(row =>
      Array.from(row.cells).some(cell => cell.textContent.toLowerCase().includes(query))
    );
    generatePagination(tableRows.length);
    displayRows(0, rowsPerPage);
  }

  window.addEventListener("scroll", handleScroll);
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", smoothScroll);
  });
  searchInput.addEventListener("input", searchTable);

  // Initial load
  generatePagination(tableRows.length);
  displayRows(0, rowsPerPage);
  updateActiveLink();
});
