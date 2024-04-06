import { ACTIONS } from "./App"
//take in the prop that is our digit, as well as our dispatch so we can call the reducer from here
// eslint-disable-next-line react/prop-types, no-unused-vars
export default function DigitButton({dispatch, digit}) {
    //this button has an onClick event that calls the add_digit function, and passes along the digit we want to add from app.js
    const escapedDigit = escape(digit);
    return <button className={`btn btn-${escapedDigit}`}onClick={() => dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit}})} >{digit}</button>
}