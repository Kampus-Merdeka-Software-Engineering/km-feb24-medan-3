// function load data JSON
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

// // fungsi untuk mengambil nilai filter dan memproses data
document.addEventListener("DOMContentLoaded", (event) => {
  async function processFilters() {
    const month = document.querySelector("#month select").value;
    const location = document.querySelector("#location select").value;
    const machine = document.querySelector("#machine select").value;
    const category = document.querySelector("#category select").value;

    // menampilkan data filtering pada console
    console.log(
      "Selected Filters - Month:",
      month,
      "Location:",
      location,
      "Machine:",
      machine,
      "Category:",
      category
    );

    // mengambil data dari json
    const data = await fetchData();
    filterData(data, month, location, machine, category);
  }

  // fungsi untuk mengambil data dari json
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

  // fungsi untuk filter data
  function filterData(data, month, location, machine, category) {
    console.log(
      "Filtering data with Month:",
      month,
      "Location:",
      location,
      "Machine:",
      machine,
      "Category:",
      category
    );

    const filteredData = data.filter((item) => {
      const itemMonth = new Date(item.TransDate).toLocaleString("default", {
        month: "long",
      });
      console.log("Item Date:", item.TransDate, "Item Month:", itemMonth);

      return (
        (month === itemMonth || month === "") &&
        (location === item.Location || location === "") &&
        (machine === item.Device_ID || machine === "") &&
        (category === item.Category || category === "")
      );
    });

    // fungsi untuk data tidak ditemukan
    if (filteredData.length === 0) {
      alert("No data found for the selected filters!");
    } else {
      updateCharts(filteredData);
    }
  }

  // fungsi untuk update seluruh chart berdasarkan filter
  function updateCharts(filteredData) {
    updateDoughnutChart(filteredData);
    updateLineChart(filteredData);
    updateBarChart(filteredData);
    updateProductRevenueChart(filteredData);
    updateCategoryChart(filteredData);
    updateMetrics(filteredData);
  }

  // fungsi untuk update display data
  function updateMetrics(filteredData) {
    // update nilai revenue
    const revenue = filteredData.map((item) => parseFloat(item.LineTotal));
    const totalRevenue = revenue.reduce((acc, curr) => acc + curr, 0);
    const roundedTotalRevenue = Math.round(totalRevenue);
    document.getElementById("totalRevenue").innerHTML =
      roundedTotalRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

    // update nilai location
    const loc = filteredData.map((item) => item.Location);
    document.getElementById("dataloc").innerHTML = new Set(loc).size;

    // update nilai machine
    const mach = filteredData.map((item) => item.Device_ID);
    document.getElementById("datamach").innerHTML = new Set(mach).size;

    // update nilai category
    const catgry = filteredData.map((item) => item.Category);
    document.getElementById("datacatgry").innerHTML = new Set(catgry).size;
  }

  document
    .querySelector(".button button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      alert("Button clicked!"); // menampilkan alert
      processFilters();
    });
});

// Fetch data JSON untuk membuat doughnut chart berdasarkan revenue per lokasi
function renderDoughnutChart(labels, data) {
  const donatChart = document.getElementById("pieChart").getContext("2d");
  doughnutChart = new Chart(donatChart, {
    type: "doughnut", // Chart type
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Revenue",
          data: data,
          backgroundColor: [
            // Background color for each chart segment
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            // Border color for each chart segment
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right", // Legend position
        },
      },
    },
  });
}

// Function to update doughnut chart with filtered data
function updateDoughnutChart(filteredData) {
  const totals = filteredData.reduce((acc, item) => {
    const location = item.Location;
    const lineTotal = parseFloat(item.LineTotal); // Convert LineTotal to float

    if (!acc[location]) {
      acc[location] = 0;
    }
    acc[location] += lineTotal; // Sum revenue per location
    return acc;
  }, {});

  // Separate labels and data for chart
  const labels = Object.keys(totals);
  const chartData = Object.values(totals);

  // Update chart data
  doughnutChart.data.labels = labels;
  doughnutChart.data.datasets[0].data = chartData;
  doughnutChart.update();
}

