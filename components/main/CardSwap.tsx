import React, { FC, useEffect, useState } from 'react'
import style from "../../style/Swap.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSync, faBolt, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { ActionButton } from '../tools/ActionButton';
import { useLoggingIn } from '../../hooks/auth/useLoggingIn';
import { Authenticated } from '../tools/Authenticated';
import { LoginModalButton } from '../tools/LoginModalButton';
import { SimpleEGLDTxDemo } from '../demo/SimpleEGLDTxDemo';
import { accountState, loginInfoState } from '../../store/auth';
import { useSnapshot } from 'valtio';
import { CustomNetworkProvider } from "../../store/CustomNetwork";

interface EsdtToken {
  identifier: string;
  name: string;
  ticker?: string;
  owner?: string;
  decimals: number;
  isPaused: boolean;
  transactions: number;
  accounts: number;
  canUpgrade: boolean;
  canMint: boolean;
  canBurn: boolean;
  canChangeOwner: boolean;
  canPause: boolean;
  canFreeze: boolean;
  canWipe: boolean;
  balance: number;
}

const CardSwap: FC = (): JSX.Element => {
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [to, setTo] = useState("LKASH");
  const [from, setFrom] = useState("EGLD");
  const { isLoggingIn, error, isLoggedIn } = useLoggingIn();
  const [slippage, setSlippage] = useState<Number>(1)
  const [customSlippage, setCustomSlippage] = useState("")
  const accountSnap = useSnapshot(accountState);
  const [esdt, setEsdt] = useState<EsdtToken[]>([])
  const [toBalance, setToBalance] = useState(0)
  const [fromBalance, setFromBalance] = useState(0)

  useEffect(() => {
    if (fromValue[0] !== ".") {
      setFromValue(fromValue.replace(/[^\d.]/g, ''))
      if (fromValue[fromValue.length - 1] === "." && fromValue.slice(0, -1).includes(".") === true) {
        setFromValue(fromValue.slice(0, -1))
      }
    } else {
      setFromValue(fromValue.substring(1))
    }
  }, [fromValue])

  useEffect(() => {
    if (toValue[0] !== ".") {
      setToValue(toValue.replace(/[^\d.]/g, ''))
      if (toValue[toValue.length - 1] === "." && toValue.slice(0, -1).includes(".") === true) {
        setToValue(toValue.slice(0, -1))
      }
    } else {
      setToValue(toValue.substring(1))
    }
  }, [toValue])

  useEffect(() => {
    if (customSlippage[0] !== ".") {
      setCustomSlippage(customSlippage.replace(/[^\d.]/g, ''))
      if (customSlippage[customSlippage.length - 1] === "." && customSlippage.slice(0, -1).includes(".") === true) {
        setCustomSlippage(customSlippage.slice(0, -1))
      }
      if (customSlippage === "") {
        setSlippage(1);
      }
    } else {
      setCustomSlippage(customSlippage.substring(1))
    }
  }, [customSlippage])

  useEffect(() => {
    const getProvider = () => {
      return new CustomNetworkProvider('https://devnet-api.elrond.com', { timeout: 5000 });
    }

    const getBalance = async () => {
      if (accountSnap.address !== "") {
        const provider = getProvider();
        const address = accountSnap.address;
        const tokens: EsdtToken[] = await provider.getTokens(address);

        setEsdt(tokens)
        setFromBalance(Number(accountSnap.balance))
        setToBalance(Number(tokens[0].balance))
      }
    }
    getBalance()
  }, [accountSnap.address, accountSnap.balance])

  const changeTokens = () => {
    let aux = to;
    let auxBalance = fromBalance;
    setTo(from);
    setFrom(aux);
    setToValue("");
    setFromValue("");
    setFromBalance(toBalance);
    setToBalance(auxBalance)
  }

  const swapTokens = () => {

  }

  return (
    <div className={style.card}>
      <SimpleEGLDTxDemo cb={()=>{
        console.log("GATA")
      }} />
      <div className={style.amountDiv}>
        <label>Swap From</label>
        <div className={style.tokenInput}>
          <input type="text" value={fromValue} onChange={(e) =>
            setFromValue(e.target.value)} placeholder="Amount" />
          <div className={style.tokenType}>
            <div className={style.tokenContainer}>
              <p>{from}</p>
              <button><FontAwesomeIcon icon={faChevronDown} /></button>
            </div>
          </div>
        </div>
        <p className={style.balance}>Balance: {isLoggedIn ? Number((Number(fromBalance) / 10 ** 18)).toFixed(3) : "0"}</p>
      </div>
      <div className={style.changeTokens}>
        <button onClick={changeTokens} ><FontAwesomeIcon icon={faSync} /></button>
      </div>
      <div className={style.amountDiv}>
        <label>Swap To</label>
        <div className={style.tokenInput}>
          <input type="text" value={toValue} onChange={(e) => setToValue(e.target.value)} placeholder="Amount" />
          <div className={style.tokenType}>
            <div className={style.tokenContainer}>
              <p>{to}</p>
              <button><FontAwesomeIcon icon={faChevronDown} /></button>
            </div>
          </div>
        </div>
        <p className={style.balance}>Balance: {isLoggedIn ? Number((Number(toBalance) / 10 ** 18)).toFixed(3) : "0"}</p>
      </div>
      <div className={style.slippage}>
        <div>
          <p>Slippage</p>
        </div>
        <div className={style.changeSlippage}>
          <button onClick={() => {
            setSlippage(0.1)
            setCustomSlippage("")
          }} style={slippage === 0.1 ? {
            background: "#480727",
            border: "2px solid black"
          } : {}}>0.1%</button>
          <button onClick={() => {
            setSlippage(0.5)
            setCustomSlippage("")
          }} style={slippage === 0.5 ? {
            background: "#480727",
            border: "2px solid black"
          } : {}}>0.5%</button>
          <button onClick={() => {
            setSlippage(1)
            setCustomSlippage("")
          }} style={slippage === 1 ? {
            background: "#480727",
            border: "2px solid black"
          } : {}}>1%</button>
          <div className={style.customSlippage}>
            <input type="text" placeholder="0.0" value={customSlippage} onChange={(e) => {
              if (slippage !== 0)
                setSlippage(0);
              setCustomSlippage(e.target.value)
            }} />
            <p>%</p>
          </div>
        </div>
      </div>
      <div className={style.exchangeRate}>

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