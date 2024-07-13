import Typography from "@mui/material/Typography";

export const SingleFieldDisplayer = (props) => {

    return (
        <>
            <div style={{"marginTop" : "10px"}}>
                <Typography variant="h8" component="span" sx={{flexGrow: 1, my: 2.05}} maxHeight={"5.1vh"} color={"#2196f3"}>
                    <span>
                        {props.label[0].toUpperCase() + props.label.substring(1) + ": "}
                    </span>
                </Typography>
                <Typography variant="h8" component="span" sx={{flexGrow: 1, my: 2.2}} maxHeight={"5.2vh"} color={"black"}>
                    <span>
                        {props.value}
			        </span>
                </Typography>
            </div>
        </>
    );
}