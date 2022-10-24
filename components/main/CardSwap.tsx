import React, { FC, useEffect, useState } from 'react'
import style from "../../style/Swap.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPercent, faSync, faBolt } from "@fortawesome/free-solid-svg-icons";
import { ActionButton } from '../tools/ActionButton';
import { useLoggingIn } from '../../hooks/auth/useLoggingIn';
import { Authenticated } from '../tools/Authenticated';
import { LoginModalButton } from '../tools/LoginModalButton';

const CardSwap: FC = (): JSX.Element => {
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [to, setTo] = useState("EGLD");
  const [from, setFrom] = useState("LKASH");
  const { isLoggingIn, error, isLoggedIn } = useLoggingIn();

  useEffect(() => {
    if (fromValue[0] !== ".") {
      setFromValue(fromValue.replace(/[^\d.]/g, ''))
    } else {
      setFromValue(fromValue.substring(1))
    }
  }, [fromValue])

  useEffect(() => {
    if (toValue[0] !== ".") {
      setToValue(toValue.replace(/[^\d.]/g, ''))
    } else {
      setToValue(toValue.substring(1))
    }
  }, [toValue])

  const changeTokens = ()=>{
    let aux = to;
    setTo(from);
    setFrom(aux);
  }

  const swapTokens = () => {

  }

  //console.log(Number(fromValue) , Number(toValue))

  return (
    <div className={style.card}>
      <div className={style.amountDiv}>
        <label>Swap From</label>
        <div className={style.tokenInput}>
          <input type="text" value={fromValue} onChange={(e) =>
            setFromValue(e.target.value)}/>
          <div className={style.tokenType}>

          </div>
        </div>
      </div>
      <div className={style.changeTokens}>
        <button onClick={changeTokens} ><FontAwesomeIcon icon={faSync} /></button>
      </div>
      <div className={style.amountDiv}>
        <label>Swap To</label>
        <div className={style.tokenInput}>
          <input type="text" value={toValue} onChange={(e) => setToValue(e.target.value)} />
          <div className={style.tokenType}>
            
          </div>
        </div>
      </div>
      <div className={style.swapButton}>
        {isLoggedIn === true && <ActionButton onClick={swapTokens}>Swap</ActionButton>}
        <Authenticated
          spinnerCentered
          fallback={
            <LoginModalButton />
          }
        >
        </Authenticated>
      </div>
    </div>
  )
}

export default CardSwap