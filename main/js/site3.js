//// VARS & CONSTS ////
const userRole = getRoleFromToken();
const refreshFreq = 10 * 60 * 1000; // 1 MINUTE
var startDate = moment().format('DD-MMM-YY');
var endDate = moment().format('DD-MMM-YY');
const ipDateDropdown = document.getElementById('ip-dateRangeDropdown-s3');

const clients = ['مصنع اجا', 'مصنع سندوب', '', 'مصنع بلقاس', 'مصنع السنبلاوين', 'مصنع المنزلة'];
const otherClient = 'اخري';

var dataTableInitialized = false;
var dataTableJSONData;

const headerMapping = {
    ticketId: "رقم التذكرة",
    itemType: "نوع الشحنة",
    clientType: "العميل",
    driverName: "اسم السائق",
    vehicleNumber: "رقم السيارة",
    firstWeight: "الوزن الاول (كجم)",
    secondWeight: "الوزن الثاني (كجم)",
    netWeight: "صافي الوزن (كجم)",
    carTwoDate: "التاريخ",
    carOneTime: "وقت الوزن الأول",
    carTwoTime: "وقت الوزن الثانى",
    enterMethod: ""
};

function exportToExcel() {
    const transformedData = dataTableJSONData.map(item => {
        const transformedItem = {};
        for (const key in item) {
            if (headerMapping.hasOwnProperty(key)) {
                transformedItem[headerMapping[key]] = item[key];
            }
        }
        return transformedItem;
    });

// Reverse the order of columns in the transformed data
    const reversedData = transformedData.map(item => {
        const reversedItem = {};
        const keys = Object.keys(item).reverse();
        for (const key of keys) {
            reversedItem[key] = item[key];
        }
        return reversedItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(reversedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

    const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "بلقاس " + startDate + "_" + endDate + '.xlsx';
    a.click();
    URL.revokeObjectURL(url);
}

////  Datatable  ////

function updateDatatable(startDate, endDate) {

    const tbody = document.querySelector('#site3_table tbody');


    fetch(`https://isdom.online/dash_board/tickets/all?siteNo=3&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {

            dataTableJSONData = data;

            $('#site3_table').DataTable().destroy();
            tbody.innerHTML = '';

            data.forEach(rowData => {
                // console.log(rowData);

                const row = document.createElement('tr');

                const cellValue = rowData['enterMethod'];
                if (cellValue === 'dashboard') {
                    row.style.color = 'red';
                }

                Object.entries(rowData).forEach(([key, cellData]) => {

                    // to hide these columns
                    if (key === "enterMethod" || key === "clientName" || key === "villageName" || key === "itemName")
                        return;

                    // if (key === "carTwoDate")
                    //     cellData = moment(rowData[key], 'DD-MMM-YY').format('DD MMMM YYYY');

                    const cell = document.createElement('td');
                    cell.textContent = cellData;

                    if (userRole === "Admin")
                        if (key === 'carTwoDate' || key === 'carTwoTime' || key === 'secondWeight') {
                            cell.setAttribute('contenteditable', 'true');
                            cell.addEventListener('keyup', function () {
                                rowData[key] = cell.textContent;
                                const newNetWeight = Math.abs(rowData.secondWeight - rowData.firstWeight);

                                const currentTime = moment();
                                const formattedTime = currentTime.format('HH:mm:ss A');
                                const formattedDate = currentTime.format('DD-MMM-YY');

                                var updatedRow = {
                                    carTwoDate: formattedDate,
                                    netWeight: newNetWeight,
                                    carTwoTime: formattedTime,
                                    secondWeight: rowData.secondWeight
                                }

                                fetch(`https://isdom.online/dash_board/tickets/${rowData.ticketId}/3`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(updatedRow)
                                })

                            });
                        }

                    row.appendChild(cell);
                });

                tbody.appendChild(row);

            });

            // initialize DataTable


            $('#site3_table').dataTable({
                "dom": '<"top"lf>rt<"bottom"ip><"clear">',
                "paging": true,
                "searching": true,
                "language": {
                    "sSearch": "بحث:",
                    "sLengthMenu": "أظهر _MENU_   تذاكر",
                    "sInfo": "إظهار _START_ إلى _END_ من أصل _TOTAL_ تذكرة",
                    "sInfoEmpty": "يعرض 0 إلى 0 من أصل 0 سجل",
                    "sInfoFiltered": "(منتقاة من مجموع _MAX_ تذكرة)",
                    "oPaginate": {
                        "sFirst": "الأول",
                        "sPrevious": "السابق",
                        "sNext": "التالي",
                        "sLast": "الأخير"
                    }
                },
                "initComplete": function () {
                    // Create a new row for the search boxes
                    if (!dataTableInitialized) {
                        dataTableInitialized = true;

                        var searchRow = $('<tr class="search-row"></tr>');

                        // Add search boxes for each column
                        this.api().columns('.searchable-column').every(function () {
                            var column = this;

                            // Create a new input element for the search box
                            var searchBox = $(`<input type="text" style="width: 80px" class="form-control form-control-sm mb-2 mx-2 d-inline-block" style="width: auto" />`);

                            // Add an input event handler to trigger a search when the user enters text
                            searchBox.on('keyup', function () {
                                // searchBox.on('input', function () {
                                var searchTerm = this.value;
                                if (searchTerm === '') {
                                    column.search('').draw();
                                } else {
                                    column.search('^' + searchTerm + '$', true, false).draw();
                                }
                            });

                            // Create a new cell in the search row and append the search box to it
                            var searchCell = $('<th></th>').append(searchBox);
                            searchRow.append(searchCell);
                        });

                        // Insert the search row before the header row
                        $('.dataTable thead').prepend(searchRow);
                    }
                }
            });

            // document.getElementById("datatableDatePickerGroup").style.display = "block";
            document.getElementById("datatableExportGroup").style.display = "block";
        })
}

