import React from "react";
import { CustomAppBar } from "../CustomComponents/CustomAppBar";
import { useLocation } from "react-router-dom";
import { CustomLoadingButton } from "../CustomComponents/CustomLoadingButton";
import { useState } from "react";
import { Toolbar } from "@mui/material";
import { CustomInputTextField } from "../CustomComponents/CustomInputTextField";
import { inviteUserToGroup } from "../CallsHandling/DatabaseInteractionManager";
import { getToken } from "../Utility/LocalStorageSaver";
import { TOURNAMENT_PAGE_URL } from "../Configuration/Environment";
import { useNavigate } from "react-router";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";

export const InviteUserToGroupInterface = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const {battleId, id, groupId, groupName} = location.state;

    const [email, setEmail] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const invite = () => {
        setIsInviting(true);
        inviteUserToGroup(getToken(), email, groupId)
            .then(response => {
                setMessage(response.message);
                setErrorMessage("");
                navigate(TOURNAMENT_PAGE_URL, {state: id});
            })
            .catch((error) => {
                setMessage("");
                setErrorMessage(error.message);
            })
            .finally(() => setIsInviting(false))
    }

    return (
        <>
            <CustomAppBar title={`Invite user to ${groupName} group`} position="fixed"/>
            <Toolbar />
            <Box display="flex" flexDirection="column" alignItems="center">
                <CustomInputTextField sx={{mt: 1, marginBottom: '20px'}}label={"e-mail"} onChange={setEmail} />
                <CustomLoadingButton sx={{mt: 1}} loadingVariable={isInviting} setter={setIsInviting} text={"Invite"} mainFunction={invite}/>
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
};