// Fetch initial data and create the doughnut chart
fetch("./json/vm_cleaned.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Calculate initial total revenue per location
    const totalRevenue = data.reduce((acc, item) => {
      const location = item.Location;
      const lineTotal = parseFloat(item.LineTotal); // Convert LineTotal to float

      if (!acc[location]) {
        acc[location] = 0;
      }
      acc[location] += lineTotal; // Sum revenue per location
      return acc;
    }, {});

    // Separate labels and data for chart
    const labels = Object.keys(totalRevenue);
    const revenueData = Object.values(totalRevenue);
    // Check for dark mode and adjust Chart defaults

    // render doughnut chart with initial data
    renderDoughnutChart(labels, revenueData);
  })
  .catch((error) => console.error("Error fetching JSON data:", error));

// Fungsi untuk mengubah angka bulan menjadi nama bulan singkat
function getMonthName(monthNumber) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthNumber - 1];
}

// Fetch data JSON untuk membuat line chart berdasarkan revenue bulanan
fetch("./json/vm_cleaned.json")
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
      const monthYear = `${year}-${month < 10 ? "0" + month : month}`; // Format YYYY-MM

      const lineTotal = parseFloat(item.LineTotal); // Mengubah LineTotal menjadi float
      const quantitySold = parseInt(item.RQty); // Mengubah RQty menjadi integer

      if (!acc[monthYear]) {
        acc[monthYear] = {
          revenue: 0,
          quantity: 0,
        };
      }
      acc[monthYear].revenue += lineTotal; // Menjumlahkan revenue bulanan
      acc[monthYear].quantity += quantitySold; // Menjumlahkan quantity sold bulanan
      return acc;
    }, {});

    // Memisahkan labels dan data untuk chart dan mengurutkan berdasarkan tanggal
    const labels = Object.keys(monthlyTotals).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const formattedLabels = labels.map((label) => {
      const [year, month] = label.split("-");
      return `${year}-${getMonthName(parseInt(month))}`; // Format YYYY-MMM
    });

    const revenueData = labels.map((label) => monthlyTotals[label].revenue);
    const quantityData = labels.map((label) => monthlyTotals[label].quantity);

    // Membuat line chart dengan data yang telah diproses
    createLineChart(formattedLabels, revenueData, quantityData);
  })
  .catch((error) => console.error("Error fetching JSON data:", error));

// Fungsi untuk membuat line chart
function createLineChart(labels, revenueData, quantityData) {
  const ctx = document.getElementById("lineChart").getContext("2d");
  lineChart = new Chart(ctx, {
    type: "line", // Chart type
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Revenue",
          data: revenueData,
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Background color for revenue
          borderColor: "rgba(75, 192, 192, 1)", // Border color for revenue
          borderWidth: 1,
          yAxisID: "y", // Y-axis for revenue
        },
        {
          label: "Quantity Sold",
          data: quantityData,
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Background color for quantity
          borderColor: "rgba(255, 99, 132, 1)", // Border color for quantity
          borderWidth: 1,
          yAxisID: "y1", // Y-axis for quantity
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true, // Start x-axis from 0
        },
        y: {
          beginAtZero: true, // Start y-axis from 0
          type: "linear",
          position: "left", // Position y-axis on the left
          ticks: {
            callback: function (value) {
              return `$${value.toFixed(2)}`; // Format ticks with $ and 2 decimals
            },
          },
          title: {
            display: true,
            text: "Revenue", // Y-axis title text
          },
        },
        y1: {
          beginAtZero: true, // Start y1-axis from 0
          type: "linear",
          position: "right", // Position y1-axis on the right
          grid: {
            drawOnChartArea: false, // Remove grid lines on y1-axis
          },
          ticks: {
            callback: function (value) {
              return `${value}`; // Format ticks for quantity
            },
          },
          title: {
            display: true,
            text: "Quantity Sold", // Y1-axis title text
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (context.datasetIndex === 0) {
                label += `: $${context.raw.toFixed(2)}`; // Format tooltip for revenue
              } else if (context.datasetIndex === 1) {
                label += `: ${context.raw}`; // Format tooltip for quantity
              }
              return label;
            },
          },
        },
      },
    },
  });
}

