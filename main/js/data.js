const userRole = getRoleFromToken();

var centersList = [];
var valuesTarget = 0;

var acceptedInputSites = [];
var rejectedInputSites = [];

var totalInput = 0;
var totalAccepted = 0;

var totalAsmeda = 0;
var totalWaqood = 0;
var totalMarfoodat = 0;
var totalMafroozat = 0;

var isFirstLoad = true;

function fetchReusableDataAndUpdateCharts(startDate, endDate) {
    const acceptedInputsURL = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`;
    const rejectedInputsURL = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=مخلفات لا تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`;

    const totalInputURL = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&startDate=${startDate}&endDate=${endDate}`;
    const acceptedInputURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`;

    const asmedaURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=اسمدة عضوية&startDate=${startDate}&endDate=${endDate}`;
    const waqoodURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=وقود بديل&&startDate=${startDate}&endDate=${endDate}`;
    const marfoodatURL = `http://isdom.online/dash_board/tickets/output-rejected/weight?startDate=${startDate}&endDate=${endDate}`;
    const mafroozatURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مفروزات&startDate=${startDate}&endDate=${endDate}`;

    Promise.all([
        fetch(acceptedInputsURL).then(responseacceptedInputs => responseacceptedInputs.json()),
        fetch(rejectedInputsURL).then(responserejectedInputs => responserejectedInputs.json()),
        fetch(totalInputURL).then(responseTotalInput => responseTotalInput.json()),
        fetch(acceptedInputURL).then(responseAcceptedInput => responseAcceptedInput.json()),
        fetch(asmedaURL).then(responseAsmeda => responseAsmeda.json()).catch(() => 0),
        fetch(waqoodURL).then(responseWaqood => responseWaqood.json()).catch(() => 0),
        fetch(marfoodatURL).then(responseMarfoodat => responseMarfoodat.json()).catch(() => 0),
        fetch(mafroozatURL).then(responseMafroozat => responseMafroozat.json()).catch(() => 0)
    ]).then(([dataAcceptedInputs, dataRejectedInputs, dataTotalInput, dataAcceptedInput, dataAsmeda, dataWaqood, dataMarfoodat,
                 dataMafroozat]) => {

        acceptedInputSites = dataAcceptedInputs;
        rejectedInputSites = dataRejectedInputs;

        totalInput = dataTotalInput;
        totalAccepted = dataAcceptedInput;

        totalAsmeda = dataAsmeda;
        totalWaqood = dataWaqood;
        totalMarfoodat = dataMarfoodat;
        totalMafroozat = dataMafroozat;

        updateTotalIPGraph();
        updateTotAccIPBox();
        updateTotAccRateBox();
        updateTotRejRateBox();
        updateTotAsmedaOPBox();
        updateTotWaqoodOPBox();
        updateTotMarfoodatOPBox();
        updateTotMafroozatOPBox();
        if (isFirstLoad)
            updateInOperationBox();
    })
}


//updateTotalOPGraph
function updateTotalOPGraph(startDate, endDate) {

    const asmedaURL = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=اسمدة عضوية&startDate=${startDate}&endDate=${endDate}`; // اسمدة عضوية
    const waqoodURL = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=وقود بديل&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const marfoodatURL = `http://isdom.online/dash_board/tickets/output-rejected/weight-list?startDate=${startDate}&endDate=${endDate}`; // مرفوضات
    const mafroozatURL = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=مفروزات&startDate=${startDate}&endDate=${endDate}`; // مفروزات


    fetch(asmedaURL)
        .then(response => response.json())
        .then(data => {
            const asmedaValues = data;

            fetch(waqoodURL)
                .then(response => response.json())
                .then(data => {
                    const waqoodValues = data;

                    fetch(marfoodatURL)
                        .then(response => response.json())
                        .then(data => {
                            const marfoodatValues = data;

                            fetch(mafroozatURL)
                                .then(response => response.json())
                                .then(data => {
                                    const mafroozatValues = data;

                                    tot_out_grph.data.datasets[0].data = asmedaValues || 0;
                                    tot_out_grph.data.datasets[1].data = waqoodValues || 0;
                                    tot_out_grph.data.datasets[2].data = marfoodatValues || 0;
                                    tot_out_grph.data.datasets[3].data = mafroozatValues || 0;

                                    tot_out_grph.update();
                                })
                        })
                })
        })
}

//updateTotalIPOPGraph
function updateTotalIPOPGraph(startDate, endDate) {
    const ipOpGraphURL1 = `http://isdom.online/dash_board/tickets/itemType/weight-list?itemType=مدخلات&startDate=${startDate}&endDate=${endDate}`;
    const ipOpGraphURL2 = `http://isdom.online/dash_board/tickets/output/weight-list?startDate=${startDate}&endDate=${endDate}`;

    fetch(ipOpGraphURL1)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const category1Values = data;

            // Fetch data for category2 values
            fetch(ipOpGraphURL2)
                .then(response => response.json())
                .then(data => {
                    const category2Values = data;

                    tot_in_out_grph.data.datasets[0].data = category1Values || 0;
                    tot_in_out_grph.data.datasets[1].data = category2Values || 0;

                    tot_in_out_grph.update();
                })
        })
}

