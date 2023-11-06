// @see https://observablehq.com/@d3/global-temperature-trends

// https://data.giss.nasa.gov/gistemp/tabledata_v3/GLB.Ts+dSST.csv
d3.csv("/daintree_forest/assets/data/data.csv").then(function(data){
    const margin = {top: 20, right: 90, bottom: 30, left: 90},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    const timeString = 'T00:00:00'

    data.forEach(row => {
        row.date = row.date.split ('-')[0];
        // row.date = new Date(row.date).toUTCString();
        // console.log(row);
    });

    console.log('data', data);
    console.log('x extent', d3.extent(data, d => d.date));
    console.log('y extent', d3.extent(data, d => d.value));

    const x = d3.scaleLinear().domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear().domain(d3.extent(data, d => d.value))
        .range([height - margin.bottom, margin.top]);
    
    const max = d3.max(data, d => Math.abs(d.value));

    // Create a symmetric diverging color scale.
    const color = d3.scaleSequential()
        .domain([max, -max])
        .interpolator(d3.interpolateRdBu);

    const svg = d3.select("#d3-1").append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80))
        .call(g => g.select(".domain").remove());

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "+"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
        .clone()
            .attr("x2", width - margin.right - margin.left)
            .attr("stroke-opacity", d => d === 0 ? 1 : 0.1))
        .call(g => g.append("text")
            .attr("fill", "#000")
            .attr("x", 5)
            .attr("y", margin.top)
            .attr("dy", "0.32em")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Anomaly (°C)"));

        svg.append("g")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .selectAll()
            .data(data)
            .join("circle")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("fill", d => color(d.value))
            .attr("r", 2.5);
});

