import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";

//this component is used to handle better looking and more easy to implement button that load until their
//request is satisfied

export const CustomLoadingButton = ({disabled= false, ...props}) => {

    return (
        <>
            {props.loadingVariable &&
                <LoadingButton
                    sx={props.sx}
                    onClick={() => {}}
                    loading={true}
                    endIcon={<SendIcon />}
                    loadingPosition="end"
                    variant="outlined"
                    disabled={disabled}
                >
                    {props.text}
                </LoadingButton>
            }

            {!props.loadingVariable &&
                <LoadingButton
                    sx={props.sx}
                    onClick={() => {
                        props.setter(true);
                        props.mainFunction();
                    }}
                    loading={false}
                    endIcon={<SendIcon />}
                    loadingPosition="end"
                    variant="outlined"
                    disabled={disabled}
                >
                    {props.text}
                </LoadingButton>
            }
        </>
    );
}