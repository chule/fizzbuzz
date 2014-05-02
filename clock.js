// seconds
var vis = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("class", "clock");


var intervals = function() {
    var date = new Date();

    var seconds = date.getSeconds();
    var totalSeconds = 60;

    var minutes = date.getMinutes();
    var hour = date.getHours();

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    var daysInCurrentMonth = (function() {
        var today = new Date();
        lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return lastDayOfMonth.toString().split(' ')[2];
    }());

    var dayInCurrentMonth = (function() {
        var arr = (new Date()).toString().split(' ');
        return arr[2];
    }());

    var daysLeftInMonth = (function() {
        return daysInCurrentMonth - dayInCurrentMonth;
    }());


    // day of year , days left in year
    var dayOfYear = (function() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }());

    circleFuction(seconds, totalSeconds, 60, "seconds");
    circleFuction(minutes, 60, 90, "minutes");
    circleFuction(hour, 24, 120, "hours");
    circleFuction(dayInCurrentMonth, daysInCurrentMonth, 150, "dayInCurrentMonth");
    circleFuction(dayOfYear, 365, 180, "dayOfYear");

};




var circleFuction = function(current, total, radius, what) {


    d3.select("g ." + what).remove();

    var group = vis.append("g").attr("class", what);



    var r = radius;
    var p = Math.PI * 2;


    var data = d3.range(total),
        data1 = d3.range(current),
        angle = d3.scale.ordinal().domain(data).rangeBands([0, 2 * Math.PI]),
        angle1 = d3.scale.ordinal().domain(data1).rangeBands([0, (2 * Math.PI) * current / total]);

    var arc1 = d3.svg.arc()
        .innerRadius(r - 10)
        .outerRadius(r)
        .startAngle(function(d) {
            return angle1(d);
        })
        .endAngle(function(d) {
            return angle1(d) + angle1.rangeBand() / 1.5;
        });

    group.selectAll("path")
        .data(data1)
        .enter().append("path")
        .attr("d", arc1)
        .attr("class", function() {
            return "blue " + what + "";
        });

    var arc = d3.svg.arc()
        .innerRadius(r - 10)
        .outerRadius(r)
        .startAngle(function(d) {
            return angle(d);
        })
        .endAngle(function(d) {
            return angle(d) + angle.rangeBand() / 1.5;
        });

    group.selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", arc)
        .attr("class", function() {
            return "grey " + what + "";
        });
};




setInterval(intervals, 1000);