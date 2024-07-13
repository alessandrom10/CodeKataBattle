import axios from "axios";
const API_URL = "http://localhost:8081";
const LOGIN_URL = "/api/accountInterface/login";
const SIGNUP_URL = "/api/accountInterface/register";
const IS_TOKEN_ACCEPTED_URL = "/api/accountInterface/isAcceptedToken";
const GET_USERNAME_URL = "/api/accountInterface/getMyUser";
const GET_TOURNAMENTS_OF_USER_URL = "/api/tournamentInterface/getMyOngoingTournaments";
const GET_USER_SUBSCRIBED_TOURNAMENTS_URL = "/api/accountInterface/getUsersSubscribedToTournament";
const GET_ONGOING_BATTLES_FROM_TOURNAMENT_URL = "/api/battleInterface/getOngoingBattlesFromTournament";
const GET_ONGOING_MANAGING_TOURNAMENT = "/api/tournamentInterface/getMyOngoingManagedTournaments";
const GET_TOURNAMENT_INFOS = "/api/tournamentInterface/getTournamentWithUUID";
const CREATE_TORUNAMENT_URL = "/api/tournamentInterface/insertTournament";
const GET_TOURNAMENT_USER_STATUS = "/api/tournamentInterface/getTournamentUserStatus";
const SUBSCRIBE_TO_A_TOURNAMENT = "/api/tournamentInterface/addUserToTournament";
const GET_TOURNAMENT_BATTLES = "/api/battleInterface/getBattlesFromTournament";
const GET_BATTLE_USER_STATUS = "/api/battleInterface/getBattleUserStatus";
const CLOSE_BATTLE_URL = "/api/battleInterface/closeBattle";
const ADD_USER_INTO_GROUP = "/api/groupInterface/addUserToGroup";
const ADD_EDUCATOR_TO_TOURNAMENT = "/api/tournamentInterface/addEducatorManageTournament";
const GET_MY_GROUP_IN_BATTLE = "/api/groupInterface/getMyGroupInBattle";
const ENROLL_INTO_BATTLE = "/api/battleInterface/enrollMeInBattle";
const INVITE_USER_TO_GROUP = "/api/notificationInterface/inviteUserToGroup";
const INVITE_EDUCATOR_TO_TOURNAMENT = "/api/notificationInterface/inviteEducatorToManageTournament";
const GET_NOTIFICATION = "/api/notificationInterface/getMyNotifications";
const GET_GROUPS_OF_BATTLE = "/api/groupInterface/getGroupsOfBattle";
const GET_ALL_TOURNAMENTS = "/api/tournamentInterface/getTournaments";
const CLOSE_TOURNAMENT = "/api/tournamentInterface/closeTournament";
const CREATE_BATTLE_URL = "/api/battleInterface/insertBattle";
const DELETE_NOTIFICATION_URL = "/api/notificationInterface/delete";
const GET_TOURNAMENT_SCORE = "/api/tournamentInterface/getUserScoresInTournamentWithUuid";
const CREATE_GROUP_URL = "/api/groupInterface/insertGroup";

