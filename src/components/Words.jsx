import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";
import AdaptiveTextarea from "./AdaptiveTextarea";
import bizfly from '../assets/bizzie-fly.svg';
import monologue from '../assets/monologue.svg';
import dialogue from '../assets/dialogue.svg';
import axios from 'axios';

export default function Words({ stage, context, setContext, increStage, decreStage }) {

    const [selectIdx, setSelectIdx] = useState(-1);
    const [correctIdx, setCorrectIdx] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    return (
        <>
            {
                stage === 4 && (
                    <>
                        <div className="font-bold text-xl m-2 mt-4">
                            How do you say "delay"?
                        </div>
                        {
                            ["迟到", "延迟", "缺席", "出席"].map((word, idx) => (
                                <button key={"choice" + idx.toString()} className={`flex flex-row w-full outline outline-2 m-2 rounded-lg p-2 ${selectIdx === idx ? "text-blue-text bg-blue-bg outline-blue-outline" : "outline-gray-200"}`}
                                    onClick={() => { setSelectIdx(idx) }}>
                                    <div className="absolute rounded outline outline-2 outline-gray-200 px-2">
                                        {idx}
                                    </div>
                                    <div className="ml-auto mr-auto">
                                        {word}
                                    </div>
                                </button>
                            ))
                        }
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

                                        <div className="flex flex-col justify-between p-3">
                                            <div className="text-lg">Great! “延迟” means delay.</div>
                                            <div className="flex text-sm flex-row">
                                                <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14.291 18.2717V3.16668C14.291 2.74675 14.1305 2.34402 13.8447 2.04709C13.559 1.75016 13.1714 1.58334 12.7672 1.58334H8.17447C7.45371 1.58334 6.87009 2.19055 6.87009 2.93868C6.87009 3.68759 6.28571 4.29401 5.56571 4.29401H3.04761C2.64347 4.29401 2.25589 4.46082 1.97012 4.75776C1.68435 5.05469 1.5238 5.45742 1.5238 5.87734V10.3898C1.5238 10.8098 1.68435 11.2125 1.97012 11.5094C2.25589 11.8064 2.64347 11.9732 3.04761 11.9732H7.64571C8.04985 11.9732 8.43744 11.8064 8.7232 11.5094C9.00897 11.2125 9.16952 10.8098 9.16952 10.3898V10.2038C9.16952 9.78387 9.33006 9.38115 9.61583 9.08422C9.9016 8.78728 10.2892 8.62047 10.6933 8.62047H14.5257" stroke="#58A700" strokeWidth="2.5" />
                                                </svg>
                                                REPORT
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