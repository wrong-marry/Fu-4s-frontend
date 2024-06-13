import * as React from "react";
import {animated} from "react-spring";
import {Props} from "react-toggle-dark-mode/src";

export const CommentButtonSwitch: React.FC<Props> = ({
                                                    onChange,
                                                    checked ,
                                                }) => {

    const onColor = 'white', offColor = 'black';


    const toggle = () => onChange(!checked);


    return (
        <animated.svg
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-messages-off"
            color={checked ? onColor : offColor}
            onClick={toggle}
        >
            {checked ?
                <>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 3l18 18"/>
                    <path d="M11 11a1 1 0 0 1 -1 -1m0 -3.968v-2.032a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10l-3 -3h-3"/>
                    <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"/>
                </> :
                <>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"/>
                    <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"/>
                </>}
        </animated.svg>
    );
};