//updateTotalIPGraph
function updateTotalIPGraph() {

    tot_in_grph.data.datasets[0].data = acceptedInputSites || 0;
    tot_in_grph.data.datasets[1].data = rejectedInputSites || 0;

    tot_in_grph.update();
}

//Update Centers Graph
function updateCentersInputGraph_total(startDate, endDate) {

    var numberOfDays;

    const startDatex = moment(startDate, 'DD-MMM-YY');
    const endDatex = moment(endDate, 'DD-MMM-YY');
    numberOfDays = endDatex.diff(startDatex, 'days') + 1;

    const urlReal = `http://isdom.online/dash_board/tickets/centers-net-weight-list?itemType=مدخلات&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const urlAccepted = `http://isdom.online/dash_board/tickets/centers-accepted-net-weight-list?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const urlTarget = `http://isdom.online/dash_board/targets`; // وقود بديل


    Promise.all([
        fetch(urlReal).then(responseReal => responseReal.json()),
        fetch(urlAccepted).then(responseAccepted => responseAccepted.json()),
        fetch(urlTarget).then(responseTarget => responseTarget.json())
    ]).then(([dataReal, dataAccepted, dataTarget]) => {
        centersList = Object.keys(dataReal);
        const valuesReal = Object.values(dataReal);
        const valuesAccepted = Object.values(dataAccepted);
        valuesTarget = Object.values(dataTarget);
        const dataTargetByDays = valuesTarget.map(value => value * numberOfDays);

        if (userRole === "Admin") {
            const openCentersTargetsPopupBtn = document.getElementById("openCentersTargetsPopupBtn");
            openCentersTargetsPopupBtn.style.display = "block";
        }


        centers_ip_graph.data.datasets[0].data = valuesReal || 0;
        centers_ip_graph.data.datasets[1].data = valuesAccepted || 0;
        centers_ip_graph.data.datasets[2].data = dataTargetByDays || 0;
        centers_ip_graph.data.labels = centersList || 0;

        centers_ip_graph.update();
    })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
}


//Input boxes
//Total input box
function updateTotIPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            document.getElementById("tot-ip-box").textContent = data + " طن";
        })
    // .catch(error => {
    //     // console.error('Error:', error);
    // });
}

function updateTotAccIPBox() {
    document.getElementById("tot-accepted-ip-box").textContent = totalAccepted + " طن";
}

function updateTotRejIPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-rejected-ip-box").textContent = newValue + " طن";
        })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
}

//Rates boxes
function updateTotAccRateBox() {
    const percentage = (totalAccepted / totalInput) * 100;
    if (isNaN(percentage))
        document.getElementById("accepted_per").textContent = 0 + "%"
    else
        document.getElementById("accepted_per").textContent = percentage.toFixed(0) + "%";
}

function updateTotRejRateBox() {
    const percentage = (totalMarfoodat / totalAccepted) * 100;
    if (isNaN(percentage))
        document.getElementById("rejected_per").textContent = 0 + "%"
    else
        document.getElementById("rejected_per").textContent = percentage.toFixed(0) + "%";

}

