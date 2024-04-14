import React from "react";
import { Link } from 'react-router-dom';

export default function ProgressBar({ stage, stageTotal, increStage, decreStage }) {
    return (
        <div className="flex flex-row items-center">

            <Link to="/" className="mr-auto">
                <span>
                    <object>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </object>
                </span>

            </Link>

            {/* <button className="ml-auto" onClick={() => { if (stage > 0) decreStage(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button> */}

            <div className="w-full flex h-5 m-2 bg-gray-100 h-5 rounded-full">
                <div className="flex h-5 rounded-full bg-theme-green" style={{ width: (stage / stageTotal * 100).toString() + "%" }}>
                    <div className="relative mx-3 mt-1 flex-1">
                        <div className="absolute justify-center rounded-full w-full h-1.5 bg-white bg-opacity-20"></div>
                    </div>
                </div>
            </div>


            {/* <button onClick={() => { if (stage < stageTotal) increStage(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button> */}
        </div >

    );
};



