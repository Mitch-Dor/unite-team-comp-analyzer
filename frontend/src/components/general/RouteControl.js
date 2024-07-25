import { React } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages and Routes
import MainPage from '../mainComponents/js/Main';
import Draft from '../mainComponents/js/Draft';
import ScoreComp from '../mainComponents/js/Score';
import Stats from '../mainComponents/js/Stats';


function RouteControl() {
  return (
      <Routes>
        <Route exact path='/' element={<MainPage />} />
        <Route exact path='/person-vs-ai' element={<Draft />} />
        <Route exact path='/ai-vs-ai' element={<Draft />} />
        <Route exact path='/score-a-comp' element={<ScoreComp />} />
        <Route exact path='/stats' element={<Stats />} />
      </Routes>
  );
}

export default RouteControl;
