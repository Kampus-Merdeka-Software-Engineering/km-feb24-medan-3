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

