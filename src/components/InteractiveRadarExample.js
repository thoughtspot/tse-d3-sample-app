import React, { useEffect, useRef, useState } from 'react';
import { getSearchData, tsLogin } from './util/thoughtspot-rest-api-v1-helpers.js';
import InteractiveRadarChart from './util/InteractiveRadarChart';


const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca";
const search1 = "[sales] [state] [item type] ";
const search2 = "[sales] [state] [product] ";

export default function RadialStackedBarExample(props) {

    //Use React Hooks to handle state
    const svg = useRef(null);
    const [data, setData] = useState(null);
    var cfg = {
                w: 1300,
                h: 590,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                },
                levels: 5,
                centercircle_stroke: 13,
                labelFactor: 1.35,
                wrapWidth: 60,
                opacityArea: 0.2,
                dotRadius: 0,
                opacityCircles: 0.1,
                strokeWidth: 1,
                roundStrokes: true,
                ratio: 1.8,
                legendPosition: {
                    x: 20,
                    y: 20
                } }; 

    //Use React Hooks to handle state
    useEffect(() => {

        const fetchData = async () => {
            const responseLogin = await tsLogin(tsURL, USER, PASSWORD);
            
            //dateset 1
            const responseSearch1 = await getSearchData(tsURL, worksheetID, search1);
            const apiData1 = await responseSearch1.data; // Get only the data portion of the response
  
            //dataset 2
            const responseSearch2 = await getSearchData(tsURL, worksheetID, search2);
            const apiData2 = await responseSearch2.data; // Get only the data portion of the response
  

            var chart1Map = new Map(); // Item type sales by estate
            var chart2Map = new Map(); // Item type sales by estate

            var legendsMap = new Map(); 

            //Chart is expressed as a percentage, so need to calculate percentage of total sales 
            var totalSales1 = apiData1.map(item => item[2]).reduce((prev, next) => prev + next);
            

            apiData1.forEach(function(item, index) {
                if (!chart1Map.has(item[0])) {
                    chart1Map.set(item[0], []);
                }
                if (!legendsMap.has(item[0])) {
                    legendsMap.set(item[0], item[0]);
                }
                chart1Map.get(item[0]).push({
                    "axis": item[1],
                    "value": item[2]/totalSales1
                });
            });

            apiData2.forEach(function(item, index) {
                if (!chart2Map.has(item[0])) {
                    chart2Map.set(item[0], []);
                }
                if (!legendsMap.has(item[0])) {
                    legendsMap.set(item[0], item[0]);
                }
                chart2Map.get(item[0]).push({
                    "axis": item[1],
                    "value": (item[2]/totalSales1)*10 //Arbitrarily multiplying by 10 just to adjust to the the scale a bit better 
                });
            });

            const legends = Array.from(legendsMap.values());
            
            //Array of initial values for axis animation
            var initialValues = [{ value: 0 },{ value: 0 },{ value: 0 },{ value: 0 },{ value: 0 },{ value: 0 },{ value: 0 },{ value: 0 },{ value: 0 }];
            var formattedData = [];

            legends.forEach(function(item, index) {
                if( chart1Map.get(item) !=null&& chart2Map.get(item) != null){

                    var dataPerLegend = [];
                    dataPerLegend.push([{'name':item}]);
                    dataPerLegend.push(chart1Map.get(item).slice(0,8)); //supports up to 9 data points per chart
                    dataPerLegend.push(initialValues); //Same for all axis here, but they could be different
                    dataPerLegend.push(chart2Map.get(item).slice(0,8)); //supports up to 9 data points per chart
                    formattedData.push(dataPerLegend);
                }
            });

            var getRandom = function(arr, n) {
                var result = new Array(n),
                    len = arr.length,
                    taken = new Array(len);
                if (n > len)
                    throw new RangeError("getRandom: more elements taken than available");
                while (n--) {
                    var x = Math.floor(Math.random() * len);
                    result[n] = arr[x in taken ? taken[x] : x];
                    taken[x] = --len in taken ? taken[len] : len;
                }
                return result;
            }


            setData(getRandom(formattedData,8)); //Supports only 9 legends, so choosing random data
            
        };

        fetchData();

    }, []);

    if (data) {
            return (
                   <div className="interactive-radar-container">  
                        <h1>Interactive Radar</h1>
                        <InteractiveRadarChart data={data} cfg={cfg}/>
                    </div>
                    );
        }
        else {
            return <div > Loading chart data... < /div>;
        }
    }   