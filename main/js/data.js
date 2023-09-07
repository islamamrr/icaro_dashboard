const centersIPDateDropdown = document.getElementById('centersIP-dateRangeDropdown-total');


//updateTotalOPGraph
function updateTotalOPGraph(startDate, endDate) {

    const opGraphURL1 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=اسمدة عضوية&startDate=${startDate}&endDate=${endDate}`; // اسمدة عضوية
    const opGraphURL2 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=وقود بديل&startDate=${startDate}&endDate=${endDate}`; // وقود بديل
    const opGraphURL3 = `http://isdom.online/dash_board/tickets/itemName/weight-list?itemName=مرفوضات&startDate=${startDate}&endDate=${endDate}`; // مفروزات
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
                    // console.error('Error:', error);
                });
        })
        .catch(error => {
            // console.error('Error:', error);
        });
}

//updateTotalIPOPGraph
function updateTotalIPOPGraph(startDate, endDate) {
    const ipOpGraphURL1 = `http://isdom.online/dash_board/tickets/itemType/weight-list?itemType=مدخلات&startDate=${startDate}&endDate=${endDate}`;
    const ipOpGraphURL2 = `http://isdom.online/dash_board/tickets/itemType/weight-list?itemType=مخرجات&startDate=${startDate}&endDate=${endDate}`;

    fetch(ipOpGraphURL1)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            const category1Values = data; // Assuming the API response contains the values for the first category

            // Fetch data for category2 values
            fetch(ipOpGraphURL2)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);

                    const category2Values = data; // Assuming the API response contains the values for the second category

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

    const url1 = `http://localhost:8080/tickets/net-weight?itemType=مدخلات&startDate=${startDatex}&endDate=${endDatex}`; // وقود بديل

    Promise.all([
        fetch(url1).then(response1 => response1.json())
    ]).then(([data1]) => {
        let categories = Object.keys(data1);
        const values1 = Object.values(data1);


        console.log(categories);
        console.log(values1);

        centers_ip_graph.load({
            columns: [
                ['الوزن الحقيقى', ...values1]
            ],
            categories: categories
        });

    })
        .catch(error => {
            console.error('Error:', error);
        });
}


//updateTotIPBox
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

function updateTotAccBox(startDate, endDate) {
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

function updateTotRejBox(startDate, endDate) {
    const accUrl = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مخلفات  تصلح للمعالجة&startDate=${startDate}&endDate=${endDate}`; // مخلفات تصلح للمعالجة
    const rejUrl = `http://isdom.online/dash_board/tickets/itemName/weight?itemName=مرفوضات&startDate=${startDate}&endDate=${endDate}`; // مرفوضات

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
                    // console.error('Error:', error);
                });
        })
        .catch(error => {
            // console.error('Error:', error);
        });
}

//updateTotOPBox
function updateTotOPBox(startDate, endDate) {
    const url = `http://isdom.online/dash_board/tickets/itemType/weight?itemType=مخرجات&startDate=${startDate}&endDate=${endDate}`;

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
                categories: ['أجا', 'سندوب', 'المدفن', 'بلقاس - المصنع', 'السمبلاوين', 'المنزلة']
            }
        },
        data: {
            columns: [
                ['مدخلات', 0, 0, 0, 0, 0, 0],
                ['مخرجات', 0, 0, 0, 0, 0, 0]
            ],
            type: "bar",
            colors: {'مدخلات': "#dd5182", 'مخرجات': "#444e86"}
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
                categories: ['أجا', 'سندوب', 'المدفن', 'بلقاس - المصنع', 'السمبلاوين', 'المنزلة']
            }
        },
        data: {
            columns: [
                ['مخلفات تصلح للمعالجة', 0, 0, 0, 0, 0, 0],
                ['مخلفات لا تصلح للمعالجة', 0, 0, 0, 0, 0, 0]
            ],
            type: "bar",
            colors: {'مخلفات تصلح للمعالجة': "#dd5182", 'مخلفات لا تصلح للمعالجة': "#444e86"}
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
                type: 'category', // set the x-axis as category type
                categories: ['أجا', 'سندوب', 'المدفن', 'بلقاس - المصنع', 'السمبلاوين', 'المنزلة'] // specify the categories/names on the x-axis
            }
        },
        data: {
            columns: [
                ['وقود بديل', 0, 0, 0, 0, 0, 0],
                ['مفروزات', 0, 0, 0, 0, 0, 0],
                ['اسمدة عضوية', 0, 0, 0, 0, 0, 0],
                ['مرفوضات', 0, 0, 0, 0, 0, 0]
            ],
            type: "bar",
            colors: {'اسمدة عضوية': "#ffa600", 'وقود بديل': "#ef5675", 'مفروزات': "#7a5195", 'مرفوضات': "#003f5c"}
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
            columns: [],
            type: "line",
            colors: {
                'الوزن الحقيقى': "#ef601c"
            }
        },
        grid: {y: {show: true}}
    });

    // const centers_ip_graph = c3.generate(centersIPChartOptions);


    // Set the initial values for the components
    updateTotalOPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotalIPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotalIPOPGraph(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotAccBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotRejBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotIPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateTotOPBox(moment().format('DD-MMM-YY'), moment().format('DD-MMM-YY'));
    updateCentersInputGraph_total();

    // Listen for changes in the date range picker and update the components accordingly
    $dateRangePicker.on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('DD-MMM-YY');
        const endDate = picker.endDate.format('DD-MMM-YY');

        updateTotalOPGraph(startDate, endDate);
        updateTotalIPGraph(startDate, endDate);
        updateTotalIPOPGraph(startDate, endDate);
        updateTotAccBox(startDate, endDate);
        updateTotRejBox(startDate, endDate);
        updateTotIPBox(startDate, endDate);
        updateTotOPBox(startDate, endDate);
    });
})
;