// function populateClientTypes() {
//
//     const defaultOption = document.createElement('option');
//     defaultOption.value = '';
//     defaultOption.textContent = 'كل المرافق';
//     defaultOption.selected = true;
//     ipClientDropdown.appendChild(defaultOption.cloneNode(true));
//
//     data = ['مصنع اجا', 'مصنع سندوب', 'مصنع بلقاس', 'مصنع السنبلاوين', 'مصنع المنزلة']
//
//     data.forEach(option => {
//         const optionElement = document.createElement('option');
//         optionElement.value = option;
//         optionElement.textContent = option;
//         ipClientDropdown.appendChild(optionElement.cloneNode(true));
//     });
// }


////  Input graph  ////
const ipChartOptions = {
    labels: [],
    datasets: [
        {
            label: 'اجمالى المدخلات',
            backgroundColor: '#ef601c',
            borderColor: '#ef601c',
            data: []
        },
        {
            label: 'اجا',
            backgroundColor: '#d9938c',
            borderColor: '#d9938c',
            data: []
        },
        {
            label: 'سندوب',
            backgroundColor: '#885A5A',
            borderColor: '#885A5A',
            data: []
        },
        {
            label: 'بلقاس',
            backgroundColor: '#6096BA',
            borderColor: '#6096BA',
            data: []
        },
        {
            label: 'السنبلاوين',
            backgroundColor: '#567a44',
            borderColor: '#567a44',
            data: []
        },
        {
            label: 'المنزلة',
            backgroundColor: '#DC136C',
            borderColor: '#DC136C',
            data: []
        },
        {
            label: 'اخري',
            backgroundColor: '#394565',
            borderColor: '#394565',
            data: []
        }
    ]
};

const s3_in_grph = new Chart(document.getElementById('s3-in-grph'), {
    type: 'line',
    data: ipChartOptions,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }
});


