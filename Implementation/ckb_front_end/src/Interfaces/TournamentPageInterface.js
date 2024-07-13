import React from "react";
import { CustomAppBar } from "../CustomComponents/CustomAppBar";
import { useLocation } from "react-router-dom";
import backgroundImg from '../ApplicationPictures/tournamentCardPicture.jpg';
import { Box, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import { getTournament, subscribe, getBattlesOfTournament } from "../CallsHandling/DatabaseInteractionManager";
import { useEffect } from "react";
import { useState } from "react";
import { CustomLoadingButton } from "../CustomComponents/CustomLoadingButton";
import { getToken } from "../Utility/LocalStorageSaver";
import { colors } from "../Configuration/Environment";
import { CustomBattleBox } from "../CustomComponents/CustomBattleBox";

export const TournamentPageInterface = () => {

    const location = useLocation();
    const id = location.state;
    const [name, setName] = useState('');
    const [lastChange, setLastChange] = useState('');
    const [status, setStatus] = useState('');
    const [numberOfParticipants, setNumberOfParticipants] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [deadLineSubscription, setDeadLineSubscription] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [battles, setBattles] = useState([]);
    

    useEffect(() => {
        getTournament(getToken(), id)
            .then(tournament => {
                console.log(tournament);
                setName(tournament.name);
                setLastChange(tournament.lastChange);
                setStatus(tournament.status);
                setNumberOfParticipants(tournament.numberOfPartecipants);
                setDescription(tournament.description);
                setImage(tournament.image);
                setDeadLineSubscription(tournament.deadLineSubscription);
            })
            .catch(error => console.error(error));
        getBattlesOfTournament(getToken(), id)
            .then(battles => {
                setBattles(battles);
            })
            .catch(error => console.error(error));
    }, [id]);

    const makeSubscribe = () => {
        setIsSubscribing(true);
        subscribe(getToken(), id)
            .then(response => {
                setMessage(response.message);
                setErrorMessage("");
                window.location.reload();
            })
            .catch((error) => {
                setMessage("");
                setErrorMessage(error.message);
            })
            .finally(() => setIsSubscribing(false))
    }

    return (
        <>
            <CustomAppBar title={`${name}`} status={status} tournamentId={id} position="fixed"/>
            <Toolbar />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '85%', margin: '10px auto', gap: '20px'}}>
                <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%',  
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%', gap: '20px'}}>
                        <img 
                            src={image ? `data:image/jpeg;base64,${image}` : backgroundImg} 
                            alt="Tournament image" 
                            style={{ 
                                marginRight: '10rem',
                                maxWidth: '100%', 
                                height: 'auto', 
                                objectFit: 'cover' 
                            }} 
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'row', alignItems: 'center', width: '100%', gap: '20px'}}>
                        <Typography variant="body2" component="h2" sx={{ textAlign: 'right', padding: '2rem'}}>
                            {`Participants: ${numberOfParticipants}`}
                        </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        alignItems: 'left', 
                        width: '50%', 
                        }}>
                        <Typography variant="h6" component="h2" sx={{ textAlign: 'left', padding: '2rem'}}>
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {status === "not subscribed" && new Date(deadLineSubscription) >= new Date() ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CustomLoadingButton sx={{mt: 1, fontSize:'1.5rem'}} loadingVariable={isSubscribing} setter={setIsSubscribing} text={"Subscribe"} mainFunction={makeSubscribe}/>
                    {message.length !== 0 &&
                        <Typography variant="h6" component="div" sx={{my: "5%", flexGrow: 1}} maxHeight={"11vh"} color={"#2196f3"}>
                            {message}
                        </Typography>
                    }
                    {errorMessage.length !== 0 &&
                        <Typography variant="h6" component="div" sx={{my: "5.25%", flexGrow: 1}} maxHeight={"10.15vh"} color={"red"}>
                            {errorMessage}
                        </Typography>
                    }
                </Box>
            ) : (
                <Box>
                    <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '30px' }} />
                    <Typography variant="h6" component="div" sx={{ marginLeft: '10px', textAlign: 'center', color: `${colors.logo_red}`}}>
                        Active Battle
                    </Typography>
                    <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '10px', marginBottom: '20px' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '40%', margin: '0 auto', gap: '20px'}}>
                        {battles.filter(battle => battle.battleStatus === 'active').map((battle, index) => {
                            return (
                                <CustomBattleBox battle={battle} globalStatus={status} tournamenId={id} key={index} sx={{ width: '100%' }} />
                            );
                        })}
                    </Box>
                    <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '30px' }} />
                    <Typography variant="h6" component="div" sx={{ marginLeft: '10px', textAlign: 'center', color: `${colors.logo_red}`}}>
                        Incoming Battles
                    </Typography>
                    <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '10px', marginBottom: '20px' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '40%', margin: '0 auto', gap: '20px'}}>
                        {battles.filter(battle => battle.battleStatus === 'future').map((battle, index) => {
                            return (
                                <CustomBattleBox battle={battle} globalStatus={status} tournamenId={id} key={index} sx={{ width: '100%' }} />
                            );
                        })}
                    </Box>
                    <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '30px' }} />
                    <Typography variant="h6" component="div" sx={{ marginLeft: '10px', textAlign: 'center', color: `${colors.logo_red}`}}>
                        Precedent Battles
                    </Typography>
                    <hr style={{ borderColor: `${colors.logo_blue}`, marginTop: '10px', marginBottom: '20px' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '40%', margin: '0 auto', gap: '20px'}}>
                        {battles.filter(battle => battle.battleStatus === 'past').map((battle, index) => {
                            return (
                                <CustomBattleBox battle={battle} globalStatus={status} tournamenId={id} key={index} sx={{ width: '100%' }} />
                            );
                        })}
                    </Box>
                </Box>
            )}
        </>
    );
}