// Function to update line chart with filtered data
function updateLineChart(filteredData) {
  const monthlyTotals = filteredData.reduce((acc, item) => {
    const date = new Date(item.TransDate);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthYear = `${year}-${month < 10 ? "0" + month : month}`; // Format YYYY-MM

    const lineTotal = parseFloat(item.LineTotal); // Convert LineTotal to float
    const quantitySold = parseInt(item.RQty); // Convert RQty to integer

    if (!acc[monthYear]) {
      acc[monthYear] = {
        revenue: 0,
        quantity: 0,
      };
    }
    acc[monthYear].revenue += lineTotal; // Sum monthly revenue
    acc[monthYear].quantity += quantitySold; // Sum monthly quantity sold
    return acc;
  }, {});

  // Separate labels and data for chart and sort by date
  const labels = Object.keys(monthlyTotals).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const formattedLabels = labels.map((label) => {
    const [year, month] = label.split("-");
    return `${year}-${getMonthName(parseInt(month))}`; // Format YYYY-MMM
  });

  const revenueData = labels.map((label) => monthlyTotals[label].revenue);
  const quantityData = labels.map((label) => monthlyTotals[label].quantity);

  // Update chart data
  lineChart.data.labels = formattedLabels;
  lineChart.data.datasets[0].data = revenueData;
  lineChart.data.datasets[1].data = quantityData;
  lineChart.update();
}

// Fetch data JSON untuk membuat bar chart berdasarkan mesin dengan revenue tertinggi
fetch("./json/vm_cleaned.json")
  .then((response) => response.json())
  .then((data) => {
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
    const sortedMachines = Object.keys(machineTotals).sort(
      (a, b) => machineTotals[b] - machineTotals[a]
    );

    // Ambil 5 mesin teratas
    const topMachines = sortedMachines.slice(0, 5);

    // Data untuk chart
    const machineLabels = topMachines;
    const revenueData = topMachines.map((machine) => machineTotals[machine]);

    // Buat bar chart
    createMachineBarChart(machineLabels, revenueData);
  })
  .catch((error) => console.error("Error fetching JSON data:", error));

