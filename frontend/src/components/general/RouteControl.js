import { React } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages and Routes
import MainPage from '../mainComponents/js/Main';
import Draft from '../mainComponents/js/Draft';
import ScoreComp from '../mainComponents/js/Score';
import Stats from '../mainComponents/js/Stats';
import TierList from '../mainComponents/js/TierList';
import Traits from '../mainComponents/js/Traits';
import Comps from '../mainComponents/js/Comps';

function RouteControl() {
  return (
      <Routes>
        <Route exact path='/' element={<MainPage />} />
        <Route exact path='/person-vs-ai' element={<Draft />} />
        <Route exact path='/ai-vs-ai' element={<Draft />} />
        <Route exact path='/person-vs-person' element={<Draft />} />
        <Route exact path='/score-a-comp' element={<ScoreComp />} />
        <Route exact path='/stats' element={<Stats />} />
        <Route exact path='/tier-list' element={<TierList />} />
        <Route exact path='/traits' element={<Traits />} />
        <Route exact path='/comps' element={<Comps />} />
      </Routes>
  );
}

export default RouteControl;
