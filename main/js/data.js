var centersList = [];
var valuesTarget = 0;

var operationsPercentages;
var operationsAccumulatedWeights;

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
                                .catch(error => {
                                    // console.error('Error:', error);
                                });
                        })
                        .catch(error => {
                            // console.error('Error:', error);
                        });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
                .catch(error => {
                    // console.error('Error:', error);
                });
        })
        .catch(error => {
            // console.error('Error:', error);
        });
}

//updateTotalIPGraph
function updateTotalIPGraph(startDate, endDate) {
    const ipGraphURL1 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const ipGraphURL2 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=مخلفات لا تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات لا تصلح للمعالجة

    fetch(ipGraphURL1)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            // console.log(data);
            const category1Values = data; // Assuming the API response contains the values for the first category

            // Fetch data for category2 values
            fetch(ipGraphURL2)
                .then(response => response.json()).catch(() => 0)
                .then(data => {
                    // console.log(data);

                    const category2Values = data; // Assuming the API response contains the values for the second category

                    tot_in_grph.data.datasets[0].data = category1Values || 0;
                    tot_in_grph.data.datasets[1].data = category2Values || 0;

                    tot_in_grph.update();
                })
                .catch(error => {
                    // console.error('Error:', error);
                });
        })
        .catch(error => {
            // console.error('Error:', error);
        });
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
        const modifiedDataTarget = valuesTarget.map(value => value * numberOfDays);


        centers_ip_graph.data.datasets[0].data = valuesReal || 0;
        centers_ip_graph.data.datasets[1].data = valuesAccepted || 0;
        centers_ip_graph.data.datasets[2].data = modifiedDataTarget || 0;
        centers_ip_graph.data.labels = centersList || 0;

        centers_ip_graph.update();
    })
        .catch(error => {
            console.error('Error:', error);
        });
}


