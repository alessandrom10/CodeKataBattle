import React from "react";
import { CustomAppBar } from "../CustomComponents/CustomAppBar";
import {CustomInputTextField} from "../CustomComponents/CustomInputTextField";
import {useState} from "react";
import Box from "@mui/material/Box";
import { useDropzone } from "react-dropzone";
import { createTournament } from "../CallsHandling/DatabaseInteractionManager";
import { CustomLoadingButton } from "../CustomComponents/CustomLoadingButton";
import Typography from "@mui/material/Typography";
import { getToken } from "../Utility/LocalStorageSaver";
import { HOMEPAGE_URL } from "../Configuration/Environment";
import { useNavigate } from "react-router";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const CreateTournamentInterface = () => {

    const [tournamentName, setTournamentName] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [isCreatingTournament, setIsCreatingTournament] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [subscriptionDeadline, setSubscriptionDeadline] = useState(dayjs().add(7, 'day').toDate());

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/jpeg',
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 1) {
                // Show an error message
                console.error("You can only drop one file");
                return;
            }
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const navigate = useNavigate();

    const images = files.map(file => (
        <div key={file.name}>
            <div>
                <img src={file.preview} style={{width: '50px'}} alt="preview" />
            </div>
        </div>
    ));

    const tournamentCreation = () => {
        setIsCreatingTournament(true);

        if (files.length === 0) {
            setMessage("");
            setErrorMessage("Please upload an image.");
            setIsCreatingTournament(false);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = () => {
            let tournamentJson = {
                "name": tournamentName,
                "description": description,
                "image": reader.result,
                "deadline": subscriptionDeadline
            }

            createTournament(getToken(), tournamentJson)
                .then(response => {
                    setIsCreatingTournament(false);
                    setMessage(response.message);
                    setErrorMessage("");
                    console.log(response);
                    navigate(HOMEPAGE_URL);
                })
                .catch((error) => {
                    setMessage("");
                    setErrorMessage(error.message);
                    setIsCreatingTournament(false);
                    console.log(error);
                })
        }
    }

    return (
        <>
            <CustomAppBar title={"Create a new Tournament"} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{my: "10.1vh", gap: '20px', width: '100%'}} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
                    <CustomInputTextField sx={{mt: 1, MarginTop: '50px'}}label={"Tournament Name"} onChange={setTournamentName}/>
                    <CustomInputTextField sx={{mt: 1, minWidth: '40%'}}label={"Description"} onChange={setDescription} multiline rows={4} fullWidth/>
                    <DatePicker label="Subscription Deadline" value={subscriptionDeadline} onChange={(newValue) => setSubscriptionDeadline(newValue)} renderInput={(params) => <TextField {...params} />} inputFormat="DD/MM/YYYY"/>
                    <div {...getRootProps({className: 'dropzone', style: {border: '2px dashed #eeeeee', padding: '20px', borderRadius: '15px'}})}>
                        <input {...getInputProps()} />
                        <p>Upload the tournament image here</p>
                    </div>
                    <aside>
                        <h4>Image Preview</h4>
                        <ul>{images}</ul>
                    </aside>
                    <CustomLoadingButton sx={{mt: 1}} loadingVariable={isCreatingTournament} setter={setIsCreatingTournament} text={"Create a new Tournament"} mainFunction={tournamentCreation}/>
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
            </LocalizationProvider>
        </>
    );
}