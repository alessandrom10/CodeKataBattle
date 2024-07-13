import Card from "@mui/material/Card";
import {CardContent} from "@mui/material";
import {SingleTupleDisplayer} from "./SingleTupleDisplayer";

//this component, as well as the other components in this folder, are just a better looking and easier
//to implement way of showing data/fields
export const TupleManager = (props) => {

   return (
        <>
            {props.arrayOfTuples.map(singleElement =>
                <Card variant="outlined" sx={props.sx} >
                    <CardContent>
                        <SingleTupleDisplayer tuple={singleElement} />
                    </CardContent>
                </Card>
            )}
        </>
    );
}