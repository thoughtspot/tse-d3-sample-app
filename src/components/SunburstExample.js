import React, { useEffect, useRef, useState } from 'react';
import { getSearchData, tsLogin } from './util/thoughtspot-rest-api-v1-helpers.js';
import { SunburstChart } from './util/d3-helpers.js';

const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca";
const search = "[sales] [state] [item type]";

export default function SunburstExample(props) {

    //Use React Hooks to handle state
    const svg = useRef(null);
    const [data, setData] = useState(null);

    //Use React Hooks to handle state
    useEffect(() => {

        const fetchData = async () => {
            const responseLogin = await tsLogin(tsURL, USER, PASSWORD);
            const responseSearch = await getSearchData(tsURL, worksheetID, search);
            const newData = await responseSearch.data;
            setData(newData);

            var estates = new Map();

            newData.forEach(function(item, index) {
                if (!estates.has(item[0])) {
                    estates.set(item[0], []);
                }
                estates.get(item[0]).push({
                    "name": item[1],
                    "size": item[2]
                });
            });


            const formattedData = {
                "name": "US Sales",
                "children": []
            }

            for (const [key, value] of estates.entries()) {
                formattedData["children"].push({
                    "name": key,
                    "children": value
                });
            }

            //Use function from https://observablehq.com/@d3/sunburst to render chart
            const chart = SunburstChart(formattedData, {
                value: d => d.size, // size of each node (file); null for internal nodes (folders)
                label: d => d.name, // display name for each cell
                title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}\n${n.value.toLocaleString("en")}`, // hover text
                width: 1152,
                height: 1152
            })

            //svg is a mutable ref object whose .current property is initialized to the passed argument (initialValue). 
            //See. https://reactjs.org/docs/hooks-reference.html#useref
            if (svg.current && chart !== undefined) {
                svg.current.appendChild(chart)
            }
        };

        fetchData();

    }, []);

    if (data) {
        	return ( < div ref = {svg}/>);
        }
        else {
            return <div > Loading chart data... < /div>;
        }
  }