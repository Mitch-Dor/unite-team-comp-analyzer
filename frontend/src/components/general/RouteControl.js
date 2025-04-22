import { React } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages and Routes
import MainPage from '../mainComponents/js/Main';
import SingleDraft from '../mainComponents/js/SingleDraft';
import MultiDraft from '../mainComponents/js/MultiDraft';
import ScoreComp from '../mainComponents/js/Score';
import Stats from '../mainComponents/js/Stats';
import TierList from '../mainComponents/js/TierList';
import Traits from '../mainComponents/js/Traits';
import Comps from '../mainComponents/js/Comps';
import Login from '../sideComponents/js/Login';

function RouteControl() {
  return (
      <Routes>
        <Route exact path='/' element={<MainPage />} />
        <Route exact path='/person-vs-ai' element={<SingleDraft />} />
        <Route exact path='/ai-vs-ai' element={<SingleDraft />} />
        <Route exact path='/person-vs-person' element={<SingleDraft />} />
        <Route exact path='/multi-draft' element={<MultiDraft />} />
        <Route exact path='/score-a-comp' element={<ScoreComp />} />
        <Route exact path='/stats' element={<Stats />} />
        <Route exact path='/tier-list' element={<TierList />} />
        <Route exact path='/traits' element={<Traits />} />
        <Route exact path='/comps' element={<Comps />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
  );
}

export default RouteControl;
