import { React } from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages and Routes
import MainPage from '../mainComponents/js/Main';
import SingleDraft from '../mainComponents/js/SingleDraft';
import MultiDraft from '../mainComponents/js/MultiDraft';
import ScoreComp from '../mainComponents/js/Score';
import Insights from '../mainComponents/js/Insights';
import Stats from '../mainComponents/js/Stats';
import TierList from '../mainComponents/js/TierList';
import Traits from '../mainComponents/js/Traits';
import ProMatches from '../mainComponents/js/ProMatches';
import Login from '../sideComponents/js/Login';
import DraftSandbox from '../mainComponents/js/DraftSandbox';

function RouteControl() {
  return (
      <Routes>
        <Route exact path='/' element={<MainPage />} />
        <Route exact path='/single-draft' element={<SingleDraft />} />
        <Route exact path='/multi-draft' element={<MultiDraft />} />
        <Route exact path='/draft-sandbox' element={<DraftSandbox />} />
        <Route exact path='/insights' element={<Insights />} />
        <Route exact path='/stats' element={<Stats />} />
        <Route exact path='/tier-list' element={<TierList />} />
        <Route exact path='/traits' element={<Traits />} />
        <Route exact path='/pro-matches' element={<ProMatches />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
  );
}

export default RouteControl;
