import { React } from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages and Routes
import MainPage from '../mainComponents/js/Main';
import SingleDraft from '../mainComponents/js/SingleDraft';
import Insights from '../mainComponents/js/Insights';
import TierList from '../mainComponents/js/TierList';
import Login from '../sideComponents/js/Login';
import DraftSandbox from '../mainComponents/js/DraftSandbox';
import UTA_Main from '../UTA_Components/main_components/js/UTA_Main';
import Admin from '../mainComponents/js/Admin';

function RouteControl() {
  return (
      <Routes>
        <Route exact path='/' element={<MainPage />} />
        <Route exact path='/single-draft' element={<SingleDraft />} />
        <Route exact path='/draft-sandbox' element={<DraftSandbox />} />
        <Route exact path='/insights' element={<Insights />} />
        <Route exact path='/tier-list' element={<TierList />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/admin' element={<Admin />} />
        <Route exact path='/UTA' element={<UTA_Main />} />
      </Routes>
  );
}

export default RouteControl;
