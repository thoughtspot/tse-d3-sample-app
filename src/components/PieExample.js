import React, { useEffect, useRef, useState } from 'react';
import { getSearchData, tsLogin } from './util/thoughtspot-rest-api-v1-helpers.js';
import { PieChart } from './util/d3-helpers.js';

const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca";
const search = "[sales] [item type]";

export default function PieExample(props) {

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

            const formattedData = [];
            newData.forEach(function(item, index) {
                var chartRow = {
                    "name": item[0], 
                    "value": item[1]
                };
                formattedData[index] = chartRow;
            });

            formattedData["columns"] = ["name", "value"];
        
            const chart = PieChart(formattedData, {
              name: d => d.name,
              value: d => d.value
            });

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