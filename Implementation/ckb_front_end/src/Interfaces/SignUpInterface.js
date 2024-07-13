import React, {useEffect, useState} from "react";
import { LOGIN_URL, HOMEPAGE_URL} from "../Configuration/Environment";
import {Navigate, useNavigate} from "react-router";
import Box from "@mui/material/Box";
import {CustomInputTextField} from "../CustomComponents/CustomInputTextField";
import {CustomLoadingButton} from "../CustomComponents/CustomLoadingButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import {isTokenAcceptable, signUp} from "../CallsHandling/DatabaseInteractionManager";
import logo from '../ApplicationPictures/ckb_round_logo.png';
import {getToken} from "../Utility/LocalStorageSaver";

export const SignUpInterface = (props) => {

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSendingCredentials, setIsSendingCredentials] = useState(false);
    const [isTokenAccepted, setIsTokenAccepted] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await isTokenAcceptable(getToken());
                setIsTokenAccepted(response.isValid);
            } catch (error) {
                console.log(error);
            }
        };
    
        checkToken();
    }, []);

    const makeSignUp = () => {
        if (password1 !== password2) {
            setErrorMessage("Passwords do not match");
            setIsSendingCredentials(false);
            return;
        }

        let credentialsJson = {
            "email": email,
            "password": password1,
            "firstname": firstname,
            "lastname": lastname
        }

        signUp(credentialsJson)
            .then(response => {
                setMessage(response.message);
                setErrorMessage("");
                navigate(LOGIN_URL);
            })
            .catch((error) => {
                setMessage("");
                setErrorMessage(error.message);
            })
            .finally(() => setIsSendingCredentials(false))
    }

    return (
        <>
            {isTokenAccepted &&
                <Navigate to={HOMEPAGE_URL} replace={true} />
            }

            {!isTokenAccepted &&
                <Box sx={{flexGrow: 1 }} display={"flex"} flexDirection={"column"} alignItems={"center"} >
                    <AppBar position="static" sx={props.sx}>
                        <Toolbar>
                            <img src={logo} alt="Logo" style={{height: '40px', /*borderRadius: '50%'*/}} />
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center'}}>
                                {"Sign-Up to Code Kata Battle!"}
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Box sx={{my: "10.1vh", gap:'10px'}} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} minWidth={"25.2vw"}
                         maxWidth={{
                             lg: "32vw"
                         }}>
                        <CustomInputTextField sx={{mt: 1}}label={"First name"} onChange={setFirstname} />
                        <CustomInputTextField sx={{mt: 1}}label={"Last Name"} onChange={setLastname} />
                        <CustomInputTextField sx={{mt: 1}}label={"e-mail"} onChange={setEmail} />
                        <CustomInputTextField sx={{mt: 1}} label={"Password"} type={"password"} onChange={setPassword1} />
                        <CustomInputTextField sx={{mt: 1}} label={"Repeat Password"} type={"password"} onChange={setPassword2} />

                        <CustomLoadingButton sx={{mt: 1}} loadingVariable={isSendingCredentials} setter={setIsSendingCredentials} text={"Sign-Up"} mainFunction={makeSignUp}/>

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
                </Box>
            }
        </>
    );
}