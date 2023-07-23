//[Dashboard Javascript]

//Project:	Florence Admin - Responsive Admin Template
//Primary use:   Used only for the main dashboard (index.html)


$(function () {

    'use strict';


    var options = {
        series: [{
            name: "Revenue",
            data: [60, 71, 75, 91, 80, 70]
        }],
        chart: {
            height: 150,
            type: 'area',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'stepline'
        },
        colors: ['#5949d6'],
        grid: {
            show: false,
            padding: {
                top: 0,
                bottom: -20,
                right: 0,
                left: -10
            },
        },

        legend: {
            show: false,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },

        yaxis: {
            labels: {
                show: false,
            }
        },
    };

    var chart = new ApexCharts(document.querySelector("#revenue1"), options);
    chart.render();


    var options = {
        series: [{
            name: "Revenue",
            data: [91, 80, 70, 60, 71, 75]
        }],
        chart: {
            height: 150,
            type: 'area',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'stepline'
        },
        colors: ['#ea9715'],
        grid: {
            show: false,
            padding: {
                top: 0,
                bottom: -20,
                right: 0,
                left: -10
            },
        },

        legend: {
            show: false,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },

        yaxis: {
            labels: {
                show: false,
            }
        },
    };

    var chart = new ApexCharts(document.querySelector("#revenue2"), options);
    chart.render();


    var options = {
        series: [{
            name: 'Download',
            data: [44, 55, 57, 56, 61, 58, 37]
        }, {
            name: 'User',
            data: [76, 85, 101, 98, 87, 105, 52]
        }],
        chart: {
            type: 'bar',
            height: 325
        },
        colors: ['#13ED8F', '#2C50EE'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        fill: {
            opacity: 1
        }
    };

    var chart = new ApexCharts(document.querySelector("#subscriptions-trend"), options);
    chart.render();


    var optionsArea = {
        chart: {
            height: 325,
            type: 'line',
            stacked: false,
            zoom: {
                enabled: false
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        stroke: {
            curve: 'straight',
            width: 2
        },
        colors: ['#444e86', '#dd5182'],
        series: [
            {
                name: "مخلفات مقبولة",
                data: [36, 15, 36, 23, 27, 13, 45, 23, 12]
            },
            {
                name: "مخلفات لا تصلح للمعالجة",
                data: [23, 21, 30, 19, 32, 25, 45, 25, 12]
            }
        ],
        grid: {
            show: true,
            padding: {
                left: 0,
                right: 0
            }
        },
        yaxis: {
            show: false
        },
        xaxis: {
            categories: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            tooltip: {
                enabled: false
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        }
    }

    var chartArea = new ApexCharts(document.querySelector('#revenue-trend'), optionsArea);
    chartArea.render();

    var optionsArea2 = {
        chart: {
            height: 325,
            type: 'line',
            stacked: false,
            zoom: {
                enabled: false
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        stroke: {
            curve: 'straight',
            width: 2
        },

        colors: ['#ef5675', '#ffa600', '#7a5195', '#003f5c'],
        series: [
            {
                name: "وقود مشتق",
                data: [8, 20, 23, 20, 13, 10, 13, 10, 13]
            },
            {
                name: "سماد عضوي",
                data: [2, 4, 0, 7, 0, 0, 3, 6, 4]
            },
            {
                name: "مفروزات",
                data: [10, 10, 25, 5, 15, 5, 15, 10, 5]
            },
            {
                name: "مرفوضات",
                data: [23, 21, 22, 20, 12, 25, 15, 10, 12]
            }
        ],
        grid: {
            show: true,
            padding: {
                left: 0,
                right: 0
            }
        },
        yaxis: {
            show: false
        },
        xaxis: {
            categories: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            tooltip: {
                enabled: false
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right'
        }
    }

    var chartArea = new ApexCharts(document.querySelector('#revenue-trend2'), optionsArea2);
    chartArea.render();


    var optionDonut = {
        chart: {
            type: 'donut',
            width: '100%',
            height: 280
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + "%"
            },
            style: {
                fontSize: '16px',
                fontWeight: 'normal',
            },
        },
        plotOptions: {
            pie: {
                customScale: 0.9,
                donut: {
                    size: '50%',
                },
                offsetY: 0,
            },
            stroke: {
                colors: undefined
            }
        },
        colors: ['#2C50EE', '#0E8DEA', '#43C1EA', '#F2F3F7'],
        series: [60, 8, 12, 20],
        labels: ['Bananas', 'Bloom', 'CraftShoes', 'Coral'],
        legend: {
            show: false,
        }
    }

    var donut = new ApexCharts(
        document.querySelector("#shops-trend"),
        optionDonut
    )
    donut.render();

    var options = {
        series: [44, 55, 67, 83],
        chart: {
            height: 385,
            type: 'radialBar',
        },
        colors: ['#2C50EE', '#0E8DEA', '#43C1EA', '#F2F3F7'],
        stroke: {
            lineCap: "round",
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: '30px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w) {
                            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                            return 249
                        }
                    }
                }
            }
        },
        labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
    };

    var chart = new ApexCharts(document.querySelector("#revenue7"), options);
    chart.render();


}); // End of use strict
