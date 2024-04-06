import { ACTIONS } from "./App"
//take in the prop that is our digit, ad well as our dispatch so we can call the reducer from here
// eslint-disable-next-line react/prop-types, no-unused-vars
export default function OperationButton({dispatch, operation, strOperation}) {
    //this button has an onClick event that calls the add_digit function, and passes along the digit we want to add from app.js
    return <button className={`btn btn-${strOperation}`} onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {operation}})} >{operation}</button>
}