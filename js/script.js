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


// Fetch data JSON untuk membuat doughnut chart berdasarkan revenue per lokasi
fetch('./json/vm_cleaned.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        // Menghitung total revenue per lokasi
        const totals = data.reduce((acc, item) => {
            const location = item.Location;
            const lineTotal = parseFloat(item.LineTotal); // Mengubah LineTotal menjadi float

            if (!acc[location]) {
                acc[location] = 0;
            }
            acc[location] += lineTotal; // Menjumlahkan revenue per lokasi
            return acc;
        }, {});

        // Memisahkan labels dan data untuk chart
        const labels = Object.keys(totals);
        const chartData = Object.values(totals);

        // Membuat doughnut chart dengan data yang telah diproses
        createDoughnutChart(labels, chartData, 'doughnut');
    })
    .catch((error) => console.error('Error fetching JSON data:', error));

// Fungsi untuk membuat doughnut chart
function createDoughnutChart(labels, data, type) {
    new Chart(document.getElementById('pieChart').getContext('2d'), {
        type: type, // Tipe chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Revenue',
                data: data,
                backgroundColor: [ // Warna background untuk setiap bagian chart
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [ // Warna border untuk setiap bagian chart
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right', // Posisi legend chart
                }
            }
        }
    });
}

// Fetch data JSON untuk membuat line chart berdasarkan revenue bulanan
fetch('./json/vm_cleaned.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        // Menghitung total revenue dan quantity sold per bulan
        const monthlyTotals = data.reduce((acc, item) => {
            const date = new Date(item.TransDate);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const monthYear = `${year}-${month < 10 ? '0' + month : month}`; // Format YYYY-MM

            const lineTotal = parseFloat(item.LineTotal); // Mengubah LineTotal menjadi float
            const quantitySold = parseInt(item.RQty); // Mengubah RQty menjadi integer

            if (!acc[monthYear]) {
                acc[monthYear] = { revenue: 0, quantity: 0 };
            }
            acc[monthYear].revenue += lineTotal; // Menjumlahkan revenue bulanan
            acc[monthYear].quantity += quantitySold; // Menjumlahkan quantity sold bulanan
            return acc;
        }, {});

        // Memisahkan labels dan data untuk chart dan mengurutkan berdasarkan tanggal
        const labels = Object.keys(monthlyTotals).sort((a, b) => new Date(a) - new Date(b));
        const revenueData = labels.map((label) => monthlyTotals[label].revenue);
        const quantityData = labels.map((label) => monthlyTotals[label].quantity);

        // Membuat line chart dengan data yang telah diproses
        createLineChart(labels, revenueData, quantityData);
    })
    .catch((error) => console.error('Error fetching JSON data:', error));

// Fungsi untuk membuat line chart
function createLineChart(labels, revenueData, quantityData) {
    new Chart(document.getElementById('lineChart').getContext('2d'), {
        type: 'line', // Tipe chart
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Revenue',
                    data: revenueData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Warna background untuk revenue
                    borderColor: 'rgba(75, 192, 192, 1)', // Warna border untuk revenue
                    borderWidth: 1,
                    yAxisID: 'y', // Sumbu y untuk revenue
                },
                {
                    label: 'Quantity Sold',
                    data: quantityData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Warna background untuk quantity
                    borderColor: 'rgba(255, 99, 132, 1)', // Warna border untuk quantity
                    borderWidth: 1,
                    yAxisID: 'y1', // Sumbu y1 untuk quantity
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true, // Mulai sumbu x dari 0
                },
                y: {
                    beginAtZero: true, // Mulai sumbu y dari 0
                    type: 'linear',
                    position: 'left', // Posisi sumbu y di sebelah kiri
                    ticks: {
                        callback: function(value) {
                            return `$${value.toFixed(2)}`; // Format ticks dengan $ dan 2 desimal
                        }
                    },
                    title: {
                        display: true,
                        text: 'Revenue', // Teks judul sumbu y
                    },
                },
                y1: {
                    beginAtZero: true, // Mulai sumbu y1 dari 0
                    type: 'linear',
                    position: 'right', // Posisi sumbu y1 di sebelah kanan
                    grid: {
                        drawOnChartArea: false, // Hapus garis grid pada sumbu y1
                    },
                    ticks: {
                        callback: function(value) {
                            return `${value}`; // Format ticks untuk quantity
                        }
                    },
                    title: {
                        display: true,
                        text: 'Quantity Sold', // Teks judul sumbu y1
                    },
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.datasetIndex === 0) {
                                label += `: $${context.raw.toFixed(2)}`; // Format tooltip untuk revenue
                            } else if (context.datasetIndex === 1) {
                                label += `: ${context.raw}`; // Format tooltip untuk quantity
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Fetch data JSON untuk membuat bar chart berdasarkan mesin dengan revenue tertinggi
fetch('./json/vm_cleaned.json')
    .then(response => response.json())
    .then(data => {
        // Hitung total revenue untuk setiap mesin
        const machineTotals = data.reduce((acc, item) => {
            const machine = item.Device_ID;
            const revenue = parseFloat(item.LineTotal);

            if (!acc[machine]) {
                acc[machine] = 0;
            }
            acc[machine] += revenue; // Menjumlahkan revenue per mesin
            return acc;
        }, {});

        // Urutkan mesin berdasarkan total revenue
        const sortedMachines = Object.keys(machineTotals).sort((a, b) => machineTotals[b] - machineTotals[a]);

        // Ambil 5 mesin teratas
        const topMachines = sortedMachines.slice(0, 5);

        // Data untuk chart
        const machineLabels = topMachines;
        const revenueData = topMachines.map(machine => machineTotals[machine]);

        // Buat bar chart
        createBarChart(machineLabels, revenueData);
    })
    .catch(error => console.error('Error fetching JSON data:', error));

// Fungsi untuk membuat bar chart
function createBarChart(labels, data) {
    new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar', // Tipe chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Top Machines by Revenue',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Warna background untuk bar chart
                borderColor: 'rgba(75, 192, 192, 1)', // Warna border untuk bar chart
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true, // Mulai sumbu y dari 0
                    ticks: {
                        callback: function(value) {
                            return `$${value.toFixed(2)}`; // Format ticks dengan $ dan 2 desimal
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Sembunyikan legend
                }
            }
        }
    });
}