// Fungsi untuk membuat bar chart
function createMachineBarChart(labels, data) {
  const ctx = document.getElementById("machineBarChart").getContext("2d");
  window.machineBarChart = new Chart(ctx, {
    type: "bar", // Tipe chart
    data: {
      labels: labels,
      datasets: [
        {
          label: "Top Machines by Revenue",
          data: data,
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Warna background untuk bar chart
          borderColor: "rgba(75, 192, 192, 1)", // Warna border untuk bar chart
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true, // Mulai sumbu y dari 0
          ticks: {
            callback: function (value) {
              return `$${value.toFixed(2)}`; // Format ticks dengan $ dan 2 desimal
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Sembunyikan legend
        },
      },
    },
  });
}

// Fungsi untuk mengupdate bar chart dengan data yang sudah difilter
function updateBarChart(filteredData) {
  const machineTotals = filteredData.reduce((acc, item) => {
    const machine = item.Device_ID;
    const revenue = parseFloat(item.LineTotal);

    if (!acc[machine]) {
      acc[machine] = 0;
    }
    acc[machine] += revenue; // Menjumlahkan revenue per mesin
    return acc;
  }, {});

  const sortedMachines = Object.keys(machineTotals).sort(
    (a, b) => machineTotals[b] - machineTotals[a]
  );

  const topMachines = sortedMachines.slice(0, 5);
  const machineLabels = topMachines;
  const revenueData = topMachines.map((machine) => machineTotals[machine]);

  // Update chart
  window.machineBarChart.data.labels = machineLabels;
  window.machineBarChart.data.datasets[0].data = revenueData;
  window.machineBarChart.update();
}

// chart total produk dengan revenue
fetch("./json/vm_cleaned.json")
  .then((response) => response.json())
  .then((data) => {
    // Menghitung total produk terjual dan revenue per produk
    const productTotals = data.reduce((acc, item) => {
      const product = item.Product;
      const quantity = parseInt(item.RQty);
      const revenue = parseFloat(item.LineTotal);

      if (!acc[product]) {
        acc[product] = {
          quantity: 0,
          revenue: 0,
        };
      }
      acc[product].quantity += quantity;
      acc[product].revenue += revenue;

      return acc;
    }, {});

    // Mengurutkan produk berdasarkan total produk terjual dan memilih 10 produk paling laris
    const sortedProducts = Object.keys(productTotals)
      .map((product) => ({
        product,
        ...productTotals[product],
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const labels = sortedProducts.map((item) => item.product);
    const quantityData = sortedProducts.map((item) => item.quantity);
    const revenueData = sortedProducts.map((item) => item.revenue);

    // Membuat bar chart dengan data yang telah diproses
    createProductRevenueChart(labels, quantityData, revenueData);
  })
  .catch((error) => console.error("Error fetching JSON data:", error));

// Fungsi untuk membuat bar chart
function createProductRevenueChart(labels, quantityData, revenueData) {
  const ctx = document.getElementById("productRevenueChart").getContext("2d");
  window.productRevenueChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Quantity Sold",
          data: quantityData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Revenue",
          data: revenueData,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y", // Mengubah sumbu index menjadi horizontal
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            callback: function (value) {
              return `$${value.toFixed(2)}`;
            },
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (context.datasetIndex === 0) {
                label += `: ${context.raw}`;
              } else if (context.datasetIndex === 1) {
                label += `: $${context.raw.toFixed(2)}`;
              }
              return label;
            },
          },
        },
      },
    },
  });
}

