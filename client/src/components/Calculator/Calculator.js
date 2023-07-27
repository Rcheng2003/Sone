import { useEffect, useState } from 'react'; 
import "./Calculator.css";

function Calculator() {
    // what is displayed 
    const [view, setView] = useState("0"); 
    // expression for the calculation
    const [expression, setExpression] = useState([]); 
    // a number to input into the expression 
    const [num, setNum] = useState("0"); 
    // current operation 
    const [op, setOp] = useState();  
    // the number saved to add if equals operation is spammed 
    // along with the operation 
    const [saved, setSaved] = useState({num: null, op: null}); 

    // calculator keys 
    const buttons = [["C", "+-", "%", "/"], ["7", "8", "9", "*"],
                ["4", "5", "6", "-"], ["1", "2", "3", "+"],
                ["0", ".", "="]]; 

    // to update the view whenever the number or expression is updated 
    useEffect(() => {
        // display the number whenever its inputted for a responsive UI 
        if (num !== "") {
            setView(num); 
        
        // otherwise if a number is calculated then display that answer...  
        } else if (expression.length > 2) {
            // display calculations with operations +, -, *, /, %
            // and this if the normal operations are clicked to compute the answer 
            if (op !== "=") {
                // since two elements are added to an expression then you must get an expression 
                // 4 + 4 + --> 4 + 4 to evaluate it validly 
                setView(eval(expression.slice(0, expression.length-1).join("")))
                // for future operations you must update the expression from 4 + 4 --> 8 + 
                setExpression((oldExpression) => { 
                    return [eval(oldExpression.slice(0, oldExpression.length-1).join("")), saved.op]
                })
            // display calculations with operation +-, =, . 
            } else {
                // evaluate with = 
                if (op === "=") {
                    setView(eval(expression.join("")));
                    setExpression((oldExpression) => { return [eval(oldExpression.join("")), saved.op]});
                } 
            }
        // to negate a result that is computed 
        } else if (op === "+-") {
            setView(expression[0]); 
        }

        // just to test 
        console.log("EXPRESSION:", expression);
        console.log("NUMBER:", num); 
        console.log("OPERATION:", op); 
        console.log("SAVED:", saved);
        console.log("========================")

    }, [num, expression])

    // whenever a button is clicked 
    const handleClick = (symbol) => {
        // if clear then reset everything 
        if (symbol === "C") {
            setView("0"); 
            setExpression([]);
            setNum(""); 
            setOp("");
            setSaved({num: null, op: null});
        } 

        // otherwise if a number is inputted 
       else if (symbol === "0" || symbol === "1" || symbol === "2" || symbol === "3" || 
        symbol === "4" || symbol === "5" || symbol === "6" || symbol === "7" || 
        symbol === "8" || symbol === "9") {
            if (num === "0") {
                setNum(symbol);
            } else {
                setNum((oldNum) => { return oldNum + symbol });
            }
        }
        
        // if an operation is inputted 
        else {
            // normal operations such as +, -, *, -, %
            if (symbol !== "+-" && symbol !== "." && symbol !== "=") {
                // if there is a number inputted then the expression can be updated 
                if (num !== "") {
                    setExpression((oldExpression) => { 
                        // negate negatives if possible for both floats and integerse 
                        if (oldExpression[oldExpression.length-1] === "-" && parseFloat(num) < 0) {
                            if (parseFloat(num) % 1 === 0) {
                                setSaved({num: -1*parseInt(num), op: symbol});
                                return [oldExpression[0], "+", -1*parseInt(num), symbol];
                            } else {
                                setSaved({num: -1*parseFloat(num), op: symbol});
                                return [oldExpression[0], "+", -1*parseFloat(num), symbol];
                            }
                        // otherwise normally concate the expression 
                        } else {
                            // saved if the = operation is used for an incomplete expression 
                            // e.g. 5 + ... --> 5 + 5 --> 10 + ... --> 10 + 5 ... 
                            setSaved({num: num, op: symbol});
                            // to account for edge case for negatives 
                            if (parseFloat(num) > 0 && oldExpression[oldExpression.length-1] === "+" &&
                            op === "-") {
                                return [oldExpression[0], "-", num, symbol]; 
                            }
                            return [...oldExpression, num, symbol]; 
                        }
                    }); 
                    // must be reset so another new number can be concatenated 
                    setNum("");

                // if the user decides to change the operation within the expression to +, -, *, /, or % 
                } else if (expression.length > 0) {
                    // if the user inputs negative symbol and the number is already negative then negation is needed 
                    // since its in the context of equals operation 
                    if (symbol === "-" && parseFloat(expression[0]) < 0) {
                        setExpression((oldExpression) => { return [...oldExpression.slice(0, expression.length-1), "+"] } );
                        // update for the equals operation 
                        setSaved( {num: -1*expression[0], op: "+"} )
                    
                    // otherwise if there is no negative sign to negate then just replace the operation normally 
                    } else {
                        setExpression((oldExpression) => { return [...oldExpression.slice(0, expression.length-1), symbol] } ); 
                        // in case the equals operation is used 
                        setSaved( {num: expression[0], op: symbol } )
                    }
                }

            // operations such as +-, =, and . that have miscellaneous operations 
            } else {
                // if there is an expression to evaluate with the equals operation 
                if (symbol === "=" && expression.length > 0) {
                    // if its an operation such as (56 +) and equals is used and is spammed where 
                    // there is no number inputted then operate with the same number 
                    if (!Number.isInteger(expression[expression.length-1]) && num === "") {
                        setExpression((oldExpression) => { 
                            // handle negatives if its a thing 
                            if ((oldExpression[oldExpression.length-1] === "-" && parseFloat(oldExpression[0]) < 0) || 
                            (oldExpression[oldExpression.length-1] === "-" && parseFloat(saved.num) < 0)) {
                                return [oldExpression[0], '+', -1*saved.num]
                            } else {
                                return [...oldExpression, saved.num]
                            }
                        })
                    } // otherwise if its a normal operation on expression such as 56 + 56 
                    else {
                        setExpression((oldExpression) => {
                            // negate if its used within an equals expression for both floats and integers 
                            if (oldExpression[oldExpression.length-1] === "-" && parseFloat(num) < 0) {
                                if (parseFloat(num) % 1 === 0) {
                                    setSaved({num: -1*parseInt(num), op: "+"}); 
                                    return [oldExpression[0], "+", -1*parseInt(num)]; 
                                } else {
                                    setSaved({num: -1.00*parseFloat(num), op: "+"}); 
                                    return [oldExpression[0], "+", -1.00*parseFloat(num)]; 
                                }
                            
                            // otherwise if there is no negation 
                            } else {
                                // for case with negatives when you want to subtract again 
                                if (parseFloat(num) > 0 && oldExpression[oldExpression.length-1] === "+" &&
                                op === "-") {
                                    // must save the number that was added 
                                    setSaved({num: num, op: "-"}); 
                                    return [oldExpression[0], "-", num]; 
                                }

                                setSaved((oldSave) => { return {...oldSave, num: num}}); 
                                return [...oldExpression, num];  
                            }
                        }); 
                        setNum(""); 
                    }
                
                // when it comes to negate, must account for two cases, negating a number that was 
                // inputted and negating a result and updating the operations as a result and also 
                // accounting for floats 
                } else if (symbol === "+-") {   
                    // if number inputted 
                    if (num !== "") {
                        // to handle edge with negatives... 
                        if (op === "-" && expression[expression.length-1] === "+") {
                            setExpression((oldExpression) => { return [oldExpression[0], "-"]})
                        }

                        // must consider if its a float or not to preserve value 
                        if (parseFloat(num) % 1 == 0) { 
                            setNum((parseInt(num)*-1).toString());
                            setSaved((oldSaved) => { return {...oldSaved, num: (parseInt(num)*-1).toString()}});
                        } else {
                            setNum((parseFloat(num)*-1.00).toString());
                            setSaved((oldSaved) => { return {...oldSaved, num: (parseFloat(num)*-1.00).toString()}});
                        } 
                    
                    // otherwise it must be a result that was computed 
                    } else if (expression.length !== 0) {
                        // must consider if its a float or not to preserve value 
                        if (expression[0] % 1 == 0) {
                            setExpression([expression[0]*-1, expression[expression.length-1]])
                            setSaved((oldSaved) => { return {...oldSaved, num: expression[0]*-1}})
                        } else {
                            setExpression([expression[0]*-1.00, expression[expression.length-1]])
                            setSaved((oldSaved) => { return {...oldSaved, num: expression[0]*-1.00}})
                        } 
                    }
                } else if (symbol === "." && !num.includes(".")) {
                    if (num !== "") {
                        setNum((oldNum) => { return oldNum + "."})
                    // if "." is inputted and there is no digit inputted yet 
                    } else {
                        setNum(0 + ".")
                    }
                }
            }
            // need to get the operation to render the view and to keep track for future operations 
            setOp(symbol);  
        }
    }

    return (
        <>
            <div className="calc">
                <div className="display"> 
                    {view}
                </div>

                <div className="buttons">
                    {   
                        // map each row 
                        buttons.map((symbols, index) => {
                            return (
                                <div className='row' key={index}>
                                    {   
                                        // map the symbols and its respective divs 
                                        symbols.map((symbol) => {
                                                if (symbol !== "=") {
                                                    return (
                                                        <div key={symbol} onClick={() => handleClick(symbol)} className="box">
                                                            {symbol}
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div key={symbol} onClick={() => handleClick(symbol)} className="equalsBox">
                                                            {symbol}
                                                        </div>
                                                    )
                                                }
                                            }
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Calculator; 