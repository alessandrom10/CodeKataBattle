import './App.css';
import React from "react";
import {Outlet, Navigate} from "react-router-dom";
import { useState, useEffect } from 'react';
import {getToken} from "./Utility/LocalStorageSaver";
import { isTokenAcceptable } from './CallsHandling/DatabaseInteractionManager';
import {LoginInterface} from "./Interfaces/LoginInterface";
import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router";
import {LOGIN_URL} from "./Configuration/Environment";
import { SIGNUP_URL } from './Configuration/Environment';
import {SignUpInterface} from "./Interfaces/SignUpInterface";
import { HOMEPAGE_URL } from './Configuration/Environment';
import {HomepageInterface} from "./Interfaces/HomepageInterface";
import {TOURNAMENT_PAGE_URL} from "./Configuration/Environment";
import {TournamentPageInterface} from "./Interfaces/TournamentPageInterface";
import {MY_TOURNAMENTS_URL} from "./Configuration/Environment";
import { MyTournementsInterface } from './Interfaces/MyTournamentsInterface';
import { CREATE_TOURNAMENT_URL } from './Configuration/Environment';
import { CreateTournamentInterface } from './Interfaces/CreateTournamentInterface';
import { CREATE_BATTLE_URL } from './Configuration/Environment';
import { CreateBattleInterface } from './Interfaces/CreateBattleInterface';
import { CreateGroupInterface } from './Interfaces/CreateGroupInterface';
import { CREATE_GROUP_URL } from './Configuration/Environment';
import { SHOW_RESULTS_URL } from './Configuration/Environment';
import { ShowResultsInterface } from './Interfaces/ShowResultsInterface';
import { InviteEducatorToTournamentInterface } from './Interfaces/InviteEducatorToTournamentInterface';
import { INVITE_EDUCATOR_TO_TOURNAMENT_URL } from './Configuration/Environment';
import { InviteUserToGroupInterface } from './Interfaces/InviteUserToGroupInterface';
import { INVITE_USER_TO_GROUP_URL } from './Configuration/Environment';

//this component handles at what url, each interface/component is shown
function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path={LOGIN_URL} element={<LoginInterface/>} />
                <Route path={SIGNUP_URL} element={<SignUpInterface/>} />
                <Route path={"/"} element={<RequireAuth />}>
                    <Route path={HOMEPAGE_URL} element={<HomepageInterface/>} />
                    <Route path={TOURNAMENT_PAGE_URL} element={<TournamentPageInterface/>} />
                    <Route path={MY_TOURNAMENTS_URL} element={<MyTournementsInterface/>} />
                    <Route path={CREATE_TOURNAMENT_URL} element={<CreateTournamentInterface/>} />
                    <Route path={CREATE_BATTLE_URL} element={<CreateBattleInterface/>} />
                    <Route path={CREATE_GROUP_URL} element={<CreateGroupInterface/>} />
                    <Route path={SHOW_RESULTS_URL} element={<ShowResultsInterface/>} />
                    <Route path={INVITE_EDUCATOR_TO_TOURNAMENT_URL} element={<InviteEducatorToTournamentInterface/>} />
                    <Route path={INVITE_USER_TO_GROUP_URL} element={<InviteUserToGroupInterface/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  );
}

function RequireAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      await isTokenAcceptable(getToken()).then(response => setIsAuthenticated(response.isValid)).catch(error => {console.log(error);
        setIsAuthenticated(error.isValid)});
    };

    checkAuth();
  }, []);
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_URL} />;
  }

  return <Outlet />;
}

export default App;
