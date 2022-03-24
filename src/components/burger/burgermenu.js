import React from "react";
import { slide as Menu } from "react-burger-menu"
import "./burger.css";

const toggleMenu = ({ isOpen }) => {
 const menuWrap = document.querySelector(".bm-menu-wrap");
 isOpen
   ? menuWrap.setAttribute("aria-hidden", false)
   : menuWrap.setAttribute("aria-hidden", true);
};

const BurgerMenu = () => {
 return (
   <Menu noOverlay onStateChange={toggleMenu}>     
       <a className="bm-item" href="/">Home</a>
       <a className="bm-item" href="/SunburstExample">Sunburst Chart</a> 
       <a className="bm-item" href="/RadialStackedBarExample">Radial Stacked Bar Chart</a>     
       <a className="bm-item" href="/InteractiveRadarExample" >Interactive Radar Chart</a>
       <a className="bm-item" href="/GaugeExample" >Gauge Chart</a>     
       <a className="bm-item" href="/US_BubbleMapExample" >Bubble Map Chart</a>
       <a className="bm-item" href="/US_StateChoroplethMapExample" >State Choropleth Map Chart</a>
       <a className="bm-item" href="/WordCloudExample" >Word Cloud Chart</a>
       <a className="bm-item" href="/BarExample" >Bar Chart</a>
       <a className="bm-item" href="/PieExample" >Pie Chart</a>
   </Menu>
 );
};
export default BurgerMenu;