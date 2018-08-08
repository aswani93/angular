// ACCESS POINT

/**** DOWNLINK TRAFFIC IN ACCESS POINT ****/
Highcharts.chart('downLinkTraffic', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: '(TB)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 0.8
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: new Date().getSeconds(),
            pointInterval: 10 // one day
        }
    },

    series: [{
        name: 'Total',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#f4516c'
    }, {
        name: 'Downlink',
        data: [1.2, 2.5, 2.6, 3.1, 2.6, 0.8],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#ffb822'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

/**** CLIENTS (TOP 5) ****/
Highcharts.chart('topBusiestClients', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: '(Mb/s)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 200
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        }
    },

    series: [{
        name: 'Client 1',
        data: [100, 235, 102, 336, 425, 300, 256, 400],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#00c5dc'
    }, {
        name: 'Client 2',
        data: [253, 125, 100, 125, 365, 400, 523, 600],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#ffb822'
    }, {
        name: 'Client 3',
        data: [321, 125, 215, 356, 256, 156, 348, 400],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#f4516c'
    }, {
        name: 'Client 4',
        data: [512, 425, 326, 456, 236, 154, 235, 356],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#716aca'
    }, {
        name: 'Client 5',
        data: [356, 256, 365, 526, 458, 256, 365, 564],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#34bfa3'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

/**** CPU AND MEMORY UTILIZATION ****/
Highcharts.chart('cpuAndMemory', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: '(% Percentage)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 10
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 168 * 3600 * 1000 // one day
        }
    },

    series: [{
        name: 'CPU',
        data: [10, 12, 30, 20, 40, 20, 10, 30],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#a377ec'
    }, {
        name: 'Memory',
        data: [20, 22, 32, 12, 23, 21, 30, 40],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#fa894e'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

/**** CLIENT DISTRIBUTION ****/
Highcharts.chart('clientDistribution', {
    chart: {
        type: 'column'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 1
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        }
    },

    series: [{
        name: 'Windows',
        data: [1, 2, 1, 3, 4, 3, 2, 4],
        marker : {symbol : 'square'},
        color: '#44b2d7'
    }, {
        name: 'Mac',
        data: [2, 1, 3, 1, 3, 4, 5, 6],
        marker : {symbol : 'square'},
        color: '#ffb822'
    }, {
        name: 'iOS',
        data: [3, 1, 2, 3, 2, 1, 3, 4],
        marker : {symbol : 'square'},
        color: '#f4516c'
    }, {
        name: 'Android',
        data: [5, 4, 3, 4, 2, 1, 2, 3],
        marker : {symbol : 'square'},
        color: '#34bfa3'
    }, {
        name: 'Linux',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        marker : {symbol : 'square'},
        color: '#fa8c53'
    }, {
        name: 'Others',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        marker : {symbol : 'square'},
        color: '#bcc0c7'
    }, {
        name: 'Total Clients',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        marker : {symbol : 'square'},
        color: '#716aca'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

/**** TOTAL CLIENTS PIE CHART ****/
Highcharts.chart('clientDistributionPie', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Total Clients<br>2000',
        align: 'center',
        verticalAlign: 'middle',
        y: 0,
        style: {
            color: '#7f79cf',
            fontWeight: 'bold'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50
            },
            center: ['50%', '50%'],
            shadow: false,
            borderWidth: 0
        }
    },
    series: [{
        type: 'pie',
        name: 'Total Clients',
        pointPadding: 0,
        groupPadding: 0,
        innerSize: '70%',
        data: [
            {
                name: 'Windows',
                y: 40.33,
                color: '#44b2d7',
                dataLabels: {
                    distance: 30,
                    color: '#44b2d7'
                }
            }, {
                name: 'Mac',
                y: 30.03,
                color: '#ffb822',
                dataLabels: {
                    distance: 30,
                    color: '#ffb822'
                }
            }, {
                name: 'Others',
                y: 10.38,
                color: '#bcbfc7',
                dataLabels: {
                    distance: 30,
                    color: '#bcbfc7'
                }
            }, {
                name: 'Android',
                y: 4.77,
                color: '#34bfa3',
                dataLabels: {
                    distance: 30,
                    color: '#34bfa3'
                }
            }, {
                name: 'iOS',
                y: 6.91,
                color: '#f4516c',
                dataLabels: {
                    distance: 30,
                    color: '#f4516c'
                }
            }, {
                name: 'Linux',
                y: 5.91,
                color: '#fa8c53',
                dataLabels: {
                    distance: 30,
                    color: '#fa8c53'
                }
            }
        ]
    }]
});

/**** CHANNEL INTERFERENCE ****/
Highcharts.chart('channelInterference', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: 'Amplitude (dBm)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 1
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        symbolWidth: 5,
        enabled: false
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        },
        line: {
            marker: {
                enabled: false
            }
        }
    },

    series: [{
        name: 'SSID 1',
        data: [1, 2, 1, 3, 4, 3, 2, 4],
        marker : {symbol : 'square'},
        color: '#44b2d7'
    }, {
        name: 'SSID 2',
        data: [2, 1, 3, 1, 3, 4, 5, 6],
        marker : {symbol : 'square'},
        color: '#ffb822'
    }, {
        name: 'SSID 5',
        data: [3, 1, 2, 3, 2, 1, 3, 4],
        marker : {symbol : 'square'},
        color: '#f4516c'
    }, {
        name: 'SSID 3',
        data: [5, 4, 3, 4, 2, 1, 2, 3],
        marker : {symbol : 'square'},
        color: '#34bfa3'
    }, {
        name: 'SSID 4',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        marker : {symbol : 'square'},
        color: '#fa8c53'
    }, {
        name: 'SSID 6',
        data: [3, 2, 3, 5, 4, 2, 3, 5],
        marker : {symbol : 'square'},
        color: '#716aca'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

// GROUP

/*** DOWNLINK TRAFFIC IN GROUP ***/
Highcharts.chart('groupDownLinkTraffic', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: '(TB)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 0.8
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: new Date().getSeconds(),
            pointInterval: 10 // one day
        }
    },

    series: [{
        name: 'Total',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#00c5dc'
    }, {
        name: 'Downlink',
        data: [1.2, 2.5, 2.6, 3.1, 2.6, 0.8],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#ffb822'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

/*** ONLINE ACCESS POINTS ***/
Highcharts.chart('onlineAccessPoints', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 10
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5,
        enabled: false
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 168 * 3600 * 1000 // one day
        }
    },

    series: [{
        name: 'Total',
        data: [10, 12, 30, 20, 40, 20, 10, 30],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#716aca'
    }, {
        name: 'Online',
        data: [20, 22, 32, 12, 23, 21, 30, 40],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#34bfa3'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});


/*** ACCESS POINTS MODEL ***/
Highcharts.chart('accessPointsModel', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Total APs<br>2000',
        align: 'center',
        verticalAlign: 'middle',
        y: 0,
        style: {
            color: '#7f79cf',
            fontWeight: 'bold'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50
            },
            center: ['50%', '50%'],
            shadow: false,
            borderWidth: 0
        }
    },
    series: [{
        type: 'pie',
        name: 'Total Clients',
        pointPadding: 0,
        groupPadding: 0,
        innerSize: '70%',
        data: [
            {
                name: 'Model A (500)',
                y: 40.33,
                color: '#44b2d7',
                dataLabels: {
                    distance: 30,
                    color: '#44b2d7'
                }
            }, {
                name: 'Model B (400)',
                y: 30.03,
                color: '#ffb822',
                dataLabels: {
                    distance: 30,
                    color: '#ffb822'
                }
            }, {
                name: 'Model C (350)',
                y: 4.77,
                color: '#34bfa3',
                dataLabels: {
                    distance: 30,
                    color: '#34bfa3'
                }
            }, {
                name: 'Model D (350)',
                y: 6.91,
                color: '#f4516c',
                dataLabels: {
                    distance: 30,
                    color: '#f4516c'
                }
            }, {
                name: 'Model E (250)',
                y: 5.91,
                color: '#fa8c53',
                dataLabels: {
                    distance: 30,
                    color: '#fa8c53'
                }
            }, {
                name: 'Model F (150)',
                y: 10.38,
                color: '#bcbfc7',
                dataLabels: {
                    distance: 30,
                    color: '#bcbfc7'
                }
            }
        ]
    }]
});

/**** ACCESS POINTS (TOP 5) *****/
Highcharts.chart('topAccessPoints', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: '(Mb/s)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 200
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: Date.UTC(new Date().getFullYear(), 0, 1),
            pointInterval: 24 * 3600 * 1000 // one day
        }
    },

    series: [{
        name: 'AP 1',
        data: [100, 235, 102, 336, 425, 300, 256, 400],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#00c5dc'
    }, {
        name: 'AP 2',
        data: [253, 125, 100, 125, 365, 400, 523, 600],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#ffb822'
    }, {
        name: 'AP 3',
        data: [321, 125, 215, 356, 256, 156, 348, 400],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#f4516c'
    }, {
        name: 'AP 4',
        data: [512, 425, 326, 456, 236, 154, 235, 356],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#716aca'
    }, {
        name: 'AP 5',
        data: [356, 256, 365, 526, 458, 256, 365, 564],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#34bfa3'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});


// SSID

/**** DOWNLINK TRAFFIC IN SSID 2.4GHZ ****/
Highcharts.chart('ssidDownLinkTraffic24', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: '(TB)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 0.8
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: new Date().getSeconds(),
            pointInterval: 10 // one day
        }
    },

    series: [{
        name: 'Total',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#a377ec'
    }, {
        name: 'Downlink',
        data: [1.2, 2.5, 2.6, 3.1, 2.6, 0.8],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#00c5dc'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

/**** DOWNLINK TRAFFIC IN SSID 5GHZ ****/
Highcharts.chart('ssidDownLinkTraffic5', {
    chart: {
        type: 'line'
    },

    title: {
        text: null
    },

    subtitle: {
        text: null
    },

    xAxis: {
        type: 'datetime'
    },

    yAxis: {
        title: {
            text: '(TB)',
            style: {
                fontWeight: 'bold'
            }
        },
        labels: {
            format: '{value}'
        },
        tickInterval: 0.8
    },
    legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 5
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: new Date().getSeconds(),
            pointInterval: 10 // one day
        }
    },

    series: [{
        name: 'Total',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#f4516c'
    }, {
        name: 'Downlink',
        data: [1.2, 2.5, 2.6, 3.1, 2.6, 0.8],
        marker : {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
        },
        color: '#ffb822'
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});