import React, { useRef, useState, useEffect } from "react";

import ProgressBar from "../components/ProgressBar";
import HeadBar from "../components/HeadBar";
import Onboard2 from "../components/Onboard2";
import bizbag from '../assets/bizzie-bag.svg';
import Words from "../components/Words";
import Sentence from "../components/Sentence";
import Congratulations from "../components/Congratulation";

export default function Demo({}) {
    const [stage, setStage] = useState(0);
    const [context, setContext] = useState({});

    return (
        <>
            <div className="flex justify-center h-[100vh] w-full">
                <div className="flex flex-col max-w-[1440px] justify-between h-full w-full">
                    <ProgressBar stage={stage} stageTotal={10} increStage={() => {setStage(stage+1)}} decreStage={() => {setStage(stage-1)}} />
                    <div className="flex-grow flex flex-col relative items-center justify-center">
                        <div className="flex flex-col w-3/5">
                            <Onboard2 stage={stage} context={context} setContext={setContext} increStage={() => {setStage(stage+1)}} decreStage={() => {setStage(stage-1)}}/>
                            <Words stage={stage} context={context} setContext={setContext} increStage={() => {setStage(stage+1)}} decreStage={() => {setStage(stage-1)}}/>
                            <Sentence stage={stage} increStage={() => {setStage(stage+1)}} decreStage={() => {setStage(stage-1)}}/>
                            <Congratulations stage={stage} increStage={() => {setStage(stage+1)}} decreStage={() => {setStage(stage-1)}}/>
                            {stage < 2 && <img src={bizbag} width={200} className="absolute z-0 right-4 top-1/2 transform -translate-y-1/2" alt="Bizlingo Bag" />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
