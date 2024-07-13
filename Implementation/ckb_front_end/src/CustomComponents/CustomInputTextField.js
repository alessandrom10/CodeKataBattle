import TextField from "@mui/material/TextField";
import React from "react";

export const CustomInputTextField = (props) => {

    return (
            <TextField
                sx = {{...props.sx, width: props.width || 'auto' }}
                type={props.type}
                label={props.label}
                value={props.value}
                variant="outlined"
                onChange={(e) => props.onChange(e.currentTarget.value)}
                multiline={props.multiline}
                rows={props.rows}
            />
    );
}