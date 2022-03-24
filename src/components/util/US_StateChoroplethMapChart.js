import React from 'react';
import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as topojson from "topojson-client";
import { Legend as legend } from './d3-helpers.js';
import usData from './us-atlas-counties-10m.json';



export default class US_StateChoroplethMapChart extends React.Component {

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

            var format = d3.format(",.3n");//see more formats here http://bl.ocks.org/zanarmstrong/05c1e95bf7aa16c4768e

            var path = d3.geoPath();

            var color = d3.scaleQuantize([0, 9], d3.schemeBlues[9]);
         
            var dataMap = new Map(); 

      
            rawAPIData.forEach(function(item, index) {
                if (!dataMap.has(item[0])) {
                    dataMap.set(item[0], { "sales": item[1]/1000000, "color": item[1]/10000000 });
                }
            });

           
            var data = Object.assign( dataMap, {
			    title: "Sales in 10M USD increments"
			});
      
            const svg = el.append('svg').attr("viewBox", [0, 0, 975, 610]);

			 
			svg.append("g")
			      .attr("transform", "translate(610,20)")
			      .append(() => legend(color, {title: data.title, width: 260}));
			  
			 
			svg.append("g")
			    .selectAll("path")
			    .data(topojson.feature(usData, usData.objects.states).features)
			    .join("path")
			      .attr("fill", d => {
			      			if( dataMap.get(d.properties.name) )
			      				return color(dataMap.get(d.properties.name).color);
			      			else
			      				return "#f5f2f2";
			      		})
			      .attr("d", path)
			    .append("title")
			      .text(d => {
			      		if( dataMap.get(d.properties.name) )
			      			return `${d.properties.name} ${format(dataMap.get(d.properties.name).sales)}M`;
			      		else
			      			return `${d.properties.name} - no reported sales`;
			      		});

			svg.append("path")
			      .datum(topojson.mesh(usData, usData.objects.states, (a, b) => a !== b))
			      .attr("fill", "none")
			      .attr("stroke", "#ddd")
			      .attr("stroke-linejoin", "round")
			      .attr("d", path);			 
 			
        }

        render() {
            return ( < div ref = { this.myReference } > < /div> );
            }
        }