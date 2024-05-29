// Fetch data dari file JSON
fetch('./json/vm_cleaned.json') // Ubah 'data.json' sesuai dengan lokasi file JSON Anda
    .then(response => response.json())
    .then(data => {
        // Buat Tabulator setelah data berhasil diambil
        var table = new Tabulator("#Cleaned-table", {
            height:500,
            data:data, // Gunakan data dari file JSON
            layout:"fitColumns",
            pagination:"local",       //paginate the data
            paginationSize:100,         //allow 7 rows per page of data
            paginationCounter:"rows", //display count of paginated rows in footer
            columns:[
                {title:"Device ID", field:"Device_ID"},
                {title:"Location", field:"Location"},
                {title:"Product", field:"Product"},
                {title:"Category", field:"Category"},
                {title:"Transaction", field:"Transaction"},
                {title:"Transaction Date", field:"TransDate"},
                {title:"Retail Price", field:"RPrice"},
                {title:"Retail Quantity", field:"RQty"},
                {title:"Line Total", field:"LineTotal"},
                {title:"Transaction Total", field:"TransTotal"},
            ],
        });

        // Trigger alert saat baris diklik
        table.on("rowClick", function(e, row){ 
            alert("Transaction ID " + row.getData().Transaction + " Clicked!!!!");
        });
    })
    .catch(error => console.error('Error fetching JSON data:', error));
