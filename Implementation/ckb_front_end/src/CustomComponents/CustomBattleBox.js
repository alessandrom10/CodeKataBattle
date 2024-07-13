import React, { useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import backgroundImg from '../ApplicationPictures/tournamentCardPicture.jpg';
import {colors} from '../Configuration/Environment'
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { TOURNAMENT_PAGE_URL } from '../Configuration/Environment';
import { CustomLoadingButton } from './CustomLoadingButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { getToken } from '../Utility/LocalStorageSaver';
import { getUserStatusBattlewise, closeBattle } from '../CallsHandling/DatabaseInteractionManager';
import { enroll } from '../CallsHandling/DatabaseInteractionManager';
import { CREATE_GROUP_URL, INVITE_USER_TO_GROUP_URL, SHOW_RESULTS_URL } from '../Configuration/Environment';

export const CustomBattleBox = ({tournamenId, battle, globalStatus }) => {

    const id = tournamenId;
    console.log(globalStatus);
    const { name, description,  battleId, startDate, endDate, teamMinimumSize,  teamMaximumSize, battleStatus, codeKataUrl } = battle;

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isEnrolling, setIsEnrolling] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [userStatus, setUserStatus] = React.useState("");
    const [groupName, setGroupName] = React.useState(null);
    const [groupStatus, setGroupStatus] = React.useState(null);
    const [groupId, setGroupId] = React.useState(null);
    const [isClosingBattle , setIsClosingBattle] = React.useState(false);

    useEffect(() => {
        getUserStatusBattlewise(getToken(), battleId)
            .then(response => {
                setUserStatus(response.userStatus);
                setGroupName(response.groupName);
                setGroupStatus(response.groupStatus);
                setGroupId(response.groupId);
            })
            .catch(error => console.error(error));
    }, []);

    const navigate = useNavigate();
    

    const handleEnrollClick = () => {
        setIsEnrolling(true);
        enroll(getToken(), battleId)
            .then(response => {
                setIsEnrolling(false);
                setMessage(response.message);
                setErrorMessage("");
                window.location.reload();
            })
            .catch((error) => {
                setIsEnrolling(false);
                setMessage("");
                setErrorMessage(error.message);
            })
    };

    const handleCreateGroupClick = () => {
        navigate(CREATE_GROUP_URL, { state: {battleId, id} });
    };

    const handleInviteFriendsToGroupClick = () => {
        navigate(INVITE_USER_TO_GROUP_URL, { state: {battleId, id, groupId, groupName} })
    }

    const handleCloseBattleClick = () => {
        setIsClosingBattle(true);
        closeBattle(getToken(), battleId)
            .then(response => {
                setIsClosingBattle(false);
                setMessage(response.message);
                setErrorMessage("");
                window.location.reload();
            })
            .catch((error) => {
                setIsClosingBattle(false);
                setMessage("");
                setErrorMessage(error.message);
            })
    }

    const handleViewBattleResultClick = () => {
        navigate(SHOW_RESULTS_URL, { state: { id: battleId, scope: 'battle' } });
    }

    return (
        <>
            <Card sx={{
                width: '100%', 
                borderRadius: '15px', 
                boxShadow: 3, 
                position: 'relative', 
                border: `2px solid ${colors.logo_blue}`}}>
                <CardContent sx={{ padding: 5 }}>
                    <Typography variant="h5" component="div" sx={{ marginBottom: 2, marginX: 3 }}>
                        {`${name}`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' , marginBottom: 1}}>
                        <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 auto', marginRight: '15%'  }}>
                            {`Enrollment deadline: ${startDate}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 auto', marginRight: '15%'  }}>
                            {`End date: ${endDate}`}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 auto', marginBottom: 2 }}>
                        {`Team size: ${teamMinimumSize} - ${teamMaximumSize} students`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0 }}>
                            Status:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0, marginLeft: 1, color: userStatus === 'subscribed' ? 'green' : userStatus === 'not subscribed' ? 'red' : 'inherit' }}>
                            {`${userStatus}`}
                            {userStatus === 'enrolled' ? ' 🟢' : userStatus === 'not enrolled' ? ' 🔴' : ' 🔨'}
                        </Typography>
                    </Box>
                </CardContent>
                <IconButton 
                    sx={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                >
                <ArrowForwardIos onClick={handleOpen} sx={{color: `${colors.logo_red}`}}/>
            </IconButton>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500, onClick: handleClose}}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ 
                    width: '80%', 
                    height: '80%',
                    backgroundColor: 'white', 
                    borderRadius: '15px', 
                    position: 'relative',
                    '::before': {
                        content: '""',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: -1,
                    }
                }}>
                    <IconButton 
                        sx={{ position: 'absolute', right: 10, top: 10 }} 
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h3" component="div" sx={{ 
                        fontSize: '4rem', 
                        color: 'black', 
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        padding: '0.5rem',
                        borderRadius: '15px',
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        {`${name}`}
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '100%', 
                        height: '80%', 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                    }}>
                        <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '45%', 
                        height: '100%', 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        borderRight: `3px ${colors.logo_blue} solid`,
                        }}>
                            <Typography variant="h6" component="h2" sx={{ textAlign: 'left', padding: '2rem',  overflow: 'auto'}}>
                                {description}
                            </Typography>
                        </Box>
                        <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        alignItems: 'left', 
                        width: '50%', 
                        height: '100%', 
                        position: 'absolute',
                        bottom: 0,
                        left: '47.5%',
                        }}>
                            <Typography variant="h6" color="text.secondary" component="h2" sx={{ textAlign: 'left', padding: '2rem'}}>
                                {`Subscription deadline: ${startDate}`}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" component="h2" sx={{ textAlign: 'left', padding: '2rem'}}>
                                {`End date: ${endDate}`}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" component="h2" sx={{ textAlign: 'left', padding: '2rem'}}>
                                {`Team size: ${teamMinimumSize} - ${teamMaximumSize} students`}
                            </Typography>
                            {battleStatus === 'active' && (
                                <>
                                {userStatus === 'enrolled' && (
                                    <>
                                        {groupName === null &&
                                            <Typography variant="h6" component="h2" color="text.secondary" sx={{ textAlign: 'left', padding: '2rem'}}>
                                                You are on SOLO for this battle!
                                            </Typography>
                                        }
                                        {groupName !== null && (
                                            <Typography variant="h6" component="h2" color="text.secondary" sx={{ textAlign: 'left', padding: '2rem'}}>
                                                Group name: {groupName}
                                            </Typography>
                                        )
                                        }
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="h6" component="h2" color="text.secondary" sx={{ textAlign: 'left', padding: '2rem'}}>
                                                CodeKata :
                                            </Typography>
                                            <TextField
                                                value={codeKataUrl}
                                                sx={{ width: '60%',marginRight: '10rem' }}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => navigator.clipboard.writeText(codeKataUrl)}>
                                                                <FileCopyIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Box>
                                    </>
                                )}
                                {userStatus === 'managing' && (
                                    <>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <CustomLoadingButton sx={{mt: 1, fontSize:'1.5rem'}} loadingVariable={isClosingBattle} setter={setIsClosingBattle} text={"Close battle"} mainFunction={handleCloseBattleClick}/>
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
                                    </>
                                )}
                                </>
                            )}
                            {battleStatus === 'future' && (
                                <>
                                {userStatus === 'not enrolled' &&(
                                    <>
                                    {globalStatus === 'subscribed' && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CustomLoadingButton sx={{mt: 1, fontSize:'1.5rem'}} loadingVariable={isEnrolling} setter={setIsEnrolling} text={"Enroll"} mainFunction={handleEnrollClick}/>
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
                                    )}
                                    </>
                                )}
                                {userStatus === 'enrolled' && (
                                    <>
                                    {groupName === null &&
                                        <Button 
                                        variant="contained" 
                                        onClick={handleCreateGroupClick} 
                                        sx={{ 
                                            fontSize: '1.5rem',
                                            alignSelf: 'center',  
                                            marginTop: '4rem',  
                                        }}
                                        > 
                                            Create a group
                                        </Button>
                                    }
                                    {groupName !== null && (
                                        <>
                                            <Typography variant="h6" component="h2" color="text.secondary" sx={{ textAlign: 'left', padding: '2rem'}}>
                                                Group name: {groupName}
                                            </Typography>
                                            <Button 
                                            variant="contained" 
                                            onClick={handleInviteFriendsToGroupClick} 
                                            sx={{ 
                                                fontSize: '1.5rem',
                                                alignSelf: 'center',  
                                                marginTop: '4rem',  
                                            }}
                                            > 
                                                Invite other friends
                                            </Button>
                                        </>
                                    )}
                                    </>
                                )}
                                {userStatus === 'managing' && (
                                    <>
                                        <Button 
                                        variant="contained" 
                                        onClick={handleCloseBattleClick} 
                                        sx={{ 
                                            fontSize: '1.5rem',
                                            alignSelf: 'center',  
                                            marginTop: '4rem',  
                                        }}
                                        > 
                                            Close Battle
                                        </Button>
                                    </>
                                )}
                                </>
                            )}
                            {battleStatus !== 'future' && (
                                <>
                                <Button 
                                variant="contained" 
                                onClick={handleViewBattleResultClick} 
                                sx={{ 
                                    fontSize: '1.5rem',
                                    alignSelf: 'center',  
                                    marginTop: '4rem',  
                                }}
                                > 
                                    View Battle Result
                                </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}