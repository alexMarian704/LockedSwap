import React, { FC } from 'react'
import Link from "next/link"
import { Authenticated } from './Authenticated';
import { LoginModalButton } from './LoginModalButton';
import style from "../../style/Nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { useLoggingIn } from '../../hooks/auth/useLoggingIn';
import { useLogout } from '../../hooks/auth/useLogout';
import { ActionButton } from './ActionButton';
import useWindowDimensions from '../../hooks/tools/width';

const Nav : FC = () => {
    const { isLoggingIn, error, isLoggedIn } = useLoggingIn();
    const { width } = useWindowDimensions()
    const { logout } = useLogout();

    return (
        <nav className={style.nav}>
            <div className={style.align}>
                <div className={style.navLinks}>
                    <Link href="/">
                        <h1><FontAwesomeIcon icon={faRetweet} color="#800040" fontSize={"calc(30px + 0.1vw)"} />{width > 430 ? "LockedSwap" : "LS"}</h1>
                    </Link>
                    <Link href="/swap">
                        <h2>Swap</h2>
                    </Link>
                </div>
                <Authenticated
                    spinnerCentered
                    fallback={
                        <LoginModalButton />
                    }
                >
                </Authenticated>
                {isLoggedIn === true && <ActionButton background={"transparent"} borderColor={"#800040"}  onClick={()=> logout()}>Log Out</ActionButton>}
            </div>
        </nav>
    )
}

export default Nav