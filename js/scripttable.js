//   Device_ID
//   Location
//   Product
//   Category
//   Transaction
//   TransDate
//   RPrice
//   RQty
//   LineTotal
//   TransTotal
// sidebar func
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

// Raw-table
$(document).ready(function() {
    fetch("./json/vending_machine_sales.json")
        .then(response => response.json())
        .then(data => {
            $('#Raw-table').DataTable({
                data: data,
                columns: [
                    { data: 'Status' },
                    { data: 'Device ID' },
                    { data: 'Location' },
                    { data: 'Machine' },                    
                    { data: 'Product' },
                    { data: 'Category' },
                    { data: 'Transaction' },
                    { data: 'TransDate' },
                    { data: 'Type' },
                    { data: 'RCoil' },                    
                    { data: 'RPrice' },
                    { data: 'RQty' },
                    { data: 'MCoil' },
                    { data: 'MPrice' },                    
                    { data: 'MQty' },
                    { data: 'LineTotal' },                    
                    { data: 'TransTotal' },
                    { data: 'Prcd Date' },
                ],
                scrollY: 500
            });
        });
});

// Cleaned-table
$(document).ready(function() {
    fetch("./json/vm_cleaned.json")
        .then(response => response.json())
        .then(data => {
            $('#Cleaned-table').DataTable({
                data: data,
                columns: [
                    { data: 'Device_ID' },
                    { data: 'Location' },
                    { data: 'Product' },
                    { data: 'Category' },
                    { data: 'Transaction' },
                    { data: 'TransDate' },
                    { data: 'RPrice' },
                    { data: 'RQty' },
                    { data: 'LineTotal' },
                    { data: 'TransTotal' },
                ],
                scrollY: 500
            });
        });
});

