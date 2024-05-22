fetch('./json/vm_cleaned.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((json) => {
        const location = json.map((item) => item.Location);
        const element = document.getElementById('dataLocation');
        element.innerHTML = new Set(location).size;

        const totalRevenue = json.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
        const elementRevenue = document.getElementById('totalRevenue');
        elementRevenue.innerHTML = totalRevenue.toFixed(2);
    })
    .catch((error) => console.error('Error fetching JSON data:', error));

const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
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

// mengambil data json dengan menggunakan fetch
fetch('./json/vm_cleaned.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    // mengambil data lokasi dan lineTotal
    .then((data) => {
        const totals = data.reduce((acc, item) => {
            const location = item.Location;
            const lineTotal = parseFloat(item.LineTotal);

            if (!acc[location]) {
                acc[location] = 0;
            }
            acc[location] += lineTotal;
            return acc;
        }, {});

        const labels = Object.keys(totals);
        const chartData = Object.values(totals);

        createDoughnutChart(labels, chartData, 'doughnut');
    })
    .catch((error) => console.error('Error fetching JSON data:', error));
// function chart.js
function createDoughnutChart(labels, data, type) {
    new Chart(document.getElementById('pieChart').getContext('2d'), {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Revenue per Location',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
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
                    position: 'right',
                }
            }
        }
    });
}

fetch('./json/vm_cleaned.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        const monthlyTotals = data.reduce((acc, item) => {
            const date = new Date(item.TransDate);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const monthYear = `${year}-${month < 10 ? '0' + month : month}`;

            const lineTotal = parseFloat(item.LineTotal);

            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }
            acc[monthYear] += lineTotal;
            return acc;
        }, {});

        const labels = Object.keys(monthlyTotals).sort((a, b) => new Date(a) - new Date(b));
        const chartData = labels.map((label) => monthlyTotals[label]);

        createLineChart(labels, chartData, 'line');
    })
    .catch((error) => console.error('Error fetching JSON data:', error));

function createLineChart(labels, data, type) {
    new Chart(document.getElementById('lineChart').getContext('2d'), {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Revenue per Month',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}