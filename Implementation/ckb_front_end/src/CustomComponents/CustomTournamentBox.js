import React from 'react';
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

export const CustomTournamentBox = ({ tournament }) => {

    const { name, lastChange, status, numberOfPartecipants, description, image, id, deadLineSubscription } = tournament;

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();
    const handleSubscribeClick = () => {
        navigate(TOURNAMENT_PAGE_URL, { state: id });
      };

    return (
        <>
            <Card sx={{
                width: '100%', 
                borderRadius: '15px', 
                boxShadow: 3, 
                position: 'relative', 
                backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)), url(${image ? `data:image/jpeg;base64,${image}` : backgroundImg})`,/*backgroundImage: backgroundImg,*/
                backgroundSize: '50% 100%',
                backgroundPosition: 'right',
                backgroundRepeat: 'no-repeat',
                border: `2px solid ${colors.logo_blue}`}}>
                <CardContent sx={{ padding: 5 }}>
                    <Typography variant="h5" component="div" sx={{ marginBottom: 1, marginX: 3 }}>
                        {`${name}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 auto', marginBottom: 1, marginTop: 2 }}>
                        {`Participants: ${numberOfPartecipants}`}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ flex: '0 0 auto', marginBottom: 1 }}>
                        {`Subscription deadline: ${deadLineSubscription}`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2}}>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0 }}>
                            Status:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 0, marginLeft: 1, color: status === 'subscribed' ? 'green' : status === 'not subscribed' ? 'red' : 'inherit' }}>
                            {`${status}`}
                            {status === 'subscribed' ? ' 🟢' : status === 'not subscribed' ? ' 🔴' : ' 🔨'}
                        </Typography>
                    </Box>
                </CardContent>
                <IconButton 
                    onClick={handleOpen}
                    sx={{ 
                        position: 'absolute', 
                        right: 5, 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.7)' 
                    }}
                >
                    <ArrowForwardIos sx={{color: `${colors.logo_red}`}}/>
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
                    backgroundImage: `url(${image ? `data:image/jpeg;base64,${image}` : backgroundImg})`,
                    backgroundSize: '100% 50%',
                    backgroundPosition: 'top',
                    backgroundRepeat: 'no-repeat',
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
                        top: '25%',
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
                        height: '50%', 
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
                            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', padding: '2rem'}}>
                            {`${description.slice(0, 250)}${description.length > 750 ? '...' : ''}`}
                            </Typography>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'flex-start', 
                            alignItems: 'left', 
                            width: '50%', 
                            height: '100%', 
                            position: 'absolute',
                            bottom: 0,
                            left: '47.5%',
                        }}>
                            <Typography variant="h6" color="text.secondary" component="h2" sx={{ textAlign: 'left', padding: '0.5rem', marginTop: 4}}>
                                {`Participants: ${numberOfPartecipants}`}
                            </Typography>
                            <Typography variant="h6" color="text.secondary" component="h2" sx={{ textAlign: 'left', padding: '0.5rem', marginBottom: 2}}>
                                {`Subscription deadline: ${deadLineSubscription}`}
                            </Typography>
                            
                            <Button 
                                variant="contained" 
                                onClick={handleSubscribeClick} 
                                sx={{ 
                                    fontSize: '1.5rem',
                                    alignSelf: 'center',  
                                    marginTop: 'auto',  
                                    marginBottom: '10%',
                                }}
                            > 
                                {status === 'subscribed' ? 'Jump into' : 
                                 status === 'managing' ? 'Manage' : 
                                 status === 'not subscribed' && new Date(deadLineSubscription) >= new Date() ? 'Subscribe' : 
                                 'Spectate'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}