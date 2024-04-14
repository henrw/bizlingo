import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";
import AdaptiveTextarea from "./AdaptiveTextarea";
import bizlingoBag from '../assets/bizlingo-bag.svg';
import monologue from '../assets/monologue.svg';
import dialogue from '../assets/dialogue.svg';

export default function Onboard({ stage, increStage, decreStage }) {

    const [scenarioText, setScenarioText] = useState('');
    const [domainText, setDomainText] = useState('');
    const [interest, setInterest] = useState('');
    const scenarioPlaceholderText = "Example:\nI want to discuss meeting schedules with my clients.\n我想要和客户讨论制定会议时间。";
    const domainPlaceholderText = "Example: Engineering, Consumer Product, Education...";
    // Adjust the height on component mount and whenever scenarioText changes
    useEffect(() => {
        setScenarioText(scenarioPlaceholderText);
        setDomainText(domainPlaceholderText);
        setDomainText(domainPlaceholderText);
    }, []);

    return (
        <>
            {
                stage === 0 && (
                    <>
                        <HeadBar text={"Stage 1: Set Your Learning Goal"} />
                        <div className="font-bold text-lg m-2 mt-4">
                            What is your target use case scenario?
                        </div>
                        <AdaptiveTextarea placeholderText={scenarioPlaceholderText} text={scenarioText} setText={setScenarioText} />

                        <div className="font-bold text-lg m-2 mt-4">
                            What is your business domain?
                        </div>
                        <AdaptiveTextarea placeholderText={domainPlaceholderText} text={domainText} setText={setDomainText} />

                        <button className="w-full mt-4 rounded-xl p-2 outline outline-2 outline-gray-200 bg-theme-green text-white"
                            onClick={increStage}
                        >
                            CONTINUE
                        </button>
                    </>
                )
            }
            {
                stage === 1 && (
                    <>
                        <HeadBar text={"Step 2: Select Your Learning Type"} />

                        <div className="font-bold text-lg m-2 mt-4">
                            I’m more interested in learning:
                        </div>

                        <div className="flex justify-center w-full my-10">
                            <button className={`mr-10 flex flex-col items-center justify-center w-52 h-48 outline outline-2 ${interest === "Monologue"? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={()=> {setInterest("Monologue")}}>
                                <img src={monologue} width={100} className="mb-1" alt="Bizlingo Bag" />
                                Monologue
                            </button>
                            <button className={`flex flex-col items-center justify-center w-52 h-48 outline ${interest === "Dialogue"? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={()=> {setInterest("Dialogue")}}>
                                <img src={dialogue} width={100} className="mb-1" alt="Bizlingo Bag" />
                                Dialogue
                            </button>
                        </div>

                        <div className="flex flex-row justify-between w-full mt-4 space-x-1">
                            <button className="w-5/12 rounded-xl p-2 outline outline-2 outline-gray-200 text-gray-500"
                                onClick={decreStage}
                            >
                                GO BACK
                            </button>
                            <button className="w-5/12 rounded-xl p-2 outline outline-2 outline-gray-200 bg-theme-green text-white"
                                onClick={increStage}
                            >
                                CONTINUE
                            </button>
                        </div>
                    </>
                )
            }
        </>
    );
};