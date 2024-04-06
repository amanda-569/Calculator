import { useReducer } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import './styles.css'

export const ACTIONS = {
  ADD_DIGIT : 'add-digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  CLEAR_CURRENT: 'clear_current',
  DELETE_DIGIT: 'delete_digit',
  EVALUATE: 'evaluate',
  SIGN: 'sign',
  PERCENTAGE: 'percentage',
  SQUAREROOT: 'square_root',
  MSTORE: 'memory_store',
  MRECALL: 'memory_recall',
  MCLEAR: 'memory_clear',
  MPLUS: 'memory_plus',
  MMINUS: 'memory_minus'
}
function reducer(state, {type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT: 
    // if overwrite is true then clear the current operand and replace it with the new entered digit, then set overwrite to false after
    if (state.overwrite) {
      return {
        ...state,
        currentOperand: payload.digit,
        overwrite: false
      }
    }
    // if theres one 0 already then the "return state" means dont make any more changes (dont add another zero to the already existing zero)
    if (payload.digit === "0" && state.currentOperand === "0") {return state}
    if (state.currentOperand == null && payload.digit === ".") {return state}
    if (payload.digit === "." && state.currentOperand.includes(".")) {return state} 
    return {
        ...state,
        //either create a brand new operand with just our digit, or it'll add the digit onto the end of the current operand
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
    }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      // if you mistyped your previous operation and want to correct it
      if (state.currentOperand == null)
      return {
    //return the number we had previously
        ...state,
        //but replace the operation with the newly typed one
        operation: payload.operation,
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          // make the current operand the previous operand
          previousOperand: state.currentOperand,
          // so we can type in our new operand
          currentOperand: null,
        }
      }
   
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.EVALUATE:
      // if we dont have all the info we need to execute the operation
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        // do nothing at all when you click the = button
        return state
      }
      //calculate the expression if you have everything needed
      return {
        ...state,
        // if you type in a number after the operation occurs, clear the console instead of appending more numbers to the end of your result
        overwrite: true,
        previousOperand: null,
        //null because no additional operation is passed, just the =
        operation: null,
        currentOperand: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      //if in overwrite state, return empty object
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      } 
      // if the current operand has no digit then dont do anything
      if (state.currentOperand == null) {return state}
      //if theres only one digit left in our operand then completely remove it
      if (state.currentOperand.length === 1) {
        //reset current operand to null instead of leaving an empty string
        return {...state, currentOperand: null}
      }
      return {
        ...state,
        //remove last digit from current operand
        currentOperand: state.currentOperand.slice(0,-1)
      }
    case ACTIONS.CLEAR:
      //return an empty state
      return {memory:state.memory}
    case ACTIONS.CLEAR_CURRENT:
      if (state.currentOperand == null) {return state}
      return {...state, currentOperand: null}

    case ACTIONS.SIGN:
      if (state.currentOperand == null)
        return state;
      
      
      return{
        ...state,
        currentOperand: (-parseFloat(state.currentOperand)).toString()
      }

      case ACTIONS.PERCENTAGE:
        if (state.currentOperand == null)
        return state;

        return{
          ...state,
          currentOperand: (state.currentOperand/100).toString()
        }
        case ACTIONS.SQUAREROOT:
          if (state.currentOperand == null)
          return state;
  
          return{
            ...state,
            currentOperand: (Math.sqrt(state.currentOperand)).toString()
          }
        case ACTIONS.MSTORE:

          if (state.currentOperand == null)
            return state;
          
          return{
              ...state,
              memory: state.currentOperand
            }
            case ACTIONS.MRECALL:
              if (state.memory == null)
                return state;
        
              return{
                  ...state,
                  currentOperand: state.memory
                }
                case ACTIONS.MPLUS:
                  if (state.currentOperand == null || state.memory == undefined || state.memory == "")
                    return state;
            
                  return{
                      ...state,
                      currentOperand: (parseFloat(state.currentOperand) + (parseFloat(state.memory))).toString()
                    }
                case ACTIONS.MMINUS:
                      if (state.currentOperand == null || state.memory == undefined || state.memory == "")
                        return state;
                
                      return{
                          ...state,
                          currentOperand: (parseFloat(state.currentOperand) - (parseFloat(state.memory))).toString()
                        }
                 case ACTIONS.MCLEAR:
                            return {...state,
                              memory: ""
                            }
                            
                    
                          
      
  }
}



function evaluate({currentOperand, previousOperand, operation}) {
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(previous) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = previous + current
      break
    case "-":
      computation = previous - current
      break
    case "÷":
      computation = previous / current
      break
    case "*":
      computation = previous * current
      break
    
  }
  return computation.toString()
}
const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  //only format the portion before the decimal place
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation, memory}, dispatch] = useReducer(reducer, {})
  
  return (
    <div className="calculator-grid">
      <div className='output'>
      <div className='memory'>
  {(memory !==undefined && memory !=="" ) ? <span>M</span> : null}
</div>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div> 
      </div>
      {/* <div class="div-DEL">
        <button className='DEL'onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      </div> */}

      <DigitButton digit="." dispatch={dispatch} className="dot"/>
      <button className='MS' onClick={() => dispatch({type: ACTIONS.MSTORE})}>MS</button>
      <button className='MC' onClick={() => dispatch({type: ACTIONS.MCLEAR})}>MC</button>
      <button className='MR' onClick={() => dispatch({type: ACTIONS.MRECALL})}>MR</button>
      <button className='Mplus' onClick={() => dispatch({type: ACTIONS.MPLUS})}>M+</button>
      <button className='Mminus' onClick={() => dispatch({type: ACTIONS.MMINUS})}>M-</button>

      <button className='AC' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton strOperation="multiply" operation="*" dispatch={dispatch}/>
      <OperationButton strOperation="division" operation="÷" dispatch={dispatch}>÷</OperationButton>

      <button className='C' onClick={() => dispatch({type: ACTIONS.CLEAR_CURRENT})}>C</button>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton strOperation="plus" operation="+" dispatch={dispatch}/>    
      <OperationButton strOperation="minus" operation="-" dispatch={dispatch}/>

      <button className='pos-neg' onClick={() => dispatch({type: ACTIONS.SIGN})}>{"(+/-)"}</button>
      <DigitButton className='One' digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>

      
      
      <button className='percent' onClick={() => dispatch({type: ACTIONS.PERCENTAGE})}>%</button>
      <button className='sqrt' onClick={() => dispatch({type: ACTIONS.SQUAREROOT})}>&radic;</button>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className='DEL'onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <button className='span-two equals'  onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      
      
      
      
      
      
      
      
      
      
      
      

    </div>
  )   
  
}

export default App