// this call logs in the user
export const login = async (credentialsJson) => {
    try {
        let response = await axios.post(API_URL + LOGIN_URL, JSON.stringify(credentialsJson),{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let data = {
            token: response.data.cipheredTokenString,
            message: response.data.message
        }
        return data;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

// checks that the token is valid
export const isTokenAcceptable = async (token) => {
    try{
        let response = await axios.get(API_URL + IS_TOKEN_ACCEPTED_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        if (response.data) {
            let data = {
                isValid: response.data,
                message: "Token is valid"
            }
            return data;    
        } else {
            let data = {
                isValid: false,
                message: "Token is not valid"
            }
            return data;
        }
    } catch (error) {
        console.log(error);
        let data = {
            isValid: false,
            message: "Token is not valid"
        }
        throw data;
    }
}

// sing up function
export const signUp = async (credentialsJson) => {
    let message = {
        email: credentialsJson.email,
        password: credentialsJson.password,
        username: credentialsJson.firstname + " " + credentialsJson.lastname,
        phoneNumber: "", 
        calendarId: ""
    }
    try {
        let response = await axios.post(API_URL + SIGNUP_URL, JSON.stringify(message), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            return ({message: 'User created successfully'});
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

// get the info of the user
export const getUsername = async (token) => {
    try {
        let response = await axios.get(API_URL + GET_USERNAME_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get the list of tournaments of the user (educator or not).
export const getTournamentsOfUser = async (token) => {
    try {
        // get the list of tournaments in wich the user is partecipating
        let active_subscribed_tournaments = await axios.get(API_URL + GET_TOURNAMENTS_OF_USER_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        active_subscribed_tournaments = active_subscribed_tournaments.data
            /*.filter(tournament => tournament.dateClosure === null)*/
            .map(tournament => ({
                name: tournament.name,
                id: tournament.uuid,
                description: tournament.description,
                deadLineSubscription: tournament.deadlineSubscription,
                lastChange: null,
                image: tournament.filePicturePath,
                numberOfPartecipants: null,
                status: "subscribed"
            }));
        
        // get the list of the tournaments in wich the user is the educator
        let active_managing_tournaments = await axios.get(API_URL+GET_ONGOING_MANAGING_TOURNAMENT, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        active_managing_tournaments = active_managing_tournaments.data
            .map(tournament => ({
                name: tournament.name,
                id: tournament.uuid,
                description: tournament.description,
                deadLineSubscription: tournament.deadlineSubscription,
                lastChange: null,
                image: tournament.filePicturePath,
                numberOfPartecipants: null,
                status: "managing"
            }));

        // get all the tournaments of the users
        let tournaments = [...active_subscribed_tournaments, ...active_managing_tournaments];

        // get the number of partecipants for each tournament
        let partecipating_counts = await Promise.all(
            tournaments.map(tournament =>
                axios.get(API_URL + GET_USER_SUBSCRIBED_TOURNAMENTS_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'tournamentUuid': `${tournament.id}`
                    }
                })
            )
        );
        tournaments.forEach((tournament, index) => {
            tournament.numberOfPartecipants = partecipating_counts[index].data.length;
        });

        // get the last change for each tournament
        let last_changes = await Promise.all(
            tournaments.map(tournament =>
                axios.get(API_URL + GET_ONGOING_BATTLES_FROM_TOURNAMENT_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'tournamentUuid': `${tournament.id}`
                    }
                })
            )
        );
        tournaments.forEach((tournament, index) => {
            if (Array.isArray(last_changes[index].data) && last_changes[index].data.length > 0) {
                tournament.lastChange = last_changes[index].data[0].deadlineRegistration;
            } else {
                tournament.lastChange = "Never";
            }
        })

        // sort the tournaments by last change
        tournaments.sort((a, b) => {
            if (a.lastChange === "Never") return 1; 
            if (b.lastChange === "Never") return -1; 
            return new Date(b.lastChange) - new Date(a.lastChange);
        });

        return tournaments;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getPopularTournaments = async (token) => {
    try{

        // get all the tournaments
        let all_tournaments = await axios.get(API_URL + GET_ALL_TOURNAMENTS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        //filter only active tournaments
        all_tournaments.data = all_tournaments.data.filter(tournament => tournament.dateClosure === null);

        // get all the tournaments in which the user is partecipating or managing
        let active_subscribed_tournaments = await getTournamentsOfUser(token);

        let popularTournaments = all_tournaments.data.filter(tournament => {
            return !active_subscribed_tournaments.some(subscribedTournament => {
                return subscribedTournament.id === tournament.uuid;
            });
        });

        // remove such tournaments
        let popularTournamentsIds = popularTournaments.map(tournament => tournament.uuid);

        // generate the tournament objects to be displayed
        let results = await Promise.all(popularTournamentsIds.map(id => getTournament(token, id)));

        return results;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get the info of a tournament given the id
export const getTournament = async (token, id) => {
    try{

        // fetch the tournament general infos
        let database_tournament = await axios.get(API_URL + GET_TOURNAMENT_INFOS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${id}`
            }
        });
        console.log(database_tournament)
        let tournament = {
            name: database_tournament.data.name,
            id: database_tournament.data.uuid,
            description: database_tournament.data.description,
            deadLineSubscription: database_tournament.data.deadlineSubscription,
            lastChange: null,
            image: database_tournament.data.filePicturePath,
            numberOfPartecipants: null,
            status: null
        }

        // fetch the count of partecipants
        let partecipating_count = await axios.get(API_URL + GET_USER_SUBSCRIBED_TOURNAMENTS_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${tournament.id}`
            }
        });
        tournament.numberOfPartecipants = partecipating_count.data.length;

        // fetch the last change
        let last_change = axios.get(API_URL + GET_ONGOING_BATTLES_FROM_TOURNAMENT_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${tournament.id}`
            }
        });
        if (Array.isArray(last_change.data) && last_change.data.length > 0) {
            tournament.lastChange = last_change.data[0].deadlineRegistration;
        } else {
            tournament.lastChange = "Never";
        }

        // fetch the user status
        let user_status = await axios.get(API_URL + GET_TOURNAMENT_USER_STATUS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${tournament.id}`,
            }
        });
        if (user_status.data === "SUBSCRIBED") {
            tournament.status = "subscribed";
        } else if (user_status.data === "MANAGING") {
            tournament.status = "managing";
        } else {
            tournament.status = "not subscribed";
        }

        return tournament;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// creates a new tournament
export const createTournament = async (token, tournamentJson) => {
    console.log(tournamentJson.image)
    let message = {
        name: tournamentJson.name,
        description: tournamentJson.description,
        deadlineSubscription: tournamentJson.deadline,
        filePicture: tournamentJson.image
    }
    try {
        let response = await axios.post(API_URL + CREATE_TORUNAMENT_URL, JSON.stringify(message), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            return ({message: 'Tournament created successfully'});
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

// subscribe the user to a tournament
export const subscribe = async (token, id) => {
    try{
        let user = await getUsername(token);
        user = user.uuid;
        let response = await axios.post(API_URL + SUBSCRIBE_TO_A_TOURNAMENT, null,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${id}`,
                'userUuid': `${user}`
            }
        });
        if (response.data){
            return({message: 'User subscribed successfully'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get the list of battles of the tournament
export const getBattlesOfTournament = async (token, id) => {
    try{
        // get the battles of the tournament
        let battles = await axios.get(API_URL + GET_TOURNAMENT_BATTLES, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${id}`
            }
        });
        battles = battles.data.map(battle => {
            const currentDate = new Date();
            const startDate = new Date(battle.deadlineRegistration);
            const endDate = new Date(battle.deadlineFinalSubmission);
            let battleStatus;

            if (battle.closedEarly || endDate < currentDate) {
                battleStatus = "past";
            } else if (startDate > currentDate) {
                battleStatus = "future";
            } else if (startDate <= currentDate && currentDate <= endDate) {
                battleStatus = "active";
            }

            return {
                name: battle.name,
                description: battle.description,
                startDate: battle.deadlineRegistration,
                endDate: battle.deadlineFinalSubmission,
                teamMinimumSize: battle.groupSizeMinimum,
                teamMaximumSize: battle.groupSizeMaximum,
                battleStatus: battleStatus,
                battleId: battle.uuid,
                associatedTournament: id,
                codeKataUrl: battle.repositoryLink,
                closedEarly: battle.closedEarly
            };
        });
        return battles;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// enroll to a battle
export const enroll = async (token, id) => {
    try{
        let response = await axios.post(API_URL + ENROLL_INTO_BATTLE, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'battleUuid': `${id}`
            }
        });
        if (response.data) {
            return ({message: 'Enrollment into battle successfull'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get the status of a user in respect to a battle
export const getUserStatusBattlewise = async (token, id) => {
    try{

        // get the status of the user in respect to the battle
        let userStatus = await axios.get(API_URL + GET_BATTLE_USER_STATUS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'battleUuid': `${id}`
            }
        });
        console.log(userStatus);

        let status = {
            userStatus: null,
            groupName: null,
            groupId: null
        }
        switch(userStatus.data) {
            case "ENROLLED":
                status.userStatus = "enrolled";
                break;
            case "MANAGING":
                status.userStatus = "managing";
                break;
            case "EXTERNAL":
                status.userStatus = "not enrolled";
                break;
            default:
                status.userStatus = "unknown";
        }

        let group = await axios.get(API_URL + GET_MY_GROUP_IN_BATTLE, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'battleUuid': `${id}`
            }
        });

        if(group.data && group.data !== '') {
            status.groupName = group.data.name;
            status.groupId = group.data.uuid;
        }

        return status;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// close battle
export const closeBattle = async (token, id) => {
    try{
        let response = await axios.post(API_URL + CLOSE_BATTLE_URL, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'battleUuid': `${id}`,
                'motivation': 'The battle has been closed early.'
            }
        });
        if (response.data) {
            return ({message: 'Battle closed successfully'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// close a tournament
export const closeTournament = async (token, id) => {
    try{
        let tournament = await getTournament(token, id);
        let response = await axios.post(API_URL + CLOSE_TOURNAMENT, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${id}`,
                'motivation': `The tournament ${tournament.name} has been closed early.`
            }
        });
        if (response.data) {
            return ({message: 'Tournament closed successfully'});
        }
    }catch (error) {
        console.log(error);
        throw error;
    }
}

// add user to a group
export const addUserToGroup = async (token, groupId) => {
    try{
        let user = await getUsername(token);
        let email = user.email;
        console.log(email);
        console.log(groupId);
        console.log(token);
        let response = await axios.post(API_URL + ADD_USER_INTO_GROUP, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'groupUuid': `${groupId}`,
                'userEmail': `${email}`
            }
        });
        if (response.data) {
            return ({message: 'Invite sent successfully'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// add an educator to a tournament
export const addEducatorToTournament = async (token, tournamentId) => {
    try{
        let user = await getUsername(token);
        let tournament = await getTournament(token, tournamentId);
        let email = user.email;
        console.log(email);
        console.log(tournamentId);
        console.log(token);
        console.log(tournament);
        let response = await axios.post(API_URL + ADD_EDUCATOR_TO_TOURNAMENT, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${tournamentId}`,
                'userEmail': `${email}`
            }
        });
        if (response.data) {
            return ({message: 'Invite sent successfully'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// invite user to a group
export const inviteUserToGroup = async (token, email, groupId) => {
    try{
        let response = await axios.put(API_URL + INVITE_USER_TO_GROUP, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'groupUuid': `${groupId}`,
                'userEmail': `${email}`
            }
        });
        if (response.data) {
            return ({message: 'Invite sent successfully'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// invite educator to a tournament
export const inviteEducatorToTournament = async (token, email, tournamentId) => {
    try{
        let response = await axios.put(API_URL + INVITE_EDUCATOR_TO_TOURNAMENT, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${tournamentId}`,
                'userEmail': `${email}`
            }
        });
        if (response.data) {
            return ({message: 'Invite sent successfully'});
        }
    } catch (error) {   
        console.log(error);
        throw error;
    }
}

// get the user notifications
export const getNotifications = async (token) => {
    try{
        let response = await axios.get(API_URL + GET_NOTIFICATION, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        console.log(response);
        let notifications = response.data.map(notification => ({
            message: notification.text,
            id: notification.uuid,
            relatedUuid: notification.relatedUuid,
            type: notification.notificationCategory === 'TOURNAMENT_MANAGE_INVITATION' ? 'tournament_invite' :
                  notification.notificationCategory === 'GROUP_PARTECIPATION_INVITATION' ? 'battle_invite' : null
        }));
        return notifications;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// get the groups of the battle
export const getGroupsOfBattle = async (token, id) => {
    try{
        let response = await axios.get(API_URL + GET_GROUPS_OF_BATTLE, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'battleUuid': `${id}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// create a new battle
export const createBattle = async (token, battleJson) => {
    try{
        let message = {
            tournamentUuid: battleJson.tournamentId,
            name: battleJson.name,
            description: battleJson.battleDescription,
            groupSizeMinimum: battleJson.team_size_minimum,
            groupSizeMaximum: battleJson.team_size_maximum,
            deadlineRegistration: battleJson.start_date,
            deadlineFinalSubmission: battleJson.end_date,
            dateClosure:battleJson.end_date,
            codeKataFiles: battleJson.codekata,
            executableName: battleJson.runner
        }
        let response = await axios.post(API_URL + CREATE_BATTLE_URL, JSON.stringify(message), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            return ({message: 'Battle created successfully'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteNotification = async (token, id) => {
    try{
        let response = await axios.delete(API_URL + DELETE_NOTIFICATION_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'notificationUuid': `${id}`
            }
        });
        if (response.data) {
            return ({message: 'Notification deleted successfully'});
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTournamentScores = async (token, id) => {
    try{
        let response = await axios.get(API_URL + GET_TOURNAMENT_SCORE, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'tournamentUuid': `${id}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createGroup = async (token, groupJson) => {
    try{
        let response = await axios.post(API_URL + CREATE_GROUP_URL, JSON.stringify(groupJson), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.data) {
            return ({message: 'Group created successfully'});
        }
    }catch (error) {
        console.log(error);
        throw error;
    }
}
