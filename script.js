var fizzBuzzGame = function () {
    d3.select('svg').remove();

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    var fizzesAndBuzzes = [];

    var fizzBuzz = function (count) {
        var arr = [];
        for (var i = 1; i <= count; i += 1) {
            if ((i % 3 === 0) && (i % 5 === 0)) {
                var fizzbuzz = {};
                fizzbuzz.label = 'FizzBuzz';
                fizzbuzz.value = i;
                arr.push(fizzbuzz);
                fizzesAndBuzzes.push(i);
            } else if (i % 3 === 0) {
                var fizz = {};
                fizz.label = 'Fizz';
                fizz.value = i;
                arr.push(fizz);
                fizzesAndBuzzes.push(i);
            } else if (i % 5 === 0) {
                var buzz = {};
                buzz.label = 'Buzz';
                buzz.value = i;
                arr.push(buzz);
                fizzesAndBuzzes.push(i);            
            } else {
                var obj = {};
                obj.label = i;
                obj.value = i;
                arr.push(obj);
            }
        }
        return arr;
    }(100);

    //var randomNum = fizzesAndBuzzes[Math.floor(Math.random() * fizzesAndBuzzes.length)];
    var randomNum = 100;

    var width = 800,
        height = 700;

    var rScale = d3.scale.linear()
        .domain([1, 100])
        .range([10, 30]);

    fizzBuzz.forEach(function (item) {
        item.radius = rScale(item.value);
    });

    var force = d3.layout.force()
        .gravity(0.05)
        .charge(function (d, i) {
        return d.radius * -1;
    })
        .nodes(fizzBuzz)
        .size([width, height]);


    var root = fizzBuzz[0];

    var drag = d3.behavior.drag()
        .origin(function (d) {
        return d;
    })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);


    force.start();

    var svg = d3.select('#map')
        .append('svg')
        .attr({
        "width": width,
        "height": height
    });

    svg.append('text').text('Pronađi broj ' + randomNum + '.')
    .attr({
        "class": "opis",
        "x": 50,
        "y": 30
    });    

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(fizzBuzz)
        .enter().append("g")
        .attr("class", "node").call(drag);

    var circles = node.append('circle')
        .attr('class', 'circle')
        .style('fill', function (d, i) {
        return d3.rgb(200, 255 - (i * 2.55), 20);
    })
        .attr('r', function (d, i) {
        return rScale(d.value);
    });    


    var labels = node.append('text')
        .text(function (d, i) {
        return d.label;
    }).attr('class', 'nodetext')
        .attr({
        "alignment-baseline": "middle",
        "text-anchor": "middle"
    });




    force.on('tick', function () {
        var q = d3.geom.quadtree(fizzBuzz),
            i = 0,
            n = fizzBuzz.length;

        while (++i < n) q.visit(collide(fizzBuzz[i]));

        svg.selectAll("circle")
            .attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
            return d.y;
        });

        //svg.selectAll("text") nodetext
        svg.selectAll(".nodetext") 
            .attr("x", function (d) {
            return d.x;
        })
            .attr("y", function (d) {
            return d.y;
        });

    });

    function collide(node) {
        var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * 0.5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }
    ///

    node.on("mouseover", function (d) {

        d3.select(this).moveToFront();
        node.classed("node-active", function (o) {

        });


        d3.select(this).classed("node-active", true);
      
    });

    var counter = 0;
    node.on("click", function (d) {
        
        counter += 1;
        
        var color = d3.select(this).select("circle");

        var text = d3.select(this).select("text").text(function (d) {return d.value;});


        d3.selectAll('.attempt').remove();

        if (randomNum !== d.value) {
        svg.append('text').text(counter + ". promašaj.")
            .attr({
                "class": "attempt",
                "x": 50,
                "y": 60
            }); 
        } else if (randomNum === d.value) {
            d3.select('.opis').text("Broj je pogođen iz " + counter + ". pokušaja!")
            node.attr('pointer-events', 'none');

            var button = svg.append("g")
                .attr("transform", "translate(" + [width/2 - 50, height/2 - 20] + ")");

            button.append('rect')
                .attr({
                    "class": "button",
                    "rx": 5,
                    "ry": 5,
                    "width": 120, 
                    "height": 30,
                    "fill": "#cccccc"
                });

             button.append('text')
                .text("Igraj ponovo!")
                .attr('class', 'replay')
                .attr({
                    "dx": 8,
                    "dy": 20
                });

            button.on("mouseover", function () {
                d3.select(this).select("rect").attr("fill", "#999999");
            });

            button.on("mouseout", function () {
                d3.select(this).select("rect").attr("fill", "#cccccc");
            });

            button.on("click", function () {
                fizzBuzzGame();
            });            
        }
    });

    node.on("mouseout", function (d) {

        node.classed("node-active", false);
        var text = d3.select(this).select("text").text(function (d) {return d.label;});

    });


    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        //force.stop();
        d3.select(this).classed("dragging", true);
        force.start();
    };

    function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

    };

    function dragended(d) {
        d3.select(this).classed("dragging", false);
    };

};

fizzBuzzGame();