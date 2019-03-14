/* function封装js文件，供C#后台调用 */
/* 无车原因页代码-- */

/*  渲染左侧echarts地图 */
var dom = document.getElementById("carMapChart");
var myChart = echarts.init(dom);
$.get('/data/map.json', function (geoJson) {
    echarts.registerMap('chaoyang', geoJson, {});
    var option = {
        // title: {
        //     text: '当日无车区域展示',
        //     left: 'center',
        //     top: 40,
        //     textStyle: {
        //         fontSize: 24,
        //         color: '#fff',
        //         fontWeight: 400,
        //     }
        // },
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>'
        },
        // backgroundColor: '#8ba4d8b8',
        visualMap: { //自定义视觉映射
            show: false,
            min: 0,
            max: 300,
            text: ['High', 'Low'],
            left: 'left',
            realtime: false,
            calculable: true,
            inRange: {
                color: ['#d94e5d', '#eac736', '#50a3ba']
            }
        },
        series: [{
            name: '朝阳120各分区突发事件统计',
            type: 'map',
            mapType: 'chaoyang',
            aspectScale: 1, //地图长宽比
            label: { //图形上的文本标签---对应json数据上的多边形分区name值
                normal: { //正常时的样式
                    show: true,
                    textStyle: {
                        color: '#ef5400',
                        fontSize: 18,
                    }
                },
                emphasis: { //高亮时的样式设置
                    show: true,
                    textStyle: {
                        color: 'red'
                    }
                }
            },
            data: [{
                    name: '朝阳区',
                    value: 0
                },
                {
                    name: '上分区', //只有与json数据上的多边形分区name值对应才可以显示颜色
                    value: 80 //value值对应颜色映射的取值
                },
                {
                    name: '下分区',
                    value: 180
                },
                {
                    name: '右上分区',
                    value: 250
                },

            ],
            itemStyle: { //地图区域的多边形 图形样式。
                borderColor: '#fff', //图形的描边颜色
                borderWidth: 1,
                borderType: 'dashed',

            },
            markPoint: { //默认情况下，标记会居中置放在数据对应的位置，
                symbol: 'pin', //钉子形
                symbolSize: 100,
                itemStyle: {
                    normal: {
                        color: '#4b96ff'
                    }
                },
                label: { //标注的文本。
                    normal: {
                        show: true,
                        formatter: function (d) { //文本 回调函数格式：(params: Object|Array) => string
                            return d.name + "\t" + d.value + "次"
                        },
                        textStyle: {
                            fontSize: 18,
                            fontFamily: '微软雅黑',
                            color: '#fff'
                        },
                        position: 'inside',
                    }
                },
                data: [{
                        name: "无车",
                        coord: [116.556937, 39.93331], //标注的坐标点
                        value: 20
                    },
                    // {
                    //     name: "通州区",
                    //     coord: [116.552471, 39.761261],
                    // }
                ],
            },
        }]
    };
    myChart.setOption(option);

});

/* 渲染右侧echarts饼图 */
var timeId;

function renderRightPieChart(data) {
    var colors = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', // 系列颜色
        '#eedd78', '#73a373', '#73b9bc', '#91ca8c', '#f49f42'
    ];
    var titleFontSize = 24;
    var labelFontSize = 18;
    var dom = document.getElementById("noCarPieChart");
    var noCarPieChart = echarts.init(dom, 'vintage'); //ECharts 实例

    option = {
        color: colors,
        legend: {
            orient: 'horizontal',
            left: 'center',
            bottom: '5%',
            // width:'90%',
            // padding:200,
            data: getLegendData(data),
            itemGap: 20,
            formatter: function (name) {
                var total = 0;
                var target;
                for (var i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name == name) {
                        target = data[i].value;
                    }
                }
                var arr = [
                    '{a|' + ((target / total) * 100).toFixed(2) + '%}',
                    '{b|' + name + '}',
                ]
                // return name + ' ' + ((target/total)*100).toFixed(2) + '%';
                return arr.join('\n')
            },
            textStyle: {
                fontSize: labelFontSize,
                color: '#fff',
                rich: {
                    a: {
                        fontSize: 20,
                        verticalAlign: 'top',
                        align: 'center',
                        padding: [0, 0, 28, 0]
                    },
                    b: {
                        fontSize: 16,
                        align: 'center',
                        padding: [0, 10, 0, 0],
                        lineHeight: 25
                    }
                }
            },
        },
        grid: {
            top: '25%',
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            // position: function (point, params, dom, rect, size) {
            //     // 固定在顶部
            //     return [point[0], '10%'];
            // }
        },
        backgroundColor: 'transparent',
        series: [{
            name: '当日无车原因',
            type: 'pie',
            radius: '60%',
            center: ['50%', '40%'],
            data: data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                color: '#fff',
                fontSize: labelFontSize,
            },
            labelLine: {
                // show:false,
                lineStyle: {
                    // color:'#fff',
                }
            }
        }]
    };

    noCarPieChart.setOption(option);
    // 2019-03-12 plq 饼图扇区高亮自动切换
    autoDispatchAction(noCarPieChart, option);
}


/* function: 解析data,根据data数据格式解析获取其中的图例数组 */
function getLegendData(data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        arr.push(data[i].name);
    }
    return arr;
}

//function: 主动触发echarts实例高亮行为，实现扇区高亮自动切换。参数1：echarts实例；参数2：option配置对象
function autoDispatchAction(myChart, option) {
    var app = {
        currentIndex: -1 //初始数据索引值---通过其指定高亮的某个数据
    };

    timeId = setInterval(function () {
        var dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        myChart.dispatchAction({
            type: 'downplay', //取消高亮指定的数据图形。
            seriesIndex: 0, // 可选，系列 index
            dataIndex: app.currentIndex // 可选，数据的 index
        });
        app.currentIndex = (app.currentIndex + 1) % dataLen;
        // 高亮当前图形---通过seriesName或者seriesIndex指定系列。通过指定dataIndex或者name再指定某个数据。
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
        // 显示 tooltip
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: app.currentIndex
        });
    }, 3000);
}