//Operations box
function updateInOperationBox() {

    const asmedaPercentagesURL = 'http://isdom.online/dash_board/accumulated/percentage-by-itemname?itemName=اسمدة عضوية';
    const waqoodPercentagesURL = 'http://isdom.online/dash_board/accumulated/percentage-by-itemname?itemName=وقود بديل';
    const marfoodatPercentagesURL = 'http://isdom.online/dash_board/accumulated/percentage-by-itemname?itemName=مرفوضات';
    const mafroozatPercentagesURL = 'http://isdom.online/dash_board/accumulated/percentage-by-itemname?itemName=مفروزات';
    const accumulatedWeightsURL = 'http://isdom.online/dash_board/accumulated/weight'

    Promise.all([
        fetch(asmedaPercentagesURL).then(responseAsmedaPercentages => responseAsmedaPercentages.json()).catch(() => 0),
        fetch(waqoodPercentagesURL).then(responseWaqoodPercentages => responseWaqoodPercentages.json()).catch(() => 0),
        fetch(marfoodatPercentagesURL).then(responseMarfoodatPercentages => responseMarfoodatPercentages.json()).catch(() => 0),
        fetch(mafroozatPercentagesURL).then(responseMafroozatPercentages => responseMafroozatPercentages.json()).catch(() => 0),
        fetch(accumulatedWeightsURL).then(responseAccumulatedWeights => responseAccumulatedWeights.json()).catch(() => 0)
    ]).then(([dataAsmedaPercentages, dataWaqoodPercentages, dataMarfoodatPercentages,
                 dataMafroozatPercentages, dataAccumulatedWeights]) => {

        const asmedaInputsByPercentageList = acceptedInputSites.map((element, index) => element * Object.values(dataAsmedaPercentages)[index]);
        const waqoodInputsByPercentageList = acceptedInputSites.map((element, index) => element * Object.values(dataWaqoodPercentages)[index]);
        const marfoodatInputsByPercentageList = acceptedInputSites.map((element, index) => element * Object.values(dataMarfoodatPercentages)[index]);
        const mafroozatInputsByPercentageList = acceptedInputSites.map((element, index) => element * Object.values(dataMafroozatPercentages)[index]);

        const asmedaSumInputsByPercentages = asmedaInputsByPercentageList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
        const waqoodSumInputsByPercentages = waqoodInputsByPercentageList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
        const marfoodatSumInputsByPercentages = marfoodatInputsByPercentageList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);
        const mafroozatSumInputsByPercentages = mafroozatInputsByPercentageList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);

        const asmeda_operation_weight = asmedaSumInputsByPercentages / 100 + dataAccumulatedWeights['اسمدة عضوية'] -
            totalAsmeda;
        const waqood_operation_weight = waqoodSumInputsByPercentages / 100 + dataAccumulatedWeights['وقود بديل'] -
            totalWaqood;
        const marfoodat_operation_weight = marfoodatSumInputsByPercentages / 100 + dataAccumulatedWeights['مرفوضات'] -
            totalMarfoodat;
        const mafroozat_operation_weight = mafroozatSumInputsByPercentages / 100 + dataAccumulatedWeights['مفروزات'] -
            totalMafroozat;

        document.getElementById('asmeda-operation-weight').textContent = asmeda_operation_weight.toFixed(0) + ' طن';
        document.getElementById('waqood-operation-weight').textContent = waqood_operation_weight.toFixed(0) + ' طن';
        document.getElementById('marfoodat-operation-weight').textContent = marfoodat_operation_weight.toFixed(0) + ' طن';
        document.getElementById('mafroozat-operation-weight').textContent = mafroozat_operation_weight.toFixed(0) + ' طن';

        isFirstLoad = false;
    })
}

//Output boxes
//Total output box
function updateTotOPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/output/weight?startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-op-box").textContent = newValue + " طن";
        })
}

function updateTotAsmedaOPBox() {
    document.getElementById("tot-asmeda-op-box").textContent = totalAsmeda + " طن";
}

function updateTotWaqoodOPBox() {
    document.getElementById("tot-waqood-op-box").textContent = totalWaqood + " طن";
}

function updateTotMarfoodatOPBox() {
    document.getElementById("tot-marfoodat-op-box").textContent = totalMarfoodat + " طن";
}

function updateTotMafroozatOPBox() {
    document.getElementById("tot-mafroozat-op-box").textContent = totalMafroozat + " طن";
}


var tot_in_out_grph;
var tot_out_grph;
var tot_in_grph;
var centers_ip_graph;

