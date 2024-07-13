import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import React, {useState} from "react";
import {useNavigate} from "react-router";
import Drawer from "@mui/material/Drawer";
import {
    AddCircleOutlined,
    ArticleOutlined,
    ExitToAppOutlined,
    HomeOutlined,
    EmojiEventsOutlined,
    PersonAddOutlined
} from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {setToken} from "../Utility/LocalStorageSaver";
import { HOMEPAGE_URL, MY_TOURNAMENTS_URL, CREATE_TOURNAMENT_URL , CREATE_BATTLE_URL, TOURNAMENT_PAGE_URL, SHOW_RESULTS_URL, INVITE_EDUCATOR_TO_TOURNAMENT_URL} from "../Configuration/Environment";
import { useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import { getNotifications, addUserToGroup, addEducatorToTournament, deleteNotification, closeTournament } from "../CallsHandling/DatabaseInteractionManager";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getToken } from "../Utility/LocalStorageSaver";
import { useEffect } from "react";

import logo from '../ApplicationPictures/ckb_round_logo.png';

//this component handles the app bar at the top of the user's interface and its drawer
export const CustomAppBar = ({title, status, tournamentId, ...props}) => {

    const [isOpen, setIsOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationMenu, setNotificationMenu] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = getToken(); // Assuming you have a getToken function
            const notifications = await getNotifications(token);
            console.log(notifications);
            setNotifications(notifications);
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenuClick = (event) => {
        setNotificationMenu(event.currentTarget);
    };

    const handleNotificationMenuClose = () => {
        setNotificationMenu(null);
    };

    const handleDismissNotificationClick = (notificationId) => {
        deleteNotification(getToken(), notificationId);
        setNotifications(notifications.filter(notification => notification.id !== notificationId));
    };

    const handleAcceptNotificationClick = (notification) => {
        if (notification.type === 'tournament_invite') {
            addEducatorToTournament(getToken(), notification.relatedUuid);
        } else if (notification.type === 'battle_invite') {
            addUserToGroup(getToken(), notification.relatedUuid);
        }
        handleDismissNotificationClick(notification.id);
    };

    let navigate = useNavigate();
    let location = useLocation();
    
    const data = [
        { name: "Home", icon: <HomeOutlined />, path: `${HOMEPAGE_URL}` },
        { name: "Tournament list", icon: <ArticleOutlined />, path: `${MY_TOURNAMENTS_URL}` },
        { name: "Create a new tournament", icon: <AddCircleOutlined />, path: `${CREATE_TOURNAMENT_URL}` },
    ];

    const handleCreateBattleClick = () => {
        navigate(`${CREATE_BATTLE_URL}`, { state: tournamentId });
    };

    const handleViewTournamentResultsClick = () => {
        let scope = 'tournament';
        let id = tournamentId;
        navigate(`${SHOW_RESULTS_URL}`, { state: {id, scope} });
    };

    const handleInviteEducatorsClick = () => {
        let id = tournamentId;
        navigate(`${INVITE_EDUCATOR_TO_TOURNAMENT_URL}`, { state: id });
    };

    const handleCloseTournamentClick = async() => {
        await closeTournament(getToken(), tournamentId);
        navigate(`${HOMEPAGE_URL}`);
    };

    if (location.pathname === `${TOURNAMENT_PAGE_URL}`) {
        data.push({ name: "View tournament results", icon: <EmojiEventsOutlined />, click: handleViewTournamentResultsClick });
    }

    if (location.pathname === `${TOURNAMENT_PAGE_URL}` && status === "managing") {
        data.push({ name: "Create a new battle", icon: <AddCircleOutlined />, click: handleCreateBattleClick });
    }

    if (location.pathname === `${TOURNAMENT_PAGE_URL}` && status === "managing") {
        data.push({ name: "Invite a new educator", icon: <PersonAddOutlined />, click: handleInviteEducatorsClick });
    }

    if (location.pathname === `${TOURNAMENT_PAGE_URL}` && status === "managing") {
        data.push({ name: "Close Tournament", icon: <PersonAddOutlined />, click: handleCloseTournamentClick });
    }

    const signOutData = { name: "Sign out",  icon: <ExitToAppOutlined />, path: "/" };

    const getList = () => (
        <div style={{ minWidth: {xs: "61vw",lg: "1vw"}, display: 'flex', flexDirection: 'column', height: '100%' }} onClick={() => setIsOpen(false)}>
            {data.map((item, index) => (
                <React.Fragment key={index}>
                    <ListItem button onClick={item.click ? item.click : () => navigate(item.path, {replace: true})}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItem>
                    {item.name === "Create a new tournament" && <Divider />}
                </React.Fragment>
            ))}
            <div style={{ marginTop: 'auto' }}>
                <ListItem button onClick={() => {
                    setToken("");
                    navigate(signOutData.path, {replace: true})
                }}>
                    <ListItemIcon>{signOutData.icon}</ListItemIcon>
                    <ListItemText primary={signOutData.name} />
                </ListItem>
            </div>
        </div>
    );

    return (
        <>
            <AppBar position="fixed" sx={props.sx}>
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '5px', cursor: 'pointer' }} onClick={() => navigate("/home", {replace: true})}>
                            <img src={logo} alt="Logo" style={{height: '40px', borderRadius: '50%'}} />
                            <Typography variant="h6" component="div" sx={{ marginLeft: '10px' }}>
                                <span style={{color: '#1e3050'}}>CK</span><span style={{color: '#d86159'}}>B</span>
                            </Typography>
                        </div>
                    </div>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {title}
                    </Typography>
                    
                    <div style={{ display: 'flex', alignItems: 'center', opacity: 0 }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '5px', cursor: 'pointer' }} onClick={() => navigate("/home", {replace: true})}>
                                <img src={logo} alt="Logo" style={{height: '40px', borderRadius: '50%'}} />
                                <Typography variant="h6" component="div" sx={{ marginLeft: '10px' }}>
                                    <span style={{color: '#1e3050'}}>CK</span><span style={{color: '#d86159'}}>B</span>
                                </Typography>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="notifications"
                            onClick={handleNotificationClick}
                        >
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleNotificationClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={notification.message} />
                                        <IconButton onClick={handleNotificationMenuClick}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={notificationMenu}
                                            keepMounted
                                            open={Boolean(notificationMenu)}
                                            onClose={handleNotificationMenuClose}
                                        >
                                            {(notification.type === 'tournament_invite' || notification.type === 'battle_invite') && (
                                                <MenuItem onClick={() => handleAcceptNotificationClick(notification)}>Accept</MenuItem>
                                            )}
                                            <MenuItem onClick={() => handleDismissNotificationClick(notification.id)}>Dismiss</MenuItem>
                                        </Menu>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="Empty inbox" />
                                </ListItem>
                            )}
                        </Popover>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setIsOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>
                </Toolbar>
                <Drawer
                    anchor={"right"}
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                    {getList()}
                </Drawer>
            </AppBar>
            <Toolbar />
        </>
    );
}