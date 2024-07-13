import React from "react";
import { CustomAppBar } from "../CustomComponents/CustomAppBar";
import { CustomTournamentBox } from "../CustomComponents/CustomTournamentBox";
import { useState, useEffect } from "react";
import { getToken } from "../Utility/LocalStorageSaver";
import { getTournamentsOfUser } from "../CallsHandling/DatabaseInteractionManager";
import Box  from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";


export const MyTournementsInterface = () => {
    const [listOfMyTournaments, setListOfMyTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const token = getToken();
                const mytournament = await getTournamentsOfUser(token);
                setListOfMyTournaments(mytournament);
            } catch (e) {
                console.log(e);
            }
        };
        fetchTournaments();
    }, []);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <CustomAppBar title={`Your Tournaments`} position="fixed"/>
                <Toolbar />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60%', margin: '0 auto', gap: '20px'}}>
                    {listOfMyTournaments.length > 0 ? 
                        listOfMyTournaments.map((tournament, index) => {
                            return (
                                <CustomTournamentBox tournament={tournament} key={index} sx={{ width: '100%' }} />
                            );
                        })
                        :
                        <Typography>No activity yet</Typography>
                    }
                </Box>
            </Box>
        </>
    )
}