// Fungsi untuk mengupdate bar chart dengan data yang sudah difilter
function updateProductRevenueChart(filteredData) {
  const productTotals = filteredData.reduce((acc, item) => {
    const product = item.Product;
    const quantity = parseInt(item.RQty);
    const revenue = parseFloat(item.LineTotal);

    if (!acc[product]) {
      acc[product] = {
        quantity: 0,
        revenue: 0,
      };
    }
    acc[product].quantity += quantity;
    acc[product].revenue += revenue;

    return acc;
  }, {});

  const sortedProducts = Object.keys(productTotals)
    .map((product) => ({
      product,
      ...productTotals[product],
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  const labels = sortedProducts.map((item) => item.product);
  const quantityData = sortedProducts.map((item) => item.quantity);
  const revenueData = sortedProducts.map((item) => item.revenue);

  // Update chart
  window.productRevenueChart.data.labels = labels;
  window.productRevenueChart.data.datasets[0].data = quantityData;
  window.productRevenueChart.data.datasets[1].data = revenueData;
  window.productRevenueChart.update();
}

// Fetch data JSON untuk membuat bar chart berdasarkan kategori
fetch("./json/vm_cleaned.json")
  .then((response) => response.json())
  .then((data) => {
    // Hitung total revenue dan quantity sold untuk setiap kategori
    const categoryTotals = data.reduce((acc, item) => {
      const category = item.Category;
      const quantity = parseInt(item.RQty);
      const revenue = parseFloat(item.LineTotal);

      if (!acc[category]) {
        acc[category] = {
          revenue: 0,
          quantity: 0,
        };
      }
      acc[category].revenue += revenue; // Menjumlahkan revenue per kategori
      acc[category].quantity += quantity; // Menjumlahkan quantity sold per kategori
      return acc;
    }, {});

    // Data untuk chart
    const categoryLabels = Object.keys(categoryTotals);
    const revenueData = categoryLabels.map(
      (category) => categoryTotals[category].revenue
    );
    const quantityData = categoryLabels.map(
      (category) => categoryTotals[category].quantity
    );

    // Buat bar chart
    window.productCategoryChart = createStackedHorizontalBarChart(
      categoryLabels,
      revenueData,
      quantityData
    );
  })
  .catch((error) => console.error("Error fetching JSON data:", error));

// Fungsi untuk membuat bar chart horizontal dengan bar bertumpuk
function createStackedHorizontalBarChart(labels, revenueData, quantityData) {
  return new Chart(document.getElementById("categoryChart").getContext("2d"), {
    type: "bar", // Tipe chart
    data: {
      labels: labels, // Kategori sebagai label di sumbu y
      datasets: [
        {
          label: "Quantity Sold",
          data: quantityData,
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Warna background merah
          borderColor: "rgba(255, 99, 132, 1)", // Warna border merah
          borderWidth: 1,
        },
        {
          label: "Total Revenue",
          data: revenueData,
          backgroundColor: "rgba(54, 162, 235, 0.2)", // Warna background biru
          borderColor: "rgba(54, 162, 235, 1)", // Warna border biru
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y", // Mengatur sumbu x dan y untuk membuat bar horizontal
      scales: {
        x: {
          stacked: true, // Aktifkan bar bertumpuk pada sumbu x
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return `${value}`; // Format ticks untuk penjualan dan revenue
            },
          },
        },
        y: {
          stacked: true, // Aktifkan bar bertumpuk pada sumbu y
          beginAtZero: true,
          ticks: {
            autoSkip: false, // Pastikan semua label kategori ditampilkan
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (context.datasetIndex === 0) {
                label += `: ${context.raw}`; // Format tooltip untuk quantity sold
              } else if (context.datasetIndex === 1) {
                label += `: $${context.raw.toFixed(2)}`; // Format tooltip untuk revenue
              }
              return label;
            },
          },
        },
      },
    },
  });
}

// Fungsi untuk mengupdate chart berdasarkan data
function updateCategoryChart(filteredData) {
  const categoryTotals = filteredData.reduce((acc, item) => {
    const category = item.Category;
    const quantity = parseInt(item.RQty);
    const revenue = parseFloat(item.LineTotal);

    if (!acc[category]) {
      acc[category] = {
        revenue: 0,
        quantity: 0,
      };
    }
    acc[category].revenue += revenue; // Menjumlahkan revenue per kategori
    acc[category].quantity += quantity; // Menjumlahkan quantity sold per kategori
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoryTotals);
  const revenueData = categoryLabels.map(
    (category) => categoryTotals[category].revenue
  );
  const quantityData = categoryLabels.map(
    (category) => categoryTotals[category].quantity
  );

  // Update chart
  window.productCategoryChart.data.labels = categoryLabels;
  window.productCategoryChart.data.datasets[0].data = quantityData;
  window.productCategoryChart.data.datasets[1].data = revenueData;
  window.productCategoryChart.update();
}

// Cleaned-table
$(document).ready(function () {
  fetch("./json/vm_cleaned.json")
    .then((response) => response.json())
    .then((data) => {
      // Menghitung total produk terjual dan total revenue per produk
      const productTotals = data.reduce((acc, item) => {
        const productKey = `${item.Location}-${item.Category}-${item.Product}`; // Membuat kunci unik untuk setiap produk
        const quantity = parseInt(item.RQty);
        const revenue = parseFloat(item.LineTotal);

        if (!acc[productKey]) {
          acc[productKey] = {
            Location: item.Location,
            Category: item.Category,
            Product: item.Product,
            QuantitySold: quantity,
            Revenue: revenue,
          };
        } else {
          acc[productKey].QuantitySold += quantity;
          acc[productKey].Revenue += revenue;
        }

        return acc;
      }, {});

      // Mengonversi hasil akumulasi ke dalam array untuk digunakan oleh DataTables
      const productTotalsArray = Object.values(productTotals);

      // Inisialisasi DataTable
      $("#example-table").DataTable({
        data: productTotalsArray,
        columns: [
          {
            data: "Location",
          },
          {
            data: "Category",
          },
          {
            data: "Product",
          },
          {
            data: "QuantitySold",
          },
          {
            data: "Revenue",
          },
        ],
        lengthChange: false,
        order: [[3, "desc"]],
        scrollX: true,
        scrollY: true,
      });
    });
});