$dateRangePicker = $('#dateRangePicker');
// Initialize the date range picker
$(document).ready(function () {
    $dateRangePicker.daterangepicker({
        opens: 'left',
        startDate: moment(),
        endDate: moment(),
        locale: {
            format: 'DD-MM-YYYY'
        },

        function(start, end) {
            const startDate = start.format('DD-MMM-YY');
            const endDate = end.format('DD-MMM-YY');
            // updateTotAccBox(startDate, endDate);
            // updateTotRejBox(startDate, endDate);
            updateTotIPBox(startDate, endDate);
            updateTotOPBox(startDate, endDate);
        }
    });

    tot_in_out_grph = new Chart(document.getElementById('total-ip-op-graph'), {
        type: 'bar',
        data: {
            labels: ['أجا', 'سندوب', 'بلقاس', 'السنبلاوين', 'المنزلة'],
            datasets: [
                {
                    label: 'مدخلات',
                    backgroundColor: '#ef601c',
                    borderColor: '#ef601c',
                    data: []
                },
                {
                    label: 'مخرجات',
                    backgroundColor: '#36ca0f',
                    borderColor: '#36ca0f',
                    data: []
                }
            ]
        },
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

    tot_in_grph = new Chart(document.getElementById('total-input-graph'), {
        type: 'bar',
        data: {
            labels: ['أجا', 'سندوب', 'بلقاس', 'السنبلاوين', 'المنزلة'],
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
                }
            ]
        },
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

    tot_out_grph = new Chart(document.getElementById('total-output-graph'), {
        type: 'line',
        data: {
            labels: ['أجا', 'سندوب', 'بلقاس', 'السنبلاوين', 'المنزلة'],
            datasets: [
                {
                    label: 'اسمدة عضوية',
                    backgroundColor: '#2da075',
                    borderColor: '#2da075',
                    data: []
                },
                {
                    label: 'وقود بديل',
                    backgroundColor: '#1427c9',
                    borderColor: '#1427c9',
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
        },
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

    centers_ip_graph = new Chart(document.getElementById('centers-ip-graph'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'الكميات الموردة',
                    backgroundColor: '#ef601c',
                    borderColor: '#ef601c',
                    data: []
                },
                {
                    label: 'المخلفات الصالحة للمعالجة',
                    backgroundColor: '#ffc814',
                    borderColor: '#ffc814',
                    data: []
                },
                {
                    label: 'الكميات المستهدفة',
                    backgroundColor: '#6C0C0C',
                    borderColor: '#6C0C0C',
                    data: []
                }
            ]
        },
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


    // Set the initial values for the components
    updateTotalOPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotalIPOPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateCentersInputGraph_total(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotRejIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    fetchReusableDataAndUpdateCharts(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));

    // Listen for changes in the date range picker and update the components accordingly
    $dateRangePicker.on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('DD-MMM-YY');
        const endDate = picker.endDate.format('DD-MMM-YY');

        updateTotalOPGraph(startDate, endDate);
        updateTotalIPOPGraph(startDate, endDate);
        updateCentersInputGraph_total(startDate, endDate);
        updateTotIPBox(startDate, endDate);
        updateTotRejIPBox(startDate, endDate);
        updateTotOPBox(startDate, endDate);
        fetchReusableDataAndUpdateCharts(startDate, endDate);
    });
});

document.getElementById('openCentersTargetsPopupBtn').addEventListener('click', function () {
    const popupContainer = document.getElementById("popupContainer");
    const form = document.getElementById("targetsForm");

    form.innerHTML = '';

    for (let i = 0; i < centersList.length; i++) {
        const label = document.createElement("label");
        label.style.marginBottom = "10px";
        label.textContent = centersList[i];

        const input = document.createElement("input");
        input.style.width = "50px";
        input.style.position = "absolute";
        input.style.right = "170px";

        input.type = "text";
        input.name = `data${i}`;

        if (valuesTarget && valuesTarget[i]) {
            input.value = valuesTarget[i];
        }

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
    }

    const saveButton = document.createElement("button");
    saveButton.id = "formButton";
    saveButton.textContent = "حفظ";
    form.appendChild(saveButton);

    popupContainer.style.display = "block";

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const targetsEditLoader = document.getElementById("targetsEditLoader");
        targetsEditLoader.style.display = "block";

        // Create an object to represent the data
        const dataObject = {};
        for (let i = 0; i < centersList.length; i++) {
            const inputField = form.querySelector(`input[name="data${i}"]`);
            const value = inputField.value;
            dataObject[i + 1] = parseFloat(value); // Assuming you want to send numeric values
        }
        valuesTarget = Object.values(dataObject);
        
        const url = 'http://isdom.online/dash_board/update-targets'

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObject),
        })
            .then(() => {
                popupContainer.style.display = 'none';

                centers_ip_graph.data.datasets[2].data = Object.values(dataObject) || 0;
                centers_ip_graph.update();

                targetsEditLoader.style.display = "none";
            })
    });

});


document.getElementById('closePopupBtn').addEventListener('click', function () {
    document.getElementById('popupContainer').style.display = 'none';
});