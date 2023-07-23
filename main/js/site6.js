//// VARS & CONSTS ////
const userRole = getRoleFromToken();
const refreshFreq = 10 * 60 * 1000; // 1 MINUTE
var startDate = moment().format('DD-MMM-YY');
var endDate = moment().format('DD-MMM-YY');
const ipCenterDropdown = document.getElementById('ip-centerDropdown-s6');
const opCenterDropdown = document.getElementById('op-centerDropdown-s6');
const ipVillageDropdown = document.getElementById('ip-villageDropdown-s6');
const opVillageDropdown = document.getElementById('op-villageDropdown-s6');
const opDateDropdown = document.getElementById('op-dateRangeDropdown-s6');
const ipDateDropdown = document.getElementById('ip-dateRangeDropdown-s6');

var dataTableInitialized = false;

////  Datatable  ////

function updateDatatable(selectedDate) {

    const tbody = document.querySelector('#site6_table tbody');


    fetch(`http://isdom.online/dash_board/tickets/all?siteNo=6&selectedDate=${selectedDate}`)
        .then(response => response.json())
        .then(data => {

            $('#site6_table').DataTable().destroy();
            tbody.innerHTML = '';

            data.forEach(rowData => {
                console.log(rowData);

                const row = document.createElement('tr');

                const cellValue = rowData['enterMethod'];
                if (cellValue === 'dashboard') {
                    row.style.color = 'red';
                }

                Object.entries(rowData).forEach(([key, cellData]) => {

                    // to hide these columns
                    if (key === "enterMethod")
                        return;

                    // if (key === "carTwoDate")
                    //     cellData = moment(rowData[key], 'DD-MMM-YY').format('DD MMMM YYYY');

                    const cell = document.createElement('td');
                    cell.textContent = cellData;

                    if (userRole === "Admin")
                        if (key === 'carTwoDate' || key === 'carTwoTime' || key === 'secondWeight') {
                            cell.setAttribute('contenteditable', 'true');
                            cell.addEventListener('blur', function () {
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

                                fetch(`http://isdom.online/dash_board/tickets/${rowData.ticketId}/6`,{
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


            $('#site6_table').DataTable({
                "dom": '<"top"lf>rt<"bottom"ip><"clear">',
                "paging": true,
                "searching": true,
                "initComplete": function () {
                    // Create a new row for the search boxes
                    if (!dataTableInitialized) {
                        dataTableInitialized = true;

                        var searchRow = $('<tr class="search-row"></tr>');

                        // Add search boxes for each column
                        this.api().columns('.searchable-column').every(function () {
                            var column = this;

                            // Create a new input element for the search box
                            var searchBox = $(`<input type="text" placeholder="بحث ${column.header().textContent}" class="form-control form-control-sm mb-2 mx-2 d-inline-block" style="width: auto" />`);

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

            document.getElementById("datatableDatePicker").style.display = "block";

        })
}


//Get list of centers
function getCenters() {
    fetch('http://isdom.online/dash_board/centers')
        .then(response => response.json())
        .then(data => {

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'كل المراكز';
            defaultOption.selected = true;
            ipCenterDropdown.appendChild(defaultOption.cloneNode(true));
            opCenterDropdown.appendChild(defaultOption);

            data.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.centerId;
                optionElement.textContent = option.centerName;
                ipCenterDropdown.appendChild(optionElement.cloneNode(true));
                opCenterDropdown.appendChild(optionElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// Get names of outputs
// function getOpNames() {
//     fetch('http://isdom.online/dash_board/items/items/مخرجات/item-names')
//         .then(response => response.json())
//         .then(data => {
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }


////  Input graph  ////

function updateIpVillageDropdown(centerId) {
    if (centerId !== "") {
        fetch(`http://isdom.online/dash_board/villages?centerId=${centerId}`)
            .then(response => response.json())
            .then(data => {

                document.getElementById("ip-villageDropdown-s6").style.display = "block";

                ipVillageDropdown.innerHTML = '';

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'كل الوحدات المحلية';
                defaultOption.selected = true;
                ipVillageDropdown.appendChild(defaultOption);

                data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.villageId;
                    optionElement.textContent = option.villageName;

                    ipVillageDropdown.appendChild(optionElement);
                });
            })
    }
}

const ipChartOptions = {
    bindto: "#s6-in-grph",
    size: {height: 350},
    legend: {},
    axis: {
        x: {
            type: 'category',
            categories: [],
            tick: {
                multiline: false,
                show: false
            }
        }
    },
    data: {
        columns: [],
        type: "line",
        colors: {
            'مخلفات تصلح للمعالجة': "#444e86",
            'مخلفات لا تصلح للمعالجة': "#dd5182"
        }
    },
    grid: {y: {show: true}}
};
const s6_in_grph = c3.generate(ipChartOptions);

function updateInputGraph_s6(isVillage) {
    const selectedDate = ipDateDropdown.value;
    const selectedCenter = ipCenterDropdown.value;
    var selectedVillage = ipVillageDropdown.value;

    if (isVillage === false) {
        updateIpVillageDropdown(selectedCenter);
        selectedVillage = "";
    }

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
    // else if (selectedDate === 'lastYear') {
    //     startDatex = moment().subtract(1, 'years').format('DD-MMM-YY');
    //     endDatex = moment().format('DD-MMM-YY');
    // }

    const url1 = `http://isdom.online/dash_board/tickets/itemName-site/weight-date-list?itemName=مخلفات  تصلح للمعالجة&siteNo=6&startDate=${startDatex}&endDate=${endDatex}&centerId=${selectedCenter}&villageId=${selectedVillage}`; //مخلفات تصلح للمعالجة
    const url2 = `http://isdom.online/dash_board/tickets/itemName-site/weight-date-list?itemName=مخلفات لا تصلح للمعالجة&siteNo=6&startDate=${startDatex}&endDate=${endDatex}&centerId=${selectedCenter}&villageId=${selectedVillage}`; //مخلفات لا تصلح للمعالجة

    Promise.all([
        fetch(url1).then(response1 => response1.json()).catch(() => 0),
        fetch(url2).then(response2 => response2.json()).catch(() => 0)
    ]).then(([data1, data2]) => {
        let categories = Object.keys(data1);
        const values1 = Object.values(data1);
        const values2 = Object.values(data2);

        if (selectedDate === 'lastMonth') {
            categories = Object.keys(data1).map(date => date.split('-')[0]);
        }

        s6_in_grph.load({
            columns: [
                ['مخلفات تصلح للمعالجة', ...values1],
                ['مخلفات لا تصلح للمعالجة', ...values2]
            ],
            categories: categories
        });

    })
        .catch(error => {
            console.error('Error:', error);
        });
}


////  Output graph  ////

function updateOpVillageDropdown(centerId) {
    if (centerId !== "") {
        fetch(`http://isdom.online/dash_board/villages?centerId=${centerId}`)
            .then(response => response.json())
            .then(data => {

                document.getElementById("op-villageDropdown-s6").style.display = "block";

                opVillageDropdown.innerHTML = '';

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'كل الوحدات المحلية';
                defaultOption.selected = true;
                opVillageDropdown.appendChild(defaultOption);


                data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.villageId;
                    optionElement.textContent = option.villageName;

                    opVillageDropdown.appendChild(optionElement);
                });
            })
    }
}

const opChartOptions = {
    bindto: "#s6-out-grph",
    size: {height: 350},
    legend: {},
    axis: {
        x: {
            type: 'category',
            categories: [],
            tick: {
                multiline: false
            }
        }
    },
    data: {
        columns: [],
        type: "line",
        colors: {'اسمدة عضوية': "#ffa600", 'وقود بديل': "#ef5675", 'مفروزات': "#7a5195", 'مرفوضات': "#003f5c"}
    },
    grid: {y: {show: true}}
};
const s6_out_grph = c3.generate(opChartOptions);

function updateOutputGraph_s6(isVillage) {
    const selectedDate = opDateDropdown.value;
    const selectedCenter = opCenterDropdown.value;
    var selectedVillage = opVillageDropdown.value;

    if (isVillage === false) {
        updateOpVillageDropdown(selectedCenter);
        selectedVillage = "";
    }

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
    // else if (selectedDate === 'lastYear') {
    //     startDatex = moment().subtract(1, 'years').format('DD-MMM-YY');
    //     endDatex = moment().format('DD-MMM-YY');
    // }

    const url1 = `http://isdom.online/dash_board/tickets/itemName-site/weight-date-list?itemName=وقود بديل&siteNo=6&startDate=${startDatex}&endDate=${endDatex}&centerId=${selectedCenter}&villageId=${selectedVillage}`; // وقود بديل
    const url2 = `http://isdom.online/dash_board/tickets/itemName-site/weight-date-list?itemName=اسمدة عضوية&siteNo=6&startDate=${startDatex}&endDate=${endDatex}&centerId=${selectedCenter}&villageId=${selectedVillage}`; // اسمدة عضوية
    const url3 = `http://isdom.online/dash_board/tickets/itemName-site/weight-date-list?itemName=مرفوضات&siteNo=6&startDate=${startDatex}&endDate=${endDatex}&centerId=${selectedCenter}&villageId=${selectedVillage}`; //مرفوضات
    const url4 = `http://isdom.online/dash_board/tickets/itemName-site/weight-date-list?itemName=مفروزات&siteNo=6&startDate=${startDatex}&endDate=${endDatex}&centerId=${selectedCenter}&villageId=${selectedVillage}`; //مفروزات

    Promise.all([
        fetch(url1).then(response1 => response1.json().catch(() => 0)),
        fetch(url2).then(response2 => response2.json().catch(() => 0)),
        fetch(url3).then(response2 => response2.json().catch(() => 0)),
        fetch(url4).then(response2 => response2.json().catch(() => 0))
    ]).then(([data1, data2, data3, data4]) => {
        let categories = Object.keys(data1);
        const values1 = Object.values(data1);
        const values2 = Object.values(data2);
        const values3 = Object.values(data3);
        const values4 = Object.values(data4);

        if (selectedDate === 'lastMonth') {
            categories = Object.keys(data1).map(date => date.split('-')[0]);
        }

        s6_out_grph.load({
            columns: [
                ['وقود بديل', ...values1],
                ['اسمدة عضوية', ...values2],
                ['مرفوضات', ...values3],
                ['مفروزات', ...values4]
            ],
            categories: categories
        });

    })
        .catch(error => {
            console.error('Error:', error);
        });
}


////  INPUT DONUT CHART  ////

const initialIPChartData = {
    labels: ['مخلفات تصلح للمعالجة', 'مخلفات لا تصلح للمعالجة'], datasets: [{
        data: [0, 0], backgroundColor: ['#444e86', '#dd5182']
    }]
};
const s6_ip_chart = new Chart(document.getElementById('s6-ip-chart'), {
    type: 'doughnut', data: initialIPChartData
});

function updateIPChartData(startDate, endDate) {
    const urlIP1 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const urlIP2 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مخلفات لا تصلح للمعالجة
    Promise.all([
        fetch(urlIP1).then(response => response.json()).catch(() => 0),
        fetch(urlIP2).then(response => response.json()).catch(() => 0)
    ])
        .then(([dataset1Data, dataset2Data]) => {
            const dataset1Value = dataset1Data;
            const dataset2Value = dataset2Data;

            // Update the dataset values in the chart
            s6_ip_chart.data.datasets[0].data[0] = dataset1Value || 0;
            s6_ip_chart.data.datasets[0].data[1] = dataset2Value || 0;

            s6_ip_chart.update();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

////  OUTPUT DONUT CHART  ////

const initialOPChartData = {
    labels: ['اسمدة عضوية', 'وقود بديل', 'مرفوضات', 'مفروزات'],
    datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#ffa600', '#ef5675', '#003f5c', '#7a5195']
    }]
};
const s6_op_chart = new Chart(document.getElementById('s6-op-chart'), {
    type: 'doughnut',
    data: initialOPChartData
});

function updateOPChartData(startDate, endDate) {
    const urlOP1 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=اسمدة عضوية&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // اسمدة عضوية
    const urlOP2 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=وقود بديل&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const urlOP3 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مرفوضات&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مرفوضات
    const urlOP4 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مفروزات&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مفروزات

    Promise.all([
        fetch(urlOP1).then(response => response.json()).catch(() => 0),
        fetch(urlOP2).then(response => response.json()).catch(() => 0),
        fetch(urlOP3).then(response => response.json()).catch(() => 0),
        fetch(urlOP4).then(response => response.json()).catch(() => 0)
    ])
        .then(([category1Data, category2Data, category3Data, category4Data]) => {
            // Update the dataset values in the chart
            s6_op_chart.data.datasets[0].data[0] = category1Data || 0;
            s6_op_chart.data.datasets[0].data[1] = category2Data || 0;
            s6_op_chart.data.datasets[0].data[2] = category3Data || 0;
            s6_op_chart.data.datasets[0].data[3] = category4Data || 0;

            // Update the chart
            s6_op_chart.update();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


//// DATA BOXES ////

function updateRejBox(startDate, endDate) {
    const urlAcc = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const urlRej = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مرفوضات&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مرفوضات

    Promise.all([
        fetch(urlAcc).then(response => response.json()).catch(() => 0),
        fetch(urlRej).then(response => response.json()).catch(() => 0),
    ])
        .then(([accData, rejData]) => {
            const percentage = (rejData / accData) * 100;
            if (isNaN(percentage))
                document.getElementById("s6-accepted").textContent = 0 + "%"
            else {
                document.getElementById("s6-rejected-per").textContent = percentage.toFixed(1) + "%"
                document.getElementById("s6-accepted").textContent = "من " + accData + " طن";

                const progressBar = document.getElementById("s6-rej-progress");
                updateProgressBar(progressBar, percentage);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function updateProgressBar(progressBar, percentage) {
        progressBar.style.width = `${percentage}%`; // Set the width of the progress bar
        progressBar.setAttribute('aria-valuenow', percentage); // Set the current value of the progress bar
    }
}

function updateAccBox(startDate, endDate) {
    const accUrl = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const totInUrl = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=6&startDate=${startDate}&endDate=${endDate}`;

    Promise.all([
        fetch(accUrl).then(response => response.json()).catch(() => 0),
        fetch(totInUrl).then(response => response.json()).catch(() => 0),
    ])
        .then(([accData, totInData]) => {
            const percentage = (accData / totInData) * 100;
            if (isNaN(percentage))
                document.getElementById("s6-accepted-per").textContent = 0 + "%"
            else {
                document.getElementById("s6-accepted-per").textContent = percentage.toFixed(1) + "%"

                const progressBar = document.getElementById("s6-acc-progress");
                updateProgressBar(progressBar, percentage);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function updateProgressBar(progressBar, percentage) {
        progressBar.style.width = `${percentage}%`; // Set the width of the progress bar
        progressBar.setAttribute('aria-valuenow', percentage); // Set the current value of the progress bar
    }
}

function updateOPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مخرجات&siteNo=6&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data; // Assuming the API response contains the desired value

            document.getElementById("s6-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateIPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=6&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data; // Assuming the API response contains the desired value

            document.getElementById("s6-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateMassBox(startDate, endDate) {
    const totInURL = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=6&startDate=${startDate}&endDate=${endDate}`;
    const totOutURL = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مخرجات&siteNo=6&startDate=${startDate}&endDate=${endDate}`;
    const accURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const rejURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=6&startDate=${startDate}&endDate=${endDate}`; // مخلفات لا تصلح للمعالجة

    Promise.all([
        fetch(totInURL).then(response1 => response1.json()).catch(() => 0),
        fetch(totOutURL).then(response1 => response1.json()).catch(() => 0),
        fetch(accURL).then(response1 => response1.json()).catch(() => 0),
        fetch(rejURL).then(response2 => response2.json()).catch(() => 0)
    ]).then(([inData, outData, accData, rejData]) => {

        // let evapRate = 0.2;
        let evapRate = localStorage.getItem('evap_rate');
        const newValue = inData - (outData + rejData + (accData * evapRate)); // Assuming the API response contains the desired value

        document.getElementById("s6-mass-box").textContent = newValue.toFixed(0) + " طن";
    })
        .catch(error => {
            console.error('Error:', error);
        });
}


$(document).ready(function () {

    updateDatatable(moment().format('DD-MMM-YY'));

    $("#datatableDatePicker").datepicker({
        dateFormat: "dd-mm-yy",
        onSelect: function (selectedDate) {
            const formattedDate = moment(selectedDate, 'DD-MM-YYYY').format('DD-MMM-YY');

            updateDatatable(formattedDate);
        }
    });

    // getOpNames();
    getCenters();
    updateInputGraph_s6(false);
    updateOutputGraph_s6(false);

    initDateRange();

    setInterval(function () {
        updateAllByTime();
    }, refreshFreq);

    // Initial data update
    updateMassBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateAccBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateRejBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateOPChartData(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateIPChartData(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
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

function updateAllByTime() {
    var start = moment($('#dateRangePicker').data('daterangepicker').startDate);
    var end = moment($('#dateRangePicker').data('daterangepicker').endDate);
    var startDate = start.format('DD-MMM-YY');
    var endDate = end.format('DD-MMM-YY');

    // Call the update functions with the start and end dates
    updateMassBox(startDate, endDate);
    updateAccBox(startDate, endDate);
    updateRejBox(startDate, endDate);
    updateOPBox(startDate, endDate);
    updateIPBox(startDate, endDate);
    updateOPChartData(startDate, endDate);
    updateIPChartData(startDate, endDate);
}

const evapEditButton = document.getElementById("evapEditButton");
evapEditButton.style.display = (userRole === "Admin") ? "block" : "none";

let isEvapInputVisible = false;

function toggleInputField() {
    const evapInputContainer = document.getElementById("evapInputContainer");
    isEvapInputVisible = !isEvapInputVisible;
    evapInputContainer.style.display = isEvapInputVisible ? "block" : "none";
}

const evapRateInput = document.getElementById("evap_rate");
evapRateInput.placeholder = localStorage.getItem('evap_rate');

function saveEvapInput() {
    const inputElement = document.getElementById("evap_rate");
    const inputValue = inputElement.value;

    const validationError = document.getElementById("validationError");
    const validationMessage = document.getElementById("validationMessage");

    if (!isNumeric(inputValue) || inputValue < 0 || inputValue >= 1) {
        validationError.style.display = "block";
        validationMessage.style.display = "none";
        return;
    }

    validationError.style.display = "none";
    validationMessage.style.display = "block";

    localStorage.setItem('evap_rate', inputValue);

    updateMassBox(startDate, endDate);

    evapRateInput.placeholder = localStorage.getItem('evap_rate');
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