function updateInputGraph_s3() {
    const selectedDate = ipDateDropdown.value;
    // const selectedClient = ipClientDropdown.value;

    let startDatex, endDatex;

    if (selectedDate === 'last7days') {
        startDatex = moment().subtract(7, 'days').format('DD-MMM-YY');
        endDatex = moment().format('DD-MMM-YY');
    } else if (selectedDate === 'last14days') {
        startDatex = moment().subtract(14, 'days').format('DD-MMM-YY');
        endDatex = moment().format('DD-MMM-YY');
    } else if (selectedDate === 'lastMonth') {
        startDatex = moment().subtract(1, 'months').startOf('month').format('DD-MMM-YY');
        endDatex = moment().subtract(1, 'months').endOf('month').format('DD-MMM-YY');
    }

    const totalURL = `https://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&startDate=${startDatex}&endDate=${endDatex}`;
    const URL1 = `https://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${clients[0]}&startDate=${startDatex}&endDate=${endDatex}`;
    const URL2 = `https://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${clients[1]}&startDate=${startDatex}&endDate=${endDatex}`;
    const URL4 = `https://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${clients[3]}&startDate=${startDatex}&endDate=${endDatex}`;
    const URL5 = `https://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${clients[4]}&startDate=${startDatex}&endDate=${endDatex}`;
    const URL6 = `https://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${clients[5]}&startDate=${startDatex}&endDate=${endDatex}`;
    const othersURL = `https://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${otherClient}&startDate=${startDatex}&endDate=${endDatex}`;

    Promise.all([
        fetch(totalURL).then(responseTotal => responseTotal.json()).catch(() => 0),
        fetch(URL1).then(response1 => response1.json()).catch(() => 0),
        fetch(URL2).then(response2 => response2.json()).catch(() => 0),
        fetch(URL4).then(response4 => response4.json()).catch(() => 0),
        fetch(URL5).then(response5 => response5.json()).catch(() => 0),
        fetch(URL6).then(response6 => response6.json()).catch(() => 0),
        fetch(othersURL).then(responseOthers => responseOthers.json()).catch(() => 0)
    ]).then(([dataTotal, data1, data2, data4, data5, data6, dataOthers]) => {

        let categories = Object.keys(dataTotal);
        const valuesTotal = Object.values(dataTotal);
        const values1 = Object.values(data1);
        const values2 = Object.values(data2);
        const values4 = Object.values(data4);
        const values5 = Object.values(data5);
        const values6 = Object.values(data6);
        const valuesOthers = Object.values(dataOthers);

        if (selectedDate === 'lastMonth') {
            categories = Object.keys(data1).map(date => date.split('-')[0]);
        }

        s3_in_grph.data.datasets[0].data = valuesTotal || 0;
        s3_in_grph.data.datasets[1].data = values1 || 0;
        s3_in_grph.data.datasets[2].data = values2 || 0;
        s3_in_grph.data.datasets[3].data = values4 || 0;
        s3_in_grph.data.datasets[4].data = values5 || 0;
        s3_in_grph.data.datasets[5].data = values6 || 0;
        s3_in_grph.data.datasets[6].data = valuesOthers || 0;
        s3_in_grph.data.labels = categories || 0;

        s3_in_grph.update();

    })
        .catch(error => {
            console.error('Error:', error);
        });
}

////  INPUT DONUT CHART  ////

// const initialIPChartData = {
//     labels: ['مصنع اجا', 'مصنع سندوب', 'مصنع بلقاس', 'مصنع السنبلاوين', 'مصنع المنزلة', 'اخري'],
//     datasets: [{
//         data: [0, 0, 0, 0, 0, 0],
//         backgroundColor: ['#d9938c', '#885A5A', '#6096BA', '#567a44', '#DC136C', '#394565']
//     }]
// };
// const s3_ip_chart = new Chart(document.getElementById('s3-ip-chart'), {
//     type: 'doughnut', data: initialIPChartData
// });


const initialIPChartData = {
    bindto: "#s3-ip-chart",
    size: {height: 350},
    legend: {},
    data: {
        columns: [],
        type: "pie",
        colors: {
            'مصنع اجا': '#d9938c',
            'مصنع سندوب': '#885A5A',
            'مصنع بلقاس': '#6096BA',
            'مصنع السنبلاوين': '#567a44',
            'مصنع المنزلة': '#DC136C',
            'اخري': '#394565'
        }
    },
    tooltip: {
        format: {
            value: function (value, ratio, id, index) {
                return value;
            }
        }
    }
};
const s3_ip_chart = c3.generate(initialIPChartData);

