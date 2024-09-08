//// VARS & CONSTS ////
const userRole = getRoleFromToken();
const refreshFreq = 10 * 60 * 1000; // 1 MINUTE
var startDate = moment().format('DD-MMM-YY');
var endDate = moment().format('DD-MMM-YY');
const ipCenterDropdown = document.getElementById('ip-centerDropdown-s4');
const ipVillageDropdown = document.getElementById('ip-villageDropdown-s4');
const opDateDropdown = document.getElementById('op-dateRangeDropdown-s4');
const ipDateDropdown = document.getElementById('ip-dateRangeDropdown-s4');

var startDateIPGraph = moment().subtract(6, 'days').format('DD-MMM-YY');
var endDateIPGraph = moment().format('DD-MMM-YY');
var startDateOPGraph = moment().subtract(6, 'days').format('DD-MMM-YY');
var endDateOPGraph = moment().format('DD-MMM-YY');

const currentClientType = 'مصنع بلقاس';
var dataTableInitialized = false;
var dataTableJSONData;

const headerMapping = {
    ticketId: "رقم التذكرة",
    itemType: "نوع الشحنة",
    itemName: "الصنف",
    clientName: "العميل",
    villageName: "الوحدة المحلية",
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

var operationsPercentages;
var operationsAccumulatedWeights;

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

    const tbody = document.querySelector('#site4_table tbody');


    fetch(`http://ecaru.xyz/dash_board/tickets/all?siteNo=4&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json()).catch(() => 0)
        .then(data => {

            dataTableJSONData = data;

            $('#site4_table').DataTable().destroy();
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
                    if (key === "enterMethod" || key === "clientType")
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

                                fetch(`http://ecaru.xyz/dash_board/tickets/${rowData.ticketId}/4`, {
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


            $('#site4_table').DataTable({
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


//Get list of centers
function getCenters() {
    fetch('http://ecaru.xyz/dash_board/centers')
        .then(response => response.json()).catch(() => 0)
        .then(data => {

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'كل المراكز';
            defaultOption.selected = true;
            ipCenterDropdown.appendChild(defaultOption.cloneNode(true));

            data.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.centerId;
                optionElement.textContent = option.centerName;
                ipCenterDropdown.appendChild(optionElement.cloneNode(true));
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// Get names of outputs
// function getOpNames() {
//     fetch('http://ecaru.xyz/dash_board/items/items/مخرجات/item-names')
//         .then(response => response.json())
//         .then(data => {
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }


////  Input graph  ////

const ipGraphData = {
    labels: [],
    datasets: [
        {
            label: 'مخلفات تصلح للمعالجة',
            backgroundColor: '#ffa014',
            borderColor: '#ffa014',
            data: []
        },
        {
            label: 'مخلفات لا تصلح للمعالجة',
            backgroundColor: '#d81415',
            borderColor: '#d81415',
            data: []
        }]
};
const s4_in_grph = new Chart(document.getElementById('s4-in-grph'), {
    type: 'line',
    data: ipGraphData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        }
    }
});


function updateIpVillageDropdown(centerId) {
    if (centerId !== "") {
        fetch(`http://ecaru.xyz/dash_board/villages?centerId=${centerId}`)
            .then(response => response.json()).catch(() => 0)
            .then(data => {

                document.getElementById("ip-villageDropdown-s4").style.display = "block";

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

function updateInputGraph_s4(isVillage) {
    const selectedCenter = ipCenterDropdown.value;
    var selectedVillage = ipVillageDropdown.value;

    if (isVillage === false) {
        updateIpVillageDropdown(selectedCenter);
        selectedVillage = "";
    }


    const url1 = `http://ecaru.xyz/dash_board/tickets/itemName-site/weight-date-list?itemName=مخلفات  تصلح للمعالجة&siteNo=4&startDate=${startDateIPGraph}&endDate=${endDateIPGraph}&centerId=${selectedCenter}&villageId=${selectedVillage}`; //مخلفات تصلح للمعالجة
    const url2 = `http://ecaru.xyz/dash_board/tickets/itemName-site/weight-date-list?itemName=مخلفات لا تصلح للمعالجة&siteNo=4&startDate=${startDateIPGraph}&endDate=${endDateIPGraph}&centerId=${selectedCenter}&villageId=${selectedVillage}`; //مخلفات لا تصلح للمعالجة

    Promise.all([
        fetch(url1).then(response1 => response1.json()).catch(() => 0),
        fetch(url2).then(response2 => response2.json()).catch(() => 0)
    ]).then(([data1, data2]) => {
        let categories = Object.keys(data1);
        const values1 = Object.values(data1);
        const values2 = Object.values(data2);

        s4_in_grph.data.datasets[0].data = values1 || 0;
        s4_in_grph.data.datasets[1].data = values2 || 0;
        s4_in_grph.data.labels = categories || 0;

        s4_in_grph.update();
    })
        .catch(error => {
            console.error('Error:', error);
        });
}


////  Output graph  ////

const opGraphData = {
    labels: [],
    datasets: [
        {
            label: 'وقود بديل',
            backgroundColor: '#1427c9',
            borderColor: '#1427c9',
            data: []
        },
        {
            label: 'اسمدة عضوية',
            backgroundColor: '#2da075',
            borderColor: '#2da075',
            data: []
        },
        {
            label: 'مرفوضات',
            backgroundColor: '#10d6b4',
            borderColor: '#10d6b4',
            data: []
        },
        {
            label: 'مفروزات',
            backgroundColor: '#85a6e9',
            borderColor: '#85a6e9',
            data: []
        }
    ]
};

const s4_out_grph = new Chart(document.getElementById('s4-out-grph'), {
    type: 'line',
    data: opGraphData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        }
    }
});


function updateOutputGraph_s4() {
    const waqoodURL = `http://ecaru.xyz/dash_board/tickets/itemName-site/weight-date-list?itemName=وقود بديل&siteNo=4&startDate=${startDateOPGraph}&endDate=${endDateOPGraph}`; // وقود بديل
    const asmedaURL = `http://ecaru.xyz/dash_board/tickets/itemName-site/weight-date-list?itemName=اسمدة عضوية&siteNo=4&startDate=${startDateOPGraph}&endDate=${endDateOPGraph}`; // اسمدة عضوية
    const marfoodatURL = `http://ecaru.xyz/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${currentClientType}&startDate=${startDateOPGraph}&endDate=${endDateOPGraph}`; // مرفوضات
    const mafroozatURL = `http://ecaru.xyz/dash_board/tickets/itemName-site/weight-date-list?itemName=مفروزات&siteNo=4&startDate=${startDateOPGraph}&endDate=${endDateOPGraph}`; //مفروزات
    Promise.all([
        fetch(waqoodURL).then(responseWaqood => responseWaqood.json().catch(() => 0)),
        fetch(asmedaURL).then(responseAsmeda => responseAsmeda.json().catch(() => 0)),
        fetch(marfoodatURL).then(responseMarfoodat => responseMarfoodat.json().catch(() => 0)),
        fetch(mafroozatURL).then(responseMafroozat => responseMafroozat.json().catch(() => 0))
    ]).then(([dataWaqood, dataAsmeda, dataMarfoodat, dataMafroozat]) => {
        let categories = Object.keys(dataWaqood);
        const valuesWaqood = Object.values(dataWaqood);
        const valuesAsmeda = Object.values(dataAsmeda);
        const valuesMarfoodat = Object.values(dataMarfoodat);
        const valuesMafroozat = Object.values(dataMafroozat);

        s4_out_grph.data.datasets[0].data = valuesWaqood || 0;
        s4_out_grph.data.datasets[1].data = valuesAsmeda || 0;
        s4_out_grph.data.datasets[2].data = valuesMarfoodat || 0;
        s4_out_grph.data.datasets[3].data = valuesMafroozat || 0;
        s4_out_grph.data.labels = categories || 0;

        s4_out_grph.update();

    })
        .catch(error => {
            console.error('Error:', error);
        });
}


////  INPUT DONUT CHART  ////
const initialIPChartData = {
    bindto: "#s4-ip-chart",
    size: {height: 350},
    legend: {},
    data: {
        columns: [],
        type: "pie",
        colors: {
            'مخلفات تصلح للمعالجة': "#ffa014",
            'مخلفات لا تصلح للمعالجة': "#d81415"
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
const s4_ip_chart = c3.generate(initialIPChartData);

function updateIPChartData(startDate, endDate) {
    const urlIP1 = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const urlIP2 = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات لا تصلح للمعالجة
    Promise.all([
        fetch(urlIP1).then(response => response.json()).catch(() => 0),
        fetch(urlIP2).then(response => response.json()).catch(() => 0)
    ])
        .then(([dataset1Data, dataset2Data]) => {
            const dataset1Value = dataset1Data;
            const dataset2Value = dataset2Data;

            s4_ip_chart.load({
                columns: [
                    ['مخلفات تصلح للمعالجة', dataset1Value],
                    ['مخلفات لا تصلح للمعالجة', dataset2Value]
                ]
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

////  OUTPUT DONUT CHART  ////
const initialOPChartData = {
    bindto: "#s4-op-chart",
    size: {height: 350},
    legend: {},
    data: {
        columns: [],
        type: "pie",
        colors: {
            'اسمدة عضوية': "#2da075",
            'وقود بديل': "#1427c9",
            'مرفوضات': "#10d6b4",
            'مفروزات': "#85a6e9"
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
const s4_op_chart = c3.generate(initialOPChartData);


function updateOPChartData(startDate, endDate) {
    const urlOP1 = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=اسمدة عضوية&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // اسمدة عضوية
    const urlOP2 = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=وقود بديل&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const urlOP3 = `http://ecaru.xyz/dash_board/tickets/itemName/weight?siteNo=3&clientType=${currentClientType}&startDate=${startDate}&endDate=${endDate}`; // مرفوضات
    const urlOP4 = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مفروزات&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مفروزات

    Promise.all([
        fetch(urlOP1).then(response => response.json()).catch(() => 0),
        fetch(urlOP2).then(response => response.json()).catch(() => 0),
        fetch(urlOP3).then(response => response.json()).catch(() => 0),
        fetch(urlOP4).then(response => response.json()).catch(() => 0)
    ])
        .then(([category1Data, category2Data, category3Data, category4Data]) => {
            const category1Value = category1Data;
            const category2Value = category2Data;
            const category3Value = category3Data;
            const category4Value = category4Data;
            s4_op_chart.load({
                columns: [
                    ['اسمدة عضوية', category1Value],
                    ['وقود بديل', category2Value],
                    ['مرفوضات', category3Value],
                    ['مفروزات', category4Value]
                ]
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//// DATA BOXES ////

//// inputs ////

function updateIPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=4&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data; // Assuming the API response contains the desired value

            document.getElementById("s4-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateAccIPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("s4-accepted-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateRejIPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("s4-rejected-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateRejRateBox(startDate, endDate) {
    const accUrl = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const rejUrl = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`;
    const marfoodatURL = `http://ecaru.xyz/dash_board/tickets/itemName/weight?siteNo=3&clientType=${currentClientType}&startDate=${startDate}&endDate=${endDate}`; // مرفوضات

    Promise.all([
        fetch(accUrl).then(accResponse => accResponse.json()).catch(() => 0),
        fetch(rejUrl).then(rejResponse => rejResponse.json()).catch(() => 0),
        fetch(marfoodatURL).then(marfoodatResponse => marfoodatResponse.json()).catch(() => 0)
    ]).then(([accVal, rejVal, marfoodat]) => {

        console.log(accVal);
        console.log(rejVal);
        console.log(marfoodat);
        const percentage = ((marfoodat - rejVal)/ accVal) * 100;

        if (isNaN(percentage))
            document.getElementById("rejected_per").textContent = 0 + "%"
        else
            document.getElementById("rejected_per").textContent = percentage.toFixed(0) + "%";
    })
}

function updateAccRateBox(startDate, endDate) {
    const accUrl = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const totInUrl = `http://ecaru.xyz/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=4&startDate=${startDate}&endDate=${endDate}`;


    fetch(accUrl)
        .then(response => response.json()).catch(() => 0)
        .then(accData => {

            const accVal = accData;
            fetch(totInUrl)
                .then(response => response.json()).catch(() => 0)
                .then(totInData => {
                    const totInVal = totInData;

                    const percentage = (accVal / totInVal) * 100;
                    if (isNaN(percentage))
                        document.getElementById("accepted_per").textContent = 0 + "%"
                    else
                        document.getElementById("accepted_per").textContent = percentage.toFixed(0) + "%";
                })
                .catch(error => {
                    // console.error('Error:', error);
                });
        })
        .catch(error => {
            // console.error('Error:', error);
        });
}

//// operations ////

function updateInOperationBox() {
    const startDate = moment().format('DD-MMM-YY');
    const endDate = moment().format('DD-MMM-YY');

    const percentagesURL = 'http://ecaru.xyz/dash_board/accumulated/percentage?siteNo=4';
    const accumulatedWeightsURL = 'http://ecaru.xyz/dash_board/accumulated/weight?siteNo=4'
    const acceptedInputURL = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const asmedaURL = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=اسمدة عضوية&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // اسمدة عضوية
    const waqoodURL = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=وقود بديل&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const marfoodatURL = `http://ecaru.xyz/dash_board/tickets/itemName/weight?siteNo=3&clientType=${currentClientType}&startDate=${startDate}&endDate=${endDate}`; // مرفوضات
    const mafroozatURL = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مفروزات&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مفروزات


    Promise.all([
        fetch(percentagesURL).then(responsePercentages => responsePercentages.json()).catch(() => 0),
        fetch(accumulatedWeightsURL).then(responseAccumulatedWeights => responseAccumulatedWeights.json()).catch(() => 0),
        fetch(acceptedInputURL).then(responseAcceptedInput => responseAcceptedInput.json()).catch(() => 0),
        fetch(asmedaURL).then(responseAsmeda => responseAsmeda.json()).catch(() => 0),
        fetch(waqoodURL).then(responseWaqood => responseWaqood.json()).catch(() => 0),
        fetch(marfoodatURL).then(responseMarfoodat => responseMarfoodat.json()).catch(() => 0),
        fetch(mafroozatURL).then(responseMafroozat => responseMafroozat.json()).catch(() => 0)
    ]).then(([dataPercentages, dataAccumulatedWeights, dataAcceptedInput,
                 dataAsmeda, dataWaqood, dataMarfoodat,
                 dataMafroozat]) => {
        operationsPercentages = dataPercentages;
        operationsAccumulatedWeights = dataAccumulatedWeights;

        document.getElementById('asmeda-percentage').textContent = ' (' + dataPercentages['اسمدة عضوية'] + '%)';
        document.getElementById('waqood-percentage').textContent = ' (' + dataPercentages['وقود بديل'] + '%)';
        document.getElementById('marfoodat-percentage').textContent = ' (' + dataPercentages['مرفوضات'] + '%)';
        document.getElementById('mafroozat-percentage').textContent = ' (' + dataPercentages['مفروزات'] + '%)';

        const asmeda_operation_weight = (dataAcceptedInput * dataPercentages['اسمدة عضوية'] / 100) + dataAccumulatedWeights['اسمدة عضوية'] -
            dataAsmeda;
        const waqood_operation_weight = (dataAcceptedInput * dataPercentages['وقود بديل'] / 100) + dataAccumulatedWeights['وقود بديل'] -
            dataWaqood;
        const marfoodat_operation_weight = (dataAcceptedInput * dataPercentages['مرفوضات'] / 100) + dataAccumulatedWeights['مرفوضات'] -
            dataMarfoodat;
        const mafroozat_operation_weight = (dataAcceptedInput * dataPercentages['مفروزات'] / 100) + dataAccumulatedWeights['مفروزات'] -
            dataMafroozat;

        document.getElementById('asmeda-operation-weight').textContent = asmeda_operation_weight.toFixed(0) + ' طن';
        document.getElementById('waqood-operation-weight').textContent = waqood_operation_weight.toFixed(0) + ' طن';
        document.getElementById('marfoodat-operation-weight').textContent = marfoodat_operation_weight.toFixed(0) + ' طن';
        document.getElementById('mafroozat-operation-weight').textContent = mafroozat_operation_weight.toFixed(0) + ' طن';

        if (userRole === "Admin") {
            const openOperationPopupBtn = document.getElementById("openOperationPopupBtn");
            openOperationPopupBtn.style.display = "block";
        }
    })
        .catch(error => {
            console.error('Error:', error);
        });
}

//// outputs ////

function updateOPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/output/weight?itemType=مخرجات&siteNo=4&clientType=${currentClientType}&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data; // Assuming the API response contains the desired value

            document.getElementById("s4-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateAsmedaOPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=اسمدة عضوية&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("s4-asmeda-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateWaqoodOPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=وقود بديل&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("s4-waqood-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateMarfoodatOPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/itemName/weight?siteNo=3&clientType=${currentClientType}&startDate=${startDate}&endDate=${endDate}`;
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("s4-marfoodat-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateMafroozatOPBox(startDate, endDate) {
    const url = `http://ecaru.xyz/dash_board/tickets/itemName/weight?itemName=مفروزات&siteNo=4&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("s4-mafroozat-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


$(document).ready(function () {

    updateInOperationBox();
    initDatatableDateRange();
    initIPGraphDateRange();
    initOPGraphDateRange();

    getCenters();
    updateInputGraph_s4(false);
    updateOutputGraph_s4();

    initDateRange();

    setInterval(function () {
        updateAllByTime();
    }, refreshFreq);

    // Initial data update
    updateAccIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateRejIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateAccRateBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateRejRateBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateAsmedaOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateWaqoodOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateMarfoodatOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateMafroozatOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateOPChartData(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateIPChartData(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateDatatable(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
});


function initDateRange() {
    $('#dateRangePicker').daterangepicker({
        opens: 'left',
         ranges: {
                'اسبوع': [moment().subtract(6, 'days'), moment()],
                'اسبوعين': [moment().subtract(13, 'days'), moment()],
//                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'الشهر الحالى': [moment().startOf('month'), moment()],
                'الشهر الماضى': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
              },
        showCustomRangeLabel: false,
        alwaysShowCalendars: true,
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

function initIPGraphDateRange() {
    $('#ipGraphDateRangePicker').daterangepicker({
        opens: 'left',
        locale: {
                applyButtonText: 'fmdmdmdm',
                cancelLabel: 'mkanse',
                customRangeLabel: 'Custom Range'
                },
        ranges: {
                'اسبوع': [moment().subtract(6, 'days'), moment()],
                'اسبوعين': [moment().subtract(13, 'days'), moment()],
                'الشهر الحالى': [moment().startOf('month'), moment()],
                'الشهر الماضى': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
              },
        showCustomRangeLabel: false,
        alwaysShowCalendars: true,
        startDate: moment(),
        endDate: moment(),
        locale: {
            format: 'DD-MM-YYYY'
        }
    }, function () {
        var start = moment($('#ipGraphDateRangePicker').data('daterangepicker').startDate);
        var end = moment($('#ipGraphDateRangePicker').data('daterangepicker').endDate);
        startDateIPGraph = start.format('DD-MMM-YY');
        endDateIPGraph = end.format('DD-MMM-YY');
        updateInputGraph_s4(false);
    });
}

function initOPGraphDateRange() {
    $('#opGraphDateRangePicker').daterangepicker({
        opens: 'left',
        ranges: {
                'اسبوع': [moment().subtract(6, 'days'), moment()],
                'اسبوعين': [moment().subtract(13, 'days'), moment()],
                'الشهر الحالى': [moment().startOf('month'), moment()],
                'الشهر الماضى': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
              },
        showCustomRangeLabel: false,
        alwaysShowCalendars: true,
        startDate: moment(),
        endDate: moment(),
        locale: {
            format: 'DD-MM-YYYY'
        }
    }, function () {
        var start = moment($('#opGraphDateRangePicker').data('daterangepicker').startDate);
        var end = moment($('#opGraphDateRangePicker').data('daterangepicker').endDate);
        startDateOPGraph = start.format('DD-MMM-YY');
        endDateOPGraph = end.format('DD-MMM-YY');
        updateOutputGraph_s4();
    });
}

function updateAllByTime() {
    var start = moment($('#dateRangePicker').data('daterangepicker').startDate);
    var end = moment($('#dateRangePicker').data('daterangepicker').endDate);
    var startDate = start.format('DD-MMM-YY');
    var endDate = end.format('DD-MMM-YY');

    // Call the update functions with the start and end dates
    updateAccIPBox(startDate, endDate);
    updateRejIPBox(startDate, endDate);
    updateAccRateBox(startDate, endDate);
    updateRejRateBox(startDate, endDate);
    updateOPBox(startDate, endDate);
    updateAsmedaOPBox(startDate, endDate);
    updateWaqoodOPBox(startDate, endDate);
    updateMarfoodatOPBox(startDate, endDate);
    updateMafroozatOPBox(startDate, endDate);
    updateIPBox(startDate, endDate);
    updateOPChartData(startDate, endDate);
    updateIPChartData(startDate, endDate);
}


document.getElementById('openOperationPopupBtn').addEventListener('click', function () {
    const popupContainerOperations = document.getElementById("popupContainerOperations");
    // const backgroundElements = document.getElementById("modalOverlay");
    //
    // backgroundElements.style.display = 'block';

    const form = document.getElementById("percentageForm");
    const form2 = document.getElementById("accuWeightForm");

    // Clear any existing form elements
    form.innerHTML = '';
    form2.innerHTML = '';
    form2.style.position = "absolute";
    form2.style.right = "275px";
    form2.style.width = "auto";


    // Loop to generate input fields with labels
    for (const key in operationsPercentages) {
        const label = document.createElement("label");
        label.style.marginBottom = "10px";
        label.textContent = key;

        // const value = operationsPercentages[key];
        // console.log(`Key: ${key}, Value: ${value}`);

        const inputPercentage = document.createElement("input");
        inputPercentage.style.width = "50px";
        inputPercentage.style.position = "absolute";
        inputPercentage.style.right = "170px";

        inputPercentage.type = "text";
        inputPercentage.name = `dataPercentage${key}`;

        inputPercentage.value = operationsPercentages[key];

        const inputAccuWeight = document.createElement("input");
        inputAccuWeight.style.width = "50px";
        inputAccuWeight.style.marginBottom = '5px';
        // inputAccuWeight.style.position = "absolute";
        // inputAccuWeight.style.right = "1990px";

        inputAccuWeight.type = "text";
        inputAccuWeight.name = `dataAccuWeight${key}`;

        inputAccuWeight.value = operationsAccumulatedWeights[key];

        form.appendChild(label);
        form.appendChild(inputPercentage);
        form.appendChild(document.createElement("br"));

        form2.appendChild(inputAccuWeight);
        form2.appendChild(document.createElement("br"));
    }

    const saveButton = document.createElement("button");
    saveButton.id = "formButton";
    saveButton.textContent = "حفظ";
    form.appendChild(saveButton);

    popupContainerOperations.style.display = "block";

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const operationsEditLoader = document.getElementById("operationsEditLoader");
        operationsEditLoader.style.display = "block";// Create an object to represent the data
        const dataObjectPercentage = {};
        const dataObjectAccuWeight = {};
        for (const key in operationsPercentages) {
            const inputFieldPercentage = form.querySelector(`input[name="dataPercentage${key}"]`);
            const valuePercentage = inputFieldPercentage.value;
            dataObjectPercentage[key] = parseFloat(valuePercentage);

            const inputFieldAccuWeight = form2.querySelector(`input[name="dataAccuWeight${key}"]`);
            const valueAccuWeight = inputFieldAccuWeight.value;
            dataObjectAccuWeight[key] = parseFloat(valueAccuWeight); // Assuming you want to send numeric values
        }

        const urlPercentage = 'http://ecaru.xyz/dash_board/accumulated/update-percentage/4'
        const urlAccuWeight = 'http://ecaru.xyz/dash_board/accumulated/update-weight/4'

        fetch(urlPercentage, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObjectPercentage),
        })
            .then(() => {
                operationsPercentages = dataObjectPercentage;

                operationsEditLoader.style.display = "none";
                popupContainerOperations.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
            })

        fetch(urlAccuWeight, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObjectAccuWeight),
        })
            .then(() => {
                operationsAccumulatedWeights = dataObjectAccuWeight;
                operationsEditLoader.style.display = "none";
                popupContainerOperations.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
            });

    });

});


document.getElementById('closeOperationsPopupBtn').addEventListener('click', function () {
    document.getElementById('popupContainerOperations').style.display = 'none';
});