import React, { FC } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Footer: FC = () : JSX.Element => {
  return (
    <footer>
        <p style={{"textAlign":"center"}}>Made with <FontAwesomeIcon icon={faHeart} color="#800040" /> by LockedSwap team</p>
    </footer>
  )
}

export default Footer