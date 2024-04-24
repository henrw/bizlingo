import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";
import AdaptiveTextarea from "./AdaptiveTextarea";
import bizfly from '../assets/bizzie-fly.svg';
import monologue from '../assets/monologue.svg';
import dialogue from '../assets/dialogue.svg';
import axios from 'axios';

import sentenceAvatar from '../assets/sentence-avatar.svg'

export default function Sentence({ stage, increStage, decreStage }) {

    const [selectIdx, setSelectIdx] = useState(-1);
    const [correctIdx, setCorrectIdx] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    return (
        <>
            {
                stage === 5 && (
                    <>
                        <div className="font-bold text-xl m-2 mt-4">
                            Fill in the blank
                        </div>
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <img src={sentenceAvatar} width={100} alt="sentence quizer" />
                            <div className="flex flex-row">
                                <div key="sentence-first" className="">Today's meeting was</div>
                                <div key="sentence-blank" className="relative w-[100px] border-b-2 h-6 mx-4">
                                    {selectIdx !== -1 &&
                                        <button className={`absolute bottom-0 left-1/2 translate -translate-x-1/2 flex flex-row outline outline-2 m-2 rounded-lg p-2 outline-gray-200`}
                                            onClick={() => { setSelectIdx(-1) }}>
                                            {["absent", "present", "missed", "postponed"][selectIdx]}
                                        </button>
                                    }
                                </div>
                                <div key="sentence-first">to tomorrow.</div>
                            </div>
                        </div>
                        <div className="flex flex-row space-x-2 justify-center">
                            {
                                ["absent", "present", "missed", "postponed"].map((word, idx) => (
                                    <button key={"choice" + idx.toString()} className={`flex flex-row outline outline-2 m-2 rounded-lg p-2 outline-gray-200 ${selectIdx === idx ? "bg-gray-200 " : ""}`}
                                        onClick={() => { setSelectIdx(idx) }}>
                                        <span className={`${selectIdx === idx ? 'invisible' : 'visible'}`}>
                                            {word}
                                        </span>
                                    </button>
                                ))
                            }
                        </div>


                        {
                            !isChecked ? (
                                <div className="mt-4 flex flex-row justify-between">
                                    <button className="rounded-xl py-2 px-10 outline-2 outline outline-gray-200"
                                        onClick={increStage}>
                                        SKIP
                                    </button>

                                    <button className={`rounded-xl py-2 px-10 ${selectIdx === -1 ? "outline-2 outline outline-gray-200 bg-gray-300" : "bg-green-button text-white"}`}
                                        onClick={() => { if (selectIdx != -1) { setIsChecked(true); } }}>
                                        CHECK
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full flex flex-row justify-between bg-green-panel rounded-lg p-4 text-green-text items-center">
                                    <div className="flex flex-row">
                                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="40" cy="40" r="40" fill="white" />
                                            <path d="M55 32.5L35.2067 51.3278C34.8136 51.7017 34.194 51.694 33.8103 51.3103L25.5 43" stroke="#80B42C" strokeWidth="10" strokeLinecap="round" />
                                        </svg>

                                        <div className="flex flex-col justify-between p-1">
                                            <div className="text-lg">Excellent! Meaning:</div>
                                            <div className="mb-auto">今天的会议推迟到明天了。</div>
                                            <div className="flex text-sm flex-row space-x-4">
                                                <div className="flex flex-row justify-start">
                                                    <svg width="16" height="19" className="mr-1" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14.291 18.2717V3.16668C14.291 2.74675 14.1305 2.34402 13.8447 2.04709C13.559 1.75016 13.1714 1.58334 12.7672 1.58334H8.17447C7.45371 1.58334 6.87009 2.19055 6.87009 2.93868C6.87009 3.68759 6.28571 4.29401 5.56571 4.29401H3.04761C2.64347 4.29401 2.25589 4.46082 1.97012 4.75776C1.68435 5.05469 1.5238 5.45742 1.5238 5.87734V10.3898C1.5238 10.8098 1.68435 11.2125 1.97012 11.5094C2.25589 11.8064 2.64347 11.9732 3.04761 11.9732H7.64571C8.04985 11.9732 8.43744 11.8064 8.7232 11.5094C9.00897 11.2125 9.16952 10.8098 9.16952 10.3898V10.2038C9.16952 9.78387 9.33006 9.38115 9.61583 9.08422C9.9016 8.78728 10.2892 8.62047 10.6933 8.62047H14.5257" stroke="#58A700" strokeWidth="2.5" />
                                                    </svg>
                                                    REPORT
                                                </div>
                                                <div className="flex flex-row">
                                                    <svg width="20" height="20" className="mr-1" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0001 14.4L6.9313 18.016C6.81609 18.1183 6.6738 18.1852 6.52151 18.2086C6.36922 18.2319 6.21342 18.2108 6.07283 18.1478C5.93224 18.0848 5.81284 17.9825 5.72898 17.8532C5.64512 17.724 5.60036 17.5733 5.6001 17.4192V14.4H4.0001C3.36358 14.4 2.75313 14.1472 2.30304 13.6971C1.85295 13.247 1.6001 12.6365 1.6001 12V4.00001C1.6001 3.36349 1.85295 2.75304 2.30304 2.30295C2.75313 1.85286 3.36358 1.60001 4.0001 1.60001H16.0001C16.6366 1.60001 17.2471 1.85286 17.6972 2.30295C18.1472 2.75304 18.4001 3.36349 18.4001 4.00001V12C18.4001 12.6365 18.1472 13.247 17.6972 13.6971C17.2471 14.1472 16.6366 14.4 16.0001 14.4H11.0001Z" stroke="#62B900" strokeWidth="2.5" />
                                                    </svg>
                                                    DISCUSS
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={`h-min rounded-xl py-4 px-6 ${selectIdx === -1 ? "outline-2 outline outline-gray-200 bg-gray-300" : "bg-green-button text-white"}`}
                                        onClick={increStage}>
                                        CONTINUE
                                    </button>
                                </div>
                            )
                        }
                    </>
                )
            }

        </>
    );
};