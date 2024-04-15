import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";
import AdaptiveTextarea from "./AdaptiveTextarea";
import bizfly from '../assets/bizzie-fly.svg';
import monologue from '../assets/monologue.svg';
import dialogue from '../assets/dialogue.svg';

export default function Onboard({ stage, increStage, decreStage }) {

    const [scenarioText, setScenarioText] = useState('');
    const [domainText, setDomainText] = useState('');
    const [interest, setInterest] = useState('');
    const scenarioPlaceholderText = "Example:\nI want to discuss meeting schedules with my clients.\n我想要和客户讨论制定会议时间。";
    const domainPlaceholderText = "Example: Engineering, Consumer Product, Education...";
    // Adjust the height on component mount and whenever scenarioText changes


    const [progress, setProgress] = useState(-300);


    useEffect(() => {
        setScenarioText(scenarioPlaceholderText);
        setDomainText(domainPlaceholderText);

        const intervalId = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 500) {
                    clearInterval(intervalId);
                    return prevProgress; // Stop when image reaches the window width minus its own width to avoid overflow
                }
                return prevProgress + 1; // Increase position by 10px every second
            });
        }, 10);
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
                            <button className={`mr-10 flex flex-col items-center justify-center w-52 h-48 outline outline-2 ${interest === "Monologue" ? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={() => { setInterest("Monologue") }}>
                                <img src={monologue} width={100} className="mb-1" alt="Bizlingo Bag" />
                                Monologue
                            </button>
                            <button className={`flex flex-col items-center justify-center w-52 h-48 outline ${interest === "Dialogue" ? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={() => { setInterest("Dialogue") }}>
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
            {
                stage === 2 && progress < 500 && (
                    <>
                        <svg width={(500 + progress).toString()} height="176" viewBox={`0 0 ${(500 + progress).toString()} 176`} fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d={`M${(457 + progress).toString()}.744 0.748199H-30.4512V175.735H${(470 + progress).toString()}.243L${(457 + progress).toString()}.744 0.748199Z`} fill="#FFC800" />
                            <rect x="41" y="24" width={(419 + progress).toString()} height="26" rx="13" fill="#FFD300" />
                            <defs>
                                <radialGradient id="paint0_radial_111_948" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(750.697 34.4635) rotate(114.523) scale(140.271 181.97)">
                                    <stop stop-color="#26FF55" />
                                    <stop offset="0.466774" stop-color="#268AFF" />
                                    <stop offset="0.973038" stop-color="#FC55FF" />
                                </radialGradient>
                                <radialGradient id="paint1_radial_111_948" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(750.697 34.4635) rotate(114.523) scale(140.271 181.97)">
                                    <stop stop-color="#26FF55" />
                                    <stop offset="0.466774" stop-color="#268AFF" />
                                    <stop offset="0.973038" stop-color="#FC55FF" />
                                </radialGradient>
                            </defs>
                        </svg>

                        <img style={{ left: `${progress + 860}px`, }} src={bizfly} width={200} className="fixed top-1/2 transform -translate-y-1/2 -translate-x-1/2" alt="Bizlingo Bag" />
                    </>
                )
            }
            {
                stage === 2 && progress === 500 && (
                    <>
                    TODO
                    </>
                )
            }
        </>
    );
};