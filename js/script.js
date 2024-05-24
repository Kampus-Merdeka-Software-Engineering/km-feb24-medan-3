// load data json
fetch("./json/vm_cleaned.json")
  .then((response) => response.json())
  .then(function (json) {
    // mengambil nilai revenue
    const revenue = json.map(function (item) {
      return parseFloat(item.LineTotal);
    });

    const eledatarev = document.getElementById("totalRevenue");
    // untuk menghitung total nilai dari LineTotal
    const totalRevenue = revenue.reduce((acc, curr) => acc + curr, 0);
    // untuk membulatkan hasilnya
    const roundedTotalRevenue = Math.round(totalRevenue);
    eledatarev.innerHTML = roundedTotalRevenue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // mengambil nilai location
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

//filter data
document.addEventListener("DOMContentLoaded", (event) => {
  // Fungsi untuk mengambil nilai filter dan memproses data
  async function processFilters() {
    // Ambil nilai yang dipilih dari setiap filter
    const month = document.querySelector("#month select").value;
    const location = document.querySelector("#location select").value;
    const machine = document.querySelector("#machine select").value;
    const category = document.querySelector("#category select").value;

    // menampilkan nilai yang dipilih di console
    console.log("Selected Month:", month);
    console.log("Selected Location:", location);
    console.log("Selected Machine:", machine);
    console.log("Selected Category:", category);

    // Ambil data dari file JSON
    const data = await fetchData();

    // pemrosesan data berdasarkan nilai yang dipilih
    filterData(data, month, location, machine, category);
  }

  // Fungsi untuk mengambil data dari file JSON
  async function fetchData() {
    try {
      const response = await fetch("./json/vm_cleaned.json");
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  // Fungsi untuk memfilter data
  function filterData(data, month, location, machine, category) {
    const filteredData = data.filter((item) => {
      const itemMonth = new Date(item.TransDate).toLocaleString("default", {
        month: "long",
      });
      return (
        (month === itemMonth || month == "") &&
        (location === item.Location || location === "") &&
        (machine === item.Device_ID || machine === "") &&
        (category === item.Category || category === "")
      );
    });

    //menampilkan di console
    console.log("Filtered Data:", filteredData);
  }

  // event listener untuk tombol submit
  document
    .querySelector(".button button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      alert("Button clicked!"); // Menampilkan alert
      processFilters();
    });
});

// sidebar
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
