const centersIPDateDropdown = document.getElementById('centersIP-dateRangeDropdown-total');
var centersList = [];
var modifiedDataTarget = 0;
//updateTotalOPGraph
function updateTotalOPGraph(startDate, endDate) {

    const opGraphURL1 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=اسمدة عضوية&startDate=${startDate}&endDate=${endDate}`; // اسمدة عضوية
    const opGraphURL2 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=وقود بديل&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const opGraphURL3 = `http://isdom.online/dash_board/tickets/output-rejected/weight-list?startDate=${startDate}&endDate=${endDate}`; // مفروزات
    const opGraphURL4 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=مفروزات&startDate=${startDate}&endDate=${endDate}`; // مرفوضات


    fetch(opGraphURL1)
        .then(response => response.json())
        .then(data => {
            const category1Values = data;

            fetch(opGraphURL2)
                .then(response => response.json())
                .then(data => {
                    const category2Values = data;

                    fetch(opGraphURL3)
                        .then(response => response.json())
                        .then(data => {
                            const category3Values = data;

                            fetch(opGraphURL4)
                                .then(response => response.json())
                                .then(data => {
                                    const category4Values = data;

                                    // Update the chart data dynamically
                                    tot_out_grph.load({
                                        columns: [
                                            ['وقود بديل', ...category2Values],
                                            ['مفروزات', ...category4Values],
                                            ['اسمدة عضوية', ...category1Values],
                                            ['مرفوضات', ...category3Values]
                                        ]
                                    });
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
                    // console.log(data);

                    const category2Values = data;

                    // Update the chart data dynamically
                    tot_in_out_grph.load({
                        columns: [
                            ['مدخلات', ...category1Values],
                            ['مخرجات', ...category2Values]
                        ]
                    });
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

                    // Update the chart data dynamically
                    tot_in_grph.load({
                        columns: [
                            ['مخلفات تصلح للمعالجة', ...category1Values],
                            ['مخلفات لا تصلح للمعالجة', ...category2Values]
                        ]
                    });
                })
                .catch(error => {
                    // console.error('Error:', error);
                });
        })
        .catch(error => {
            // console.error('Error:', error);
        });
}

function updateCentersInputGraph_total() {
    const selectedDate = centersIPDateDropdown.value;

    let startDatex, endDatex;
    var numberOfDays;

    if (selectedDate === 'today') {
        numberOfDays = 1;
        startDatex = moment().format('DD-MMM-YY');
        endDatex = moment().format('DD-MMM-YY');
    } else if (selectedDate === 'yesterday') {
        numberOfDays = 1;
        startDatex = moment().subtract(1, 'days').format('DD-MMM-YY');
        endDatex = moment().subtract(1, 'days').format('DD-MMM-YY');
    } else if (selectedDate === 'last7days') {
        numberOfDays = 7;
        startDatex = moment().subtract(7, 'days').format('DD-MMM-YY');
        endDatex = moment().format('DD-MMM-YY');
    } else if (selectedDate === 'last14days') {
        numberOfDays = 14;
        startDatex = moment().subtract(14, 'days').format('DD-MMM-YY');
        endDatex = moment().format('DD-MMM-YY');
    } else if (selectedDate === 'lastMonth') {
        startDatex = moment().subtract(1, 'months').startOf('month').format('DD-MMM-YY');
        endDatex = moment().subtract(1, 'months').endOf('month').format('DD-MMM-YY');

        const startDate = moment(startDatex, 'DD-MMM-YY');
        const endDate = moment(endDatex, 'DD-MMM-YY');
        numberOfDays = endDate.diff(startDate, 'days') + 1;
    }

    const urlReal = `http://isdom.online/dash_board/tickets/centers-net-weight-list?itemType=مدخلات&startDate=${startDatex}&endDate=${endDatex}`; // وقود بديل
    const urlTarget = `http://isdom.online/dash_board/targets`; // وقود بديل

    // const storedData = JSON.parse(localStorage.getItem('labelData')) || [];
    //
    // const modifiedData = storedData.map(value => value * numberOfDays);

    Promise.all([
        fetch(urlReal).then(responseReal => responseReal.json()),
        fetch(urlTarget).then(responseTarget => responseTarget.json())
    ]).then(([dataReal, dataTarget]) => {
        centersList = Object.keys(dataReal);
        const valuesReal = Object.values(dataReal);
        const valuesTarget = Object.values(dataTarget);
        modifiedDataTarget = valuesTarget.map(value => value * numberOfDays);

        centers_ip_graph.load({
            columns: [
                ['الكميات الموردة', ...valuesReal],
                ['الكميات المستهدفة', ...modifiedDataTarget]
            ],
            categories: centersList
        });

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
                        document.getElementById("accepted_per").textContent = percentage.toFixed(1) + "%";
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
                        document.getElementById("rejected_per").textContent = percentage.toFixed(1) + "%";
                })
                .catch(error => {
                    console.error('Error:', error);
                });
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

    // Initialize the total-ip-op-graph component
    tot_in_out_grph = c3.generate({
        bindto: "#total-ip-op-graph",
        size: {height: 350},
        legend: {
            padding: {
                left: 5
            }
        },
        axis: {
            x: {
                type: 'category',
                categories: ['أجا', 'سندوب', 'بلقاس', 'السنبلاوين', 'المنزلة']
            }
        },
        data: {
            columns: [
                ['مدخلات', 0, 0, 0, 0, 0],
                ['مخرجات', 0, 0, 0, 0, 0]
            ],
            type: "bar",
            colors: {'مدخلات': "#ef601c", 'مخرجات': "#36ca0f"}
        },
        grid: {y: {show: true}}
    });

    tot_in_grph = c3.generate({
        bindto: "#total-input-graph",
        size: {height: 350},
        legend: {
            padding: {
                left: 5
            }
        },
        axis: {
            x: {
                type: 'category',
                categories: ['أجا', 'سندوب', 'بلقاس', 'السنبلاوين', 'المنزلة']
            }
        },
        data: {
            columns: [
                ['مخلفات تصلح للمعالجة', 0, 0, 0, 0, 0],
                ['مخلفات لا تصلح للمعالجة', 0, 0, 0, 0, 0]
            ],
            type: "bar",
            colors: {'مخلفات تصلح للمعالجة': "#ffa014", 'مخلفات لا تصلح للمعالجة': "#d81415"}
        },
        grid: {y: {show: true}}
    });

    tot_out_grph = c3.generate({
        bindto: "#total-output-graph",
        size: {height: 350},
        legend: {
            padding: {
                left: 5
            }
        },
        axis: {
            x: {
                type: 'category',
                categories: ['أجا', 'سندوب', 'بلقاس', 'السنبلاوين', 'المنزلة'] // specify the categories/names on the x-axis
            }
        },
        data: {
            columns: [
                ['وقود بديل', 0, 0, 0, 0, 0],
                ['مفروزات', 0, 0, 0, 0, 0],
                ['اسمدة عضوية', 0, 0, 0, 0, 0],
                ['مرفوضات', 0, 0, 0, 0, 0]
            ],
            type: "bar",
            colors: {'اسمدة عضوية': "#2da075", 'وقود بديل': "#1427c9", 'مفروزات': "#2d66d9", 'مرفوضات': "#10d6b4"}
        },
        grid: {y: {show: !0}}
    });

    centers_ip_graph = c3.generate({
        bindto: "#centers-ip-graph",
        size: {height: 350},
        legend: {},
        axis: {
            x: {
                type: 'category',
                categories: [],
                tick: {
                    rotate: -20,
                    multiline: false
                },
                legend: {
                    inset: {
                        anchor: 'bottom-right',
                        x: 90,
                        y: 10,
                        step: 2
                    }
                },
                height: 35
            }
        },
        data: {
            columns: [
                ['الكميات الموردة', []],
                ['الكميات المستهدفة', []] // Initialize with an empty array
            ],
            type: "bar",
            colors: {
                'الكميات الموردة': "#ef601c",
                'الكميات المستهدفة': "#6C0C0C"
            }
        },
        grid: {y: {show: true}}
    });

    // Set the initial values for the components
    updateTotalOPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotalIPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotalIPOPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
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
    updateCentersInputGraph_total();

    // Listen for changes in the date range picker and update the components accordingly
    $dateRangePicker.on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('DD-MMM-YY');
        const endDate = picker.endDate.format('DD-MMM-YY');

        updateTotalOPGraph(startDate, endDate);
        updateTotalIPGraph(startDate, endDate);
        updateTotalIPOPGraph(startDate, endDate);
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
    const form = document.getElementById("dataInputForm");

    // Clear any existing form elements
    form.innerHTML = '';

    // Retrieve data from local storage
    const storedData = JSON.parse(localStorage.getItem('labelData'));

    // Loop to generate input fields with labels
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

        // Set the input value from the stored data
        if (modifiedDataTarget && modifiedDataTarget[i]) {
            input.value = modifiedDataTarget[i];
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

        console.log('modifiedDataTarget')
        console.log(modifiedDataTarget)

        centers_ip_graph.load({
            columns: [
                ['الكميات المستهدفة', ...modifiedDataTarget]
            ],
        });
    });

});


document.getElementById('closePopupBtn').addEventListener('click', function () {
    document.getElementById('popupContainer').style.display = 'none';
});
