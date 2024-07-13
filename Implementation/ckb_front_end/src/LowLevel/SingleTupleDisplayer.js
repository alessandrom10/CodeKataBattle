import {SingleFieldDisplayer} from "./SingleFieldDisplayer";

export const SingleTupleDisplayer = (props) => {

    return (
        <>
            {Object.entries(props.tuple).map(singleField =>
                <SingleFieldDisplayer key={singleField} label={singleField[0]} value={singleField[1]}/>)}
        </>
    );
}