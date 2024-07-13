import React, {useEffect, useState} from "react";
import {
    HOMEPAGE_URL,
    SIGNUP_URL
} from "../Configuration/Environment";
import {Navigate, useNavigate} from "react-router";
import Box from "@mui/material/Box";
import {CustomInputTextField} from "../CustomComponents/CustomInputTextField";
import {CustomLoadingButton} from "../CustomComponents/CustomLoadingButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import {getToken, setToken} from "../Utility/LocalStorageSaver";
import { login , isTokenAcceptable} from "../CallsHandling/DatabaseInteractionManager";
import { Link } from 'react-router-dom';
import logo from '../logo.png';


export const LoginInterface = (props) => {

    const [password, setPassword] = useState("");
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

    const makeLogin = () => {

        let credentialsJson = {
            "email": email,
            "password": password,
        }

        login(credentialsJson)
            .then(response => {
                setMessage(response.message);
                setErrorMessage("");
                setToken(response.token);
                navigate(HOMEPAGE_URL);
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
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center'}}>
                                {"Welcome to Code Kata Battle!"}
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Box sx={{my: "10.1vh", gap:'20px'}} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} minWidth={"25.2vw"}
                         maxWidth={{
                             lg: "32vw"
                         }}>
                        <img src={logo} alt="Logo" style={{marginBottom: '20px', width: '60px', height: '60px'}} />
                        <CustomInputTextField sx={{mt: 1}}label={"e-mail"} onChange={setEmail} />
                        <CustomInputTextField sx={{mt: 1}} label={"Password"} type={"password"} onChange={setPassword} />

                        <CustomLoadingButton sx={{mt: 1}} loadingVariable={isSendingCredentials} setter={setIsSendingCredentials} text={"Login"} mainFunction={makeLogin}/>

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
                        <Link to={SIGNUP_URL} style={{color: '#2196f3'}}>Sign Up</Link>
                    </Box>
                </Box>
            }
        </>
    );
}