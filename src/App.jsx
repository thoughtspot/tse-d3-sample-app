import './App.css';
import { Route, Routes} from "react-router-dom";
import BurgerMenu from './components/burger/burgermenu';
import SunburstExample from './components/SunburstExample';
import RadialStackedBarExample from './components/RadialStackedBarExample';
import InteractiveRadarExample from './components/InteractiveRadarExample';
import GaugeExample from './components/GaugeExample';
import US_BubbleMapExample from './components/US_BubbleMapExample';
import US_StateChoroplethMapExample from './components/US_StateChoroplethMapExample';
import WordCloudExample from './components/WordCloudExample';
import BarExample from './components/BarExample';
import PieExample from './components/PieExample';

function App() {

 return (
   <div className="App">
     
     <header>
       <BurgerMenu/> 
     </header>

     <Routes>
       <Route path="/" element={<h1>Home</h1>} />
       <Route path="/SunburstExample" element={<SunburstExample />} />
       <Route path="/RadialStackedBarExample" element={<RadialStackedBarExample />} />
       <Route path="/InteractiveRadarExample" element={<InteractiveRadarExample />} />
       <Route path="/GaugeExample" element={<GaugeExample />} />
       <Route path="/US_BubbleMapExample" element={<US_BubbleMapExample />} />
       <Route path="/US_StateChoroplethMapExample" element={<US_StateChoroplethMapExample />} />
       <Route path="/WordCloudExample" element={<WordCloudExample />} />       
       <Route path="/BarExample" element={<BarExample />} />     
       <Route path="/PieExample" element={<PieExample />} />
     </Routes>
      <div className="content">ThoughtSpot Everywhere using D3 charts Starter App. </div>
   </div>
 );
}
export default App;
