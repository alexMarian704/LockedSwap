import React, { FC } from 'react'
import { ActionButton } from '../tools/ActionButton'
import { useRouter } from 'next/router'

const HomeInfo: FC = (): JSX.Element => {
    const router = useRouter();

    return (
        <div className="homeInfo">
            <h3>Swap assets instantly</h3>
            <h4>Fast and Secure</h4>
            <ActionButton style={{
                fontSize: "calc(23px + 0.3vw)",
                padding: "3px 60px 3px 60px",
                marginTop:"14px"
            }} onClick={() => router.push("/swap")}>Swap</ActionButton>
        </div>
    )
}

export default HomeInfo