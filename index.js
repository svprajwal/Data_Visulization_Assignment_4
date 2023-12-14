
const Data = `https://raw.githubusercontent.com/umassdgithub/Fall-2023-DataViz/main/Major-Assignment-4/data/Data_CT.csv`;
let svg = d3.select("svg");
const path = d3.geoPath();

function plot_contour(fileName) {
    d3.csv(fileName).then(function (data) {
        let x = 512, y = 512;
        let valuesP = [];
        data.forEach(function (d) {
            valuesP.push(+d[0]);
        });
        

        const minimum_temparature = d3.min(valuesP);
        const maximum_temparature = d3.max(valuesP);

        let colorus = d3.scaleLinear()
            .domain(d3.range(minimum_temparature, maximum_temparature, parseInt(Math.abs(maximum_temparature - minimum_temparature) / 6.5)))
            .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"])
            .interpolate(d3.interpolateHcl);

        let contours = d3.contours()
            .size([x, y])
            .thresholds(d3.range(minimum_temparature, maximum_temparature, 1000))
            (valuesP);

        svg.append("g").attr("class", "contours")
            .selectAll("path")
            .data(contours)
            .enter()
            .append("path")
            .attr("d", function (d) { return path(d); })
            .attr("stroke", "black")
            .attr("stroke-width", ".1px")
            .attr("stroke-linejoin", "round")
            .attr("fill", function (d) { return colorus(d.value); });

        
        $("#slider-range").slider({
            range: true,
            min: minimum_temparature,
            max: maximum_temparature,
            values: [minimum_temparature, maximum_temparature],
            slide: function (event, ui) {
                $("#amount").val(ui.values[0] + " - " + ui.values[1]);
                update(ui.values[0], ui.values[1]);
            }
        });

        function update(minimum_value, maximum_value) {
            svg.selectAll(".contours").remove(); 

            let contours = d3.contours()
                .size([x, y])
                .thresholds(d3.range(minimum_value, maximum_value, 40))
                (valuesP);

            svg.append("g").attr("class", "contours")
                .selectAll("path")
                .data(contours)
                .enter()
                .append("path")
                .attr("d", function (d) { return path(d); })
                .attr("stroke", "black")
                .attr("stroke-width", ".1px")
                .attr("stroke-linejoin", "round")
                .attr("fill", function (d) { return colorus(d.value); });
        }
    });
}

plot_contour(Data);