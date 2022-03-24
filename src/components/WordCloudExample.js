import React, { useEffect, useRef, useState } from 'react';
import { getSearchData, tsLogin } from './util/thoughtspot-rest-api-v1-helpers.js';
import WordCloud from 'react-d3-cloud';


const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca";
const search1 = "[sales] [state] top 25"; //Sales by state

export default function US_StateChoroplethMapExample(props) {

    console.log(process.env.REACT_APP_TS_USERNAME);

    //Use React Hooks to handle state
    const [data, setData] = useState(null);
   
    //Use React Hooks to handle state
    useEffect(() => {

        const fetchData = async () => {
            
            const responseLogin = await tsLogin(tsURL, USER, PASSWORD);
            const responseSearch1 = await getSearchData(tsURL, worksheetID, search1);
            const apiData1 = await responseSearch1.data; // Get only the data portion of the response

            const formattedData = [];
            apiData1.forEach(function(item, index) {
                formattedData.push({
                    "text": item[0],
                    "value": item[1]/10000
                });
            });
            setData( formattedData ); 
        };

        fetchData();

    }, []);

    if (data) {
            return (
                   <div className="word-cloud">  
                        <h1>Word Cloud (Top 25 state by sales)</h1>
                        <WordCloud data={data} rotate={(d) => 0}/>
                    </div>
                    );
        }
        else {
            return <div > Loading chart data... < /div>;
        }
    }   