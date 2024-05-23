fetch("./json/vm_cleaned.json")
  .then((response) => response.json())
  .then(function (json) {
    // mengambil nilai revenue
    const revenue = json.map(function (item) {
      return parseFloat(item.LineTotal);
    });

    const eledatarev = document.getElementById("totalRevenue");
    eledatarev.innerHTML = revenue.reduce((acc, curr) => acc + curr, 0);

    // mengambil nilai loc
    const loc = json.map(function (item) {
      return item.Location;
    });

    const eledataloc = document.getElementById("dataloc");
    eledataloc.innerHTML = new Set(loc).size;

    // mengambil nilai machine
    const mach = json.map(function (item) {
      return item.Device_ID;
    });

    const eledatamach = document.getElementById("datamach");
    eledatamach.innerHTML = new Set(mach).size;

    //mengambil nilai category
    const catgry = json.map(function (item) {
      return item.Category;
    });

    const eledatacatgry = document.getElementById("datacatgry");
    eledatacatgry.innerHTML = new Set(catgry).size;
  });

const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});

fetch("./json/vm_cleaned.json");
