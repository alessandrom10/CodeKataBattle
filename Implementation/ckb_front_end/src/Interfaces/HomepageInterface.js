import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {CustomAppBar} from "../CustomComponents/CustomAppBar";
import Typography from "@mui/material/Typography";
import {Toolbar} from "@mui/material";
import { getUsername, getTournamentsOfUser, getPopularTournaments } from "../CallsHandling/DatabaseInteractionManager";
import {getToken, getUserName} from "../Utility/LocalStorageSaver";
import { colors } from "../Configuration/Environment";
import {CustomTournamentBox} from "../CustomComponents/CustomTournamentBox";

export const HomepageInterface = () => {

    const [listOfPopularTournaments, setListOfPopularTournaments] = useState([]);
    const [listOfMyTournaments, setListOfMyTournaments] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const token = getToken();
                const user = getUserName();
                if (user === null || user === "") {
                    const username = await getUsername(token);
                    setUsername(username.username);
                } else {
                    setUsername(user);
                }
                const mytournament = await getTournamentsOfUser(token);
                const populartournament = await getPopularTournaments(token);
                setListOfMyTournaments(mytournament);
                setListOfPopularTournaments(populartournament);
            } catch (e) {
                console.log(e);
            }
        };
        fetchTournaments();
    }, []);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <CustomAppBar title={`Welcome back ${username}!`} position="fixed"/>
                <Toolbar />
                <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '10px' }} />
                <Typography variant="h6" component="div" sx={{ marginLeft: '10px', textAlign: 'center', color: `${colors.logo_red}`}}>
                    Your recently active tournaments
                </Typography>
                <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '10px', marginBottom: '20px' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60%', margin: '0 auto', gap: '20px'}}>
                    {listOfMyTournaments.length > 0 ? 
                        listOfMyTournaments.slice(0, 3).map((tournament, index) => {
                            return (
                                <CustomTournamentBox tournament={tournament} key={index} sx={{ width: '100%' }} />
                            );
                        })
                        :
                        <Typography>No activity yet</Typography>
                    }
                </Box>
                <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '40px' }} />
                <Typography variant="h6" component="div" sx={{ marginLeft: '10px', marginTop: '10px', textAlign: 'center', color: `${colors.logo_red}` }}>
                    Other tournaments
                </Typography>
                <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '10px', marginBottom: '20px'}} />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60%', margin: '0 auto', gap: '20px'}}>
                    {listOfPopularTournaments.map((tournament, index) => {
                        return (
                            <CustomTournamentBox tournament={tournament} key={index} sx={{ width: '100%' }} />
                        );
                    })}
                </Box>
            </Box>
        </>
    );
}