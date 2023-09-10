//// VARS & CONSTS ////
const userRole = getRoleFromToken();
const refreshFreq = 10 * 60 * 1000; // 1 MINUTE
var startDate = moment().format('DD-MMM-YY');
var endDate = moment().format('DD-MMM-YY');
const ipClientDropdown = document.getElementById('ip-clientDropdown-s3');
const ipVillageDropdown = document.getElementById('ip-villageDropdown-s3');
const ipDateDropdown = document.getElementById('ip-dateRangeDropdown-s3');


function populateClientTypes() {

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'كل المرافق';
    defaultOption.selected = true;
    ipClientDropdown.appendChild(defaultOption.cloneNode(true));

    data = ['مصنع اجا', 'مصنع سندوب', 'مصنع بلقاس', 'مصنع السمبلاوين', 'مصنع المنزلة']

    data.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        ipClientDropdown.appendChild(optionElement.cloneNode(true));
    });
}


////  Input graph  ////
const ipChartOptions = {
    bindto: "#s3-in-grph",
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
            'اجمالى المدخلات': "#ef601c"
        }
    },
    grid: {y: {show: true}}
};
const s3_in_grph = c3.generate(ipChartOptions);

function updateInputGraph_s3() {
    const selectedDate = ipDateDropdown.value;
    const selectedClient = ipClientDropdown.value;

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

    const url = `http://isdom.online/dash_board/tickets/itemName-site/weight-date-list?siteNo=3&clientType=${selectedClient}&startDate=${startDatex}&endDate=${endDatex}`;

    fetch(url).then(response1 => response1.json()).catch(() => 0)
        .then(data1 => {
            let categories = Object.keys(data1);
            const values1 = Object.values(data1);

            if (selectedDate === 'lastMonth') {
                categories = Object.keys(data1).map(date => date.split('-')[0]);
            }

            s3_in_grph.load({
                columns: [
                    ['اجمالى المدخلات', ...values1]
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
    labels: ['اجمالى المدخلات'], datasets: [{
        data: [0], backgroundColor: ['#ffa014']
    }]
};
const s3_ip_chart = new Chart(document.getElementById('s3-ip-chart'), {
    type: 'doughnut', data: initialIPChartData
});

// function updateIPChartData(startDate, endDate) {
//     const urlIP1 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
//     const urlIP2 = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات لا تصلح للمعالجة
//     Promise.all([
//         fetch(urlIP1).then(response => response.json()).catch(() => 0),
//         fetch(urlIP2).then(response => response.json()).catch(() => 0)
//     ])
//         .then(([dataset1Data, dataset2Data]) => {
//             const dataset1Value = dataset1Data;
//             const dataset2Value = dataset2Data;
//
//             // Update the dataset values in the chart
//             s3_ip_chart.data.datasets[0].data[0] = dataset1Value || 0;
//             s3_ip_chart.data.datasets[0].data[1] = dataset2Value || 0;
//
//             s3_ip_chart.update();
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }

//// DATA BOXES ////

function updateRejBox(startDate, endDate) {
    const urlAcc = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const urlRej = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مرفوضات&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مرفوضات

    Promise.all([
        fetch(urlAcc).then(response => response.json()).catch(() => 0),
        fetch(urlRej).then(response => response.json()).catch(() => 0),
    ])
        .then(([accData, rejData]) => {
            const percentage = (rejData / accData) * 100;
            if (isNaN(percentage))
                document.getElementById("s3-accepted").textContent = 0 + "%"
            else {
                document.getElementById("s3-rejected-per").textContent = percentage.toFixed(1) + "%"
                document.getElementById("s3-accepted").textContent = "من " + accData + " طن";

                const progressBar = document.getElementById("s3-rej-progress");
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
    const accUrl = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const totInUrl = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=3&startDate=${startDate}&endDate=${endDate}`;

    Promise.all([
        fetch(accUrl).then(response => response.json()).catch(() => 0),
        fetch(totInUrl).then(response => response.json()).catch(() => 0),
    ])
        .then(([accData, totInData]) => {
            const percentage = (accData / totInData) * 100;
            if (isNaN(percentage))
                document.getElementById("s3-accepted-per").textContent = 0 + "%"
            else {
                document.getElementById("s3-accepted-per").textContent = percentage.toFixed(1) + "%"

                const progressBar = document.getElementById("s3-acc-progress");
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
    const url = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مخرجات&siteNo=3&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data; // Assuming the API response contains the desired value

            document.getElementById("s3-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateIPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=3&startDate=${startDate}&endDate=${endDate}`;

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

function updateMassBox(startDate, endDate) {
    const totInURL = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&siteNo=3&startDate=${startDate}&endDate=${endDate}`;
    const totOutURL = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مخرجات&siteNo=3&startDate=${startDate}&endDate=${endDate}`;
    const accURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const rejURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&siteNo=3&startDate=${startDate}&endDate=${endDate}`; // مخلفات لا تصلح للمعالجة

    Promise.all([
        fetch(totInURL).then(response1 => response1.json()).catch(() => 0),
        fetch(totOutURL).then(response1 => response1.json()).catch(() => 0),
        fetch(accURL).then(response1 => response1.json()).catch(() => 0),
        fetch(rejURL).then(response2 => response2.json()).catch(() => 0)
    ]).then(([inData, outData, accData, rejData]) => {

        // let evapRate = 0.2;
        let evapRate = localStorage.getItem('evap_rate');
        const newValue = inData - (outData + rejData + (accData * evapRate)); // Assuming the API response contains the desired value

        document.getElementById("s3-mass-box").textContent = newValue.toFixed(0) + " طن";
    })
        .catch(error => {
            console.error('Error:', error);
        });
}


$(document).ready(function () {

    populateClientTypes();
    updateInputGraph_s3(false);

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
