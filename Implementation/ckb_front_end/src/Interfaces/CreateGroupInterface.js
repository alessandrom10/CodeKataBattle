import React from "react";
import { CustomAppBar } from "../CustomComponents/CustomAppBar";
import {CustomInputTextField} from "../CustomComponents/CustomInputTextField";
import {useState} from "react";
import Box from "@mui/material/Box";
import { useDropzone } from "react-dropzone";
import { createTournament } from "../CallsHandling/Stub";
import { CustomLoadingButton } from "../CustomComponents/CustomLoadingButton";
import Typography from "@mui/material/Typography";
import { getToken } from "../Utility/LocalStorageSaver";
import { HOMEPAGE_URL, TOURNAMENT_PAGE_URL } from "../Configuration/Environment";
import { useNavigate } from "react-router";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useLocation } from "react-router-dom";
import { createGroup } from "../CallsHandling/DatabaseInteractionManager";

export const CreateGroupInterface = () => {

    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    

    const navigate = useNavigate();
    const location = useLocation();

    const {battleId, id} = location.state;

    const groupCreation = () => {
        setIsCreatingGroup(true);
        let groupJson = {
            "name": groupName,
            "uuidBattle": battleId
        }
        createGroup(getToken(), groupJson)
            .then(response => {
                setIsCreatingGroup(false);
                setMessage(response.message);
                setErrorMessage("");
                console.log(response);
                navigate(TOURNAMENT_PAGE_URL, {state: id});
            })
            .catch((error) => {
                setMessage("");
                setErrorMessage(error.message);
                setIsCreatingGroup(false);
                console.log(error);
            })
    }

    return (
        <>
            <CustomAppBar title={"Create a new Group"} />
            <Box sx={{my: "10.1vh", gap: '20px', width: '100%'}} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
                <CustomInputTextField sx={{mt: 1, MarginTop: '50px'}}label={"Group Name"} onChange={setGroupName}/>
                <CustomLoadingButton sx={{mt: 1}} loadingVariable={isCreatingGroup} setter={setIsCreatingGroup} text={"Create a new Group"} mainFunction={groupCreation}/>
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
    );
}