import React from 'react';
import * as d3 from "https://cdn.skypack.dev/d3@6";
import * as topojson from "topojson-client";
import usData from './us-atlas-counties-10m.json';


export default class US_BubbleMapChart extends React.Component {

        constructor(props) {
    
            super(props);
            this.myReference = React.createRef();
    
        }

        componentDidMount() {

            //The example https://observablehq.com/@d3/bubble-map only works with the static US data provided 
            //According to https://observablehq.com/@enjalot/county-boundaries the bellow should work but it does not.
            //var us = d3.json("https://unpkg.com/us-atlas@3/counties-10m.json").then((usData) => {
                this.update(usData);
            //});

        }

        update(usData) {

            var el = d3.select(this.myReference.current);

            var rawAPIData = this.props.data;

            var format = d3.format(",.0f");

            var path = d3.geoPath();

            //JS Map with shapes of interest (states) by name (because the query returns states names instead of codes)
            var features = new Map(topojson.feature(usData, usData.objects.states).features.map(d => [d.properties.name, d]));
            
            var data = rawAPIData.slice(1).map(([ state_name, sales]) => {
                const id = state_name;
                const feature = features.get(id);
                return {
                    id,
                    position: feature && path.centroid(feature),
                    title: feature && feature.properties.name,
                    value: +sales
                };
            });


            var radius = d3.scaleSqrt([0, d3.max(data, d => d.value)], [0, 35]);

            const svg = el.append('svg').attr("viewBox", [0, 0, 975, 610]);

            svg.append("path")
                .datum(topojson.feature(usData, usData.objects.nation))
                .attr("fill", "#ddd")
                .attr("d", path);

            svg.append("path")
                .datum(topojson.mesh(usData, usData.objects.states, (a, b) => a !== b))
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-linejoin", "round")
                .attr("d", path);

            const legend = svg.append("g")
                .attr("fill", "#777")
                .attr("transform", "translate(915,608)")
                .attr("text-anchor", "middle")
                .style("font", "10px sans-serif")
                .selectAll("g")
                .data(radius.ticks(4).slice(1))
                .join("g");

            legend.append("circle")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("cy", d => -radius(d))
                .attr("r", radius);

            legend.append("text")
                .attr("y", d => -2 * radius(d))
                .attr("dy", "1.3em")
                .text(radius.tickFormat(4, "s"));

            svg.append("g")
                .attr("fill", "brown")
                .attr("fill-opacity", 0.5)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5)
                .selectAll("circle")
                .data(data
                    .filter(d => d.position)
                    .sort((a, b) => d3.descending(a.value, b.value)))
                .join("circle")
                .attr("transform", d => `translate(${d.position})`)
                .attr("r", d => radius(d.value))
                .append("title")
                .text(d => `${d.title} ${format(d.value)}`);

        }

        render() {
            return ( < div ref = { this.myReference } > < /div> );
            }
        }