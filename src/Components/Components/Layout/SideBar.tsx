import React, { useEffect } from 'react'
import {useState} from 'react';
import { useWindowDimensions } from '../../Hooks';


export interface SideBarProps {
    sideBarOpen : boolean
    fromLocation?: boolean
    children: React.ReactNode
}

export const SideBar = ({sideBarOpen, fromLocation, children}: SideBarProps) => {
    const [contWidth, setContWidth] = useState("xl:w-0");
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (width >= 547) {if (sideBarOpen || fromLocation) {
            setContWidth( "w-side-notifs h-screen")
        } else {
            setContWidth("w-0 h-screen")
        }}
        else {
            if (sideBarOpen || fromLocation) {
                setContWidth( "w-full min-h-screen")
            } else {
                setContWidth("w-full h-0")
            }
        }
    // eslint-disable-next-line
    }, [sideBarOpen, fromLocation]);

  return (
    <div className={`z-20 top-0 right-0 fixed flex flex-wrap ${contWidth} ease-in-out duration-300`}>
        <div className={`${contWidth} flex items-center`}>
            <div className={`h-full bg-light w-full md:rounded-tl-3xl overflow-y-scroll text-dark relative`}>
                {(sideBarOpen || fromLocation) && 
                <>
                {children}
                </>
                }
            </div>
        </div>
    </div>
  )
}
