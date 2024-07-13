import React from "react";
import { CustomAppBar } from "../CustomComponents/CustomAppBar";
import {CustomInputTextField} from "../CustomComponents/CustomInputTextField";
import {useState} from "react";
import Box from "@mui/material/Box";
import { useDropzone } from "react-dropzone";
import { createBattle } from "../CallsHandling/DatabaseInteractionManager";
import { CustomLoadingButton } from "../CustomComponents/CustomLoadingButton";
import Typography from "@mui/material/Typography";
import { getToken } from "../Utility/LocalStorageSaver";
import { TOURNAMENT_PAGE_URL } from "../Configuration/Environment";
import { useNavigate } from "react-router";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { useLocation } from "react-router-dom";
import Slider from '@mui/material/Slider';

export const CreateBattleInterface = () => {

    const [battleName, setBattleName] = useState("");
    const [battleDescription, setBattleDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [isCreatingBattle, setIsCreatingBattle] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().toDate());
    const [endDate, setEndDate] = useState(dayjs().add(1, 'day').toDate());
    const [message, setMessage] = useState("");
    const [teamSize, setTeamSize] = useState([1, 4]);
    const [errorMessage, setErrorMessage] = useState("");
    const [executableName, setExecutableName] = useState("");

    const location = useLocation();
    const id = location.state;
    console.log(id);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'application/zip',
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 1) {
                console.error("You can only drop one file");
                return;
            }
            setFiles(acceptedFiles);
        }
    });

    const navigate = useNavigate();

    const battleCreation = () => {
        setIsCreatingBattle(true);

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            let base64 = reader.result.split(',')[1];

            let battleJson = {
                "tournamentId": id,
                "name": battleName,
                "battleDescription": battleDescription,
                "codekata": base64,
                "start_date": startDate,
                "end_date": endDate,
                "team_size_minimum": teamSize[0],
                "team_size_maximum": teamSize[1],
                "runner": executableName
            }

            createBattle(getToken(), battleJson)
                .then(response => {
                    setIsCreatingBattle(false);
                    setMessage(response.message);
                    setErrorMessage("");
                    console.log(response);
                    navigate(TOURNAMENT_PAGE_URL, { state: id});
                })
                .catch((error) => {
                    setMessage("");
                    setErrorMessage(error.message);
                    setIsCreatingBattle(false);
                    console.log(error);
                })
        };
        reader.onerror = error => console.log(error);
    }

    return (
        <>
            <CustomAppBar title={"Create a new Battle"} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{my: "10.1vh", gap: '25px', width: '100%'}} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
                <CustomInputTextField sx={{mt: 1, MarginTop: '50px'}}label={"Battle Name"} onChange={setBattleName}/>
                <CustomInputTextField sx={{mt: 1, minWidth: '40%'}}label={"Description"} onChange={setBattleDescription} multiline rows={4} fullWidth/>
                
                <DatePicker label="Start date" value={startDate} onChange={(newValue) => setStartDate(newValue)} renderInput={(params) => <TextField {...params} />} inputFormat="DD/MM/YYYY"/>
                <DatePicker label="End date" value={endDate} onChange={(newValue) => setEndDate(newValue)} renderInput={(params) => <TextField {...params} />} inputFormat="DD/MM/YYYY"/>

                
                <Box sx={{ width: '30%', margin: '0 auto' }}>
                    <Typography sx={{ textAlign: 'center' }}>
                        Team sizes
                    </Typography>
                    <Slider
                        value={teamSize}
                        onChange={(event, newValue) => {
                            setTeamSize(newValue);
                        }}
                        valueLabelDisplay="auto"
                        min={1}
                        max={10}
                    />
                </Box>
                <div {...getRootProps({className: 'dropzone', style: {border: '2px dashed #eeeeee', padding: '20px', borderRadius: '15px'}})}>
                    <input {...getInputProps()} />
                    <p>Upload here your CodeKata</p>
                    {files.length > 0 && <p>Selected file: {files[0].name}</p>}
                </div>
                <CustomInputTextField sx={{mt: 1, MarginTop: '20px'}}label={"Executable name"} onChange={setExecutableName}/>
                <CustomLoadingButton sx={{mt: 1}} loadingVariable={isCreatingBattle} setter={setIsCreatingBattle} text={"Create a new Battle"} mainFunction={battleCreation}/>
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