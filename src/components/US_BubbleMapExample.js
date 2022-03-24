import React, { useEffect, useRef, useState } from 'react';
import { getSearchData, tsLogin } from './util/thoughtspot-rest-api-v1-helpers.js';
import US_BubbleMapChart from './util/US_BubbleMapChart';


const tsURL = process.env.REACT_APP_TS_URL;
const USER = process.env.REACT_APP_TS_USERNAME;
const PASSWORD = process.env.REACT_APP_TS_PASSWORD;

const worksheetID = "cd252e5c-b552-49a8-821d-3eadaa049cca";
const search1 = "[sales] [state]"; //Sales by state

export default function US_BubbleMapExample(props) {

    //Use React Hooks to handle state
    const svg = useRef(null);
    const [data, setData] = useState(null);
   
    //Use React Hooks to handle state
    useEffect(() => {

        const fetchData = async () => {
            
            const responseLogin = await tsLogin(tsURL, USER, PASSWORD);
            const responseSearch1 = await getSearchData(tsURL, worksheetID, search1);
            const apiData1 = await responseSearch1.data; // Get only the data portion of the response

            setData( apiData1 ); 
        };

        fetchData();

    }, []);

    if (data) {
            return (
                   <div className="chart-map">  
                        <h1>Bubble Map (Sales by state)</h1>
                        <US_BubbleMapChart data={data}/>
                    </div>
                    );
        }
        else {
            return <div > Loading chart data... < /div>;
        }
    }   