//Input boxes
//Total input box
function updateTotIPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&startDate=${startDate}&endDate=${endDate}`;

    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data; // Assuming the API response contains the desired value
            // console.log(newValue);
            document.getElementById("tot-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            // console.error('Error:', error);
        });
}

function updateTotAccIPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-accepted-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateTotRejIPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات لا تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-rejected-ip-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//Rates boxes
function updateTotAccRateBox(startDate, endDate) {
    const accUrl = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const totInUrl = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مدخلات&startDate=${startDate}&endDate=${endDate}`;


    fetch(accUrl)
        .then(response => response.json()).catch(() => 0)
        .then(accData => {

            const accVal = accData;
            // console.log("accepted value" + accVal);
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

function updateTotRejRateBox(startDate, endDate) {
    const accUrl = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const rejUrl = `http://isdom.online/dash_board/tickets/output-rejected/weight?startDate=${startDate}&endDate=${endDate}`;

    fetch(rejUrl)
        .then(response => response.json()).catch(() => 0)
        .then(rejData => {

            const rejVal = rejData;
            // console.log("rejected value" + rejVal);
            fetch(accUrl)
                .then(response => response.json()).catch(() => 0)
                .then(accData => {
                    const accVal = accData;

                    const percentage = (rejVal / accVal) * 100;
                    if (isNaN(percentage))
                        document.getElementById("rejected_per").textContent = 0 + "%"
                    else
                        document.getElementById("rejected_per").textContent = percentage.toFixed(0) + "%";
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//Operations box
function updateInOperationBox() {
    const startDate = moment().format('DD-MMM-YY');
    const endDate = moment().format('DD-MMM-YY');

    const percentagesURL = 'http://isdom.online/dash_board/accumulated/percentage?siteNo=0';
    const accumulatedWeightsURL = 'http://isdom.online/dash_board/accumulated/weight?siteNo=0'
    const acceptedInputURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const asmedaURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=اسمدة عضوية&startDate=${startDate}&endDate=${endDate}`; // اسمدة عضوية
    const waqoodURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=وقود بديل&&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const marfoodatURL = `http://isdom.online/dash_board/tickets/output-rejected/weight?startDate=${startDate}&endDate=${endDate}`; // مرفوضات
    const mafroozatURL = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مفروزات&startDate=${startDate}&endDate=${endDate}`; // مفروزات


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

    })
        .catch(error => {
            console.error('Error:', error);
        });
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
        .catch(error => {
            // console.error('Error:', error);
        });
}

function updateTotAsmedaOPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=اسمدة عضوية&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-asmeda-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateTotWaqoodOPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=وقود بديل&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-waqood-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateTotMarfoodatOPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/output-rejected/weight?startDate=${startDate}&endDate=${endDate}`;
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-marfoodat-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateTotMafroozatOPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مفروزات&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    fetch(url)
        .then(response => response.json()).catch(() => 0)
        .then(data => {
            const newValue = data;
            document.getElementById("tot-mafroozat-op-box").textContent = newValue + " طن";
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


var tot_in_out_grph;
var tot_out_grph;
var tot_in_grph;
var centers_ip_graph;

$dateRangePicker = $('#dateRangePicker');
// Initialize the date range picker
$(document).ready(function () {

    updateInOperationBox();
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
    updateTotalIPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotalIPOPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateCentersInputGraph_total(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotAccRateBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotRejRateBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotAccIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotRejIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotAsmedaOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotWaqoodOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotMarfoodatOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotMafroozatOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));

    // Listen for changes in the date range picker and update the components accordingly
    $dateRangePicker.on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('DD-MMM-YY');
        const endDate = picker.endDate.format('DD-MMM-YY');

        updateTotalOPGraph(startDate, endDate);
        updateTotalIPGraph(startDate, endDate);
        updateTotalIPOPGraph(startDate, endDate);
        updateCentersInputGraph_total(startDate, endDate);
        updateTotAccRateBox(startDate, endDate);
        updateTotRejRateBox(startDate, endDate);
        updateTotIPBox(startDate, endDate);
        updateTotAccIPBox(startDate, endDate);
        updateTotRejIPBox(startDate, endDate);
        updateTotOPBox(startDate, endDate);
        updateTotAsmedaOPBox(startDate, endDate);
        updateTotWaqoodOPBox(startDate, endDate);
        updateTotMarfoodatOPBox(startDate, endDate);
        updateTotMafroozatOPBox(startDate, endDate);
    });
});

document.getElementById('openPopupBtn').addEventListener('click', function () {
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

        // Create an object to represent the data
        const dataObject = {};
        for (let i = 0; i < centersList.length; i++) {
            const inputField = form.querySelector(`input[name="data${i}"]`);
            const value = inputField.value;
            dataObject[i + 1] = parseFloat(value); // Assuming you want to send numeric values
        }

        const url = 'http://isdom.online/dash_board/update-targets'

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObject),
        })
            .then(response => {
                if (response.ok) {
                    console.log('Data successfully saved to the database.');
                } else {
                    console.error('Failed to save data to the database.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        popupContainer.style.display = 'none';

        // centers_ip_graph.load({
        //     columns: [
        //         ['الكميات المستهدفة', ...valuesTarget]
        //     ],
        // });

        centers_ip_graph.data.datasets[1].data = valuesTarget || 0;
        centers_ip_graph.update();

    });

});


document.getElementById('closePopupBtn').addEventListener('click', function () {
    document.getElementById('popupContainer').style.display = 'none';
});


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

        const urlPercentage = 'http://isdom.online/dash_board/accumulated/update-percentage/0'
        const urlAccuWeight = 'http://isdom.online/dash_board/accumulated/update-weight/0'

        fetch(urlPercentage, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataObjectPercentage),
        })
            .then(response => {
                if (response.ok) {
                    console.log('Data successfully saved to the database.');
                } else {
                    console.error('Failed to save data to the database.');
                }
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
            .then(response => {
                if (response.ok) {
                    console.log('Data successfully saved to the database.');
                } else {
                    console.error('Failed to save data to the database.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        popupContainerOperations.style.display = 'none';
    });

});

document.getElementById('closeOperationsPopupBtn').addEventListener('click', function () {
    document.getElementById('popupContainerOperations').style.display = 'none';
});