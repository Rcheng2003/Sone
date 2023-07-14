import { useEffect, useState } from 'react'; 
import "./Calculator.css";
import Key from "./Key.js";

function Calculator() {
    const keyboard = [["C", "+-", "%", "/"], ["7", "8", "9", "x"],
                ["4", "5", "6", "-"], ["1", "2", "3", "+"],
                ["0", ".", "="]]; 
    
    const [op, setOp] = useState(null); 
    const [view, setView] = useState(""); 
    const [prev, setPrev] = useState({num: null, sign: false}); 
    const [number, setNumber] = useState({num: null, sign: false});

    return (
        <>
            <div className="calc">
                <div className="display"> 
                    {view}
                </div>

                <div className="buttons">
                    {   
                        keyboard.map((symbols, index) => {
                            return (
                                <div className='row' key={index}>
                                    {   
                                        symbols.map((symbol) => {
                                                return <Key key={symbol} symbol={symbol} op={op}
                                                newOp={setOp} view={view} newView={setView} prev={prev} 
                                                newPrev={setPrev} number={number} newNumber={setNumber} />
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