function updateIPChartData(startDate, endDate) {
    // const urlIP1 = `https://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    // const urlIP2 = `https://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات لا تصلح للمعالجة

    const URL1 = `https://isdom.online/dash_board/tickets/itemName/weight?siteNo=3&clientType=${clients[0]}&startDate=${startDate}&endDate=${endDate}`;
    const URL2 = `https://isdom.online/dash_board/tickets/itemName/weight?siteNo=3&clientType=${clients[1]}&startDate=${startDate}&endDate=${endDate}`;
    const URL4 = `https://isdom.online/dash_board/tickets/itemName/weight?siteNo=3&clientType=${clients[3]}&startDate=${startDate}&endDate=${endDate}`;
    const URL5 = `https://isdom.online/dash_board/tickets/itemName/weight?siteNo=3&clientType=${clients[4]}&startDate=${startDate}&endDate=${endDate}`;
    const URL6 = `https://isdom.online/dash_board/tickets/itemName/weight?siteNo=3&clientType=${clients[5]}&startDate=${startDate}&endDate=${endDate}`;
    const othersURL = `https://isdom.online/dash_board/tickets/itemName/weight?siteNo=3&clientType=${otherClient}&startDate=${startDate}&endDate=${endDate}`;

    Promise.all([
        fetch(URL1).then(response => response.json()).catch(() => 0),
        fetch(URL2).then(response => response.json()).catch(() => 0),
        fetch(URL4).then(response => response.json()).catch(() => 0),
        fetch(URL5).then(response => response.json()).catch(() => 0),
        fetch(URL6).then(response => response.json()).catch(() => 0),
        fetch(othersURL).then(response => response.json()).catch(() => 0)
    ])
        .then(([dataset1Data, dataset2Data, dataset4Data, dataset5Data, dataset6Data, datasetOthersData]) => {
            const dataset1Value = dataset1Data;
            const dataset2Value = dataset2Data;
            const dataset4Value = dataset4Data;
            const dataset5Value = dataset5Data;
            const dataset6Value = dataset6Data;
            const datasetOthersValue = datasetOthersData;

            // Update the dataset values in the chart
            // s3_ip_chart.data.datasets[0].data[0] = dataset1Value || 0;
            // s3_ip_chart.data.datasets[0].data[1] = dataset2Value || 0;
            // s3_ip_chart.data.datasets[0].data[2] = dataset4Value || 0;
            // s3_ip_chart.data.datasets[0].data[3] = dataset5Value || 0;
            // s3_ip_chart.data.datasets[0].data[4] = dataset6Value || 0;
            // s3_ip_chart.data.datasets[0].data[5] = datasetOthersValue || 0;
            //
            // s3_ip_chart.update();

            s3_ip_chart.load({
                columns: [
                    ['مصنع اجا', dataset1Value],
                    ['مصنع سندوب', dataset2Value],
                    ['مصنع بلقاس', dataset4Value],
                    ['مصنع السنبلاوين', dataset5Value],
                    ['مصنع المنزلة', dataset6Value],
                    ['اخري', datasetOthersValue]
                ]
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// DATA BOXES ////

function updateIPBox(startDate, endDate) {
    const url = `https://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=3&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data; // Assuming the API response contains the desired value

            document.getElementById("s3-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

$(document).ready(function () {

    initDatatableDateRange();

    updateInputGraph_s3(false);

    initDateRange();

    setInterval(function () {
        updateAllByTime();
    }, refreshFreq);

    // Initial data update
    updateIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateIPChartData(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateDatatable(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
});


function initDateRange() {
    $('#dateRangePicker').daterangepicker({
        opens: 'left',
        startDate: moment(),
        endDate: moment(),
        locale: {
            format: 'DD-MM-YYYY'
        }
    }, function (start, end) {
        // startDate = start.format('DD-MMM-YY');
        // endDate = end.format('DD-MMM-YY');
        updateAllByTime();
    });
}

function initDatatableDateRange() {
    $('#datatableDateRangePicker').daterangepicker({
        opens: 'left',
        startDate: moment(),
        endDate: moment(),
        locale: {
            format: 'DD-MM-YYYY'
        }
    }, function () {
        var start = moment($('#datatableDateRangePicker').data('daterangepicker').startDate);
        var end = moment($('#datatableDateRangePicker').data('daterangepicker').endDate);
        var startDate = start.format('DD-MMM-YY');
        var endDate = end.format('DD-MMM-YY');
        updateDatatable(startDate, endDate);
    });
}

function updateAllByTime() {
    var start = moment($('#dateRangePicker').data('daterangepicker').startDate);
    var end = moment($('#dateRangePicker').data('daterangepicker').endDate);
    var startDate = start.format('DD-MMM-YY');
    var endDate = end.format('DD-MMM-YY');

    // Call the update functions with the start and end dates;
    updateIPBox(startDate, endDate);
    updateIPChartData(startDate, endDate);
}
