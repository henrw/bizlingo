import React, { useRef, useState, useEffect } from "react";

import ProgressBar from "../components/ProgressBar";
import HeadBar from "../components/HeadBar";
import Onboard from "../components/Onboard";
import bizlingoBag from '../assets/bizlingo-bag.svg';



export default function Demo({ }) {

    const [stage, setStage] = useState(0);
    return (
        <>
            <div className="flex justify-center h-[100vh] w-full">
                <div className="flex flex-col max-w-[1440px] justify-between h-full w-full">
                    <ProgressBar stage={stage} stageTotal={5} increStage={() => {setStage(stage+1)}} decreStage={() => {setStage(stage-1)}} />
                    <div className="flex-grow flex flex-col relative items-center justify-center">
                        <div className="flex flex-col w-3/5">
                            <Onboard stage={stage} increStage={() => {setStage(stage+1)}} decreStage={() => {setStage(stage-1)}}/>
                            <img src={bizlingoBag} width={200} className="absolute z-0 right-4 top-1/2 transform -translate-y-1/2" alt="Bizlingo Bag" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
