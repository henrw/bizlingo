import React, { useState } from "react";


export default function Blank({ increStage, questionText, choices, answers }) {

    const [replacements, setReplacements] = useState({
        "(a)": <span className="font-bold">(A)</span>,
        "(b)": <span className="font-bold">(B)</span>,
        "(c)": <span className="font-bold">(C)</span>,
        "(d)": <span className="font-bold">(D)</span>
    });

    const [isChecked, setIsChecked] = useState(false);

    const [aIdx, setAIdex] = useState(-1);
    const [bIdx, setBIdex] = useState(-1);
    const [cIdx, setCIdex] = useState(-1);
    const [dIdx, setDIdex] = useState(-1);

    const isCorrect = (choices.a[aIdx] === answers.a) && (choices.b[bIdx] === answers.b) && (choices.c[cIdx] === answers.c) && (choices.d[dIdx] === answers.d);

    const updateReplacementColors = () => {
        const newReplacements = {...replacements};
        if (choices.a[aIdx] !== answers.a) {
            newReplacements["(a)"] = <span className={`cursor-pointer bg-red-200 m-1 p-1  rounded-lg`}>{choices.a[aIdx]}</span>
        }
        if (choices.b[bIdx] !== answers.b) {
            newReplacements["(b)"] = <span className={`cursor-pointer bg-red-200 m-1 p-1 rounded-lg`}>{choices.b[bIdx]}</span>
        }
        if (choices.c[cIdx] !== answers.c) {
            newReplacements["(c)"] = <span className={`cursor-pointer bg-red-200 m-1 p-1 rounded-lg`}>{choices.c[cIdx]}</span>
        }
        if (choices.d[dIdx] !== answers.d) {
            newReplacements["(a)"] = <span className={`cursor-pointer bg-red-200 m-1 p-1  rounded-lg`}>{choices.d[dIdx]}</span>
        }

        setReplacements(newReplacements);
    };

    // Function to process the text with all replacements
    const processText = (inputText) => {
        // Get all keys from the replacements object
        const keys = Object.keys(replacements);

        // Start with the initial text
        let processedParts = [inputText];

        // Iterate over each replacement key
        keys.forEach(key => {
            // Temporarily hold the new parts after each split and map
            let newParts = [];
            processedParts.forEach(part => {
                if (typeof part === 'string') { // Only split strings, not React elements
                    newParts.push(...part.split(key).flatMap((segment, index, array) =>
                        index < array.length - 1 ? [segment, React.cloneElement(replacements[key], { key: `${key}-${index}` })] : segment));
                } else {
                    newParts.push(part); // Push React elements as they are
                }
            });
            processedParts = newParts;
        });

        // Now replace \n with <br />
        return processedParts.flatMap((part, index) =>
            typeof part === 'string'
                ? part.split('\n').flatMap((line, lineIndex, array) =>
                    lineIndex < array.length - 1 ? [<React.Fragment key={`${index}-${lineIndex}`}>{line}<br /></React.Fragment>] : line)
                : part
        );
    };

    return (
        <div className="flex flex-col">
            <div>
                {processText(questionText)}
            </div>
            <div className="mt-10 ">
                <div className="flex flex-row items-center mt-2">
                    <div className="mr-3">(A): </div>
                    {choices.a.map((item, idx) => (
                        <div key={idx} onClick={() => {
                            if (isChecked) return;
                            setReplacements(prevState => ({
                                ...prevState,
                                "(a)": <span className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg`}>{item}</span>
                            })); setAIdex(idx);
                        }}
                            className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg ${idx === aIdx ? "bg-gray-200" : ""}`}>
                            <span className={`${idx === aIdx ? "invisible" : "visible"}`}>{item}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row items-center mt-2">
                    <div className="mr-3">(B): </div>
                    {choices.b.map((item, idx) => (
                        <div key={idx} onClick={() => {
                            if (isChecked) return;
                            setReplacements(prevState => ({
                                ...prevState,
                                "(b)": <span className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg`}>{item}</span>
                            })); setBIdex(idx);
                        }}
                            className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg ${idx === bIdx ? "bg-gray-200" : ""}`}>
                            <span className={`${idx === bIdx ? "invisible" : "visible"}`}>{item}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row items-center mt-2">
                    <div className="mr-3">(C): </div>
                    {choices.c.map((item, idx) => (
                        <div key={idx} onClick={() => {
                            if (isChecked) return;
                            setReplacements(prevState => ({
                                ...prevState,
                                "(c)": <span className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg`}>{item}</span>
                            })); setCIdex(idx);
                        }}
                            className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg ${idx === cIdx ? "bg-gray-200" : ""}`}>
                            <span className={`${idx === cIdx ? "invisible" : "visible"}`}>{item}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row items-center mt-2">
                    <div className="mr-3">(D): </div>
                    {choices.d.map((item, idx) => (
                        <div key={idx} onClick={() => {
                            if (isChecked) return;
                            setReplacements(prevState => ({
                                ...prevState,
                                "(d)": <span className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg`}>{item}</span>
                            })); setDIdex(idx);
                        }}
                            className={`cursor-pointer m-1 p-1 outline outline-2 outline-gray-300 rounded-lg ${idx === dIdx ? "bg-gray-200" : ""}`}>
                            <span className={`${idx === dIdx ? "invisible" : "visible"}`}>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {
                !isChecked ? (
                    <div className="mt-4 flex flex-row justify-between">
                        <button className="rounded-xl py-2 px-10 outline-2 outline outline-gray-200"
                            onClick={increStage}>
                            SKIP
                        </button>

                        <button className={`rounded-xl py-2 px-10 ${(aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1) ? "outline-2 outline outline-gray-200 bg-gray-300" : "bg-green-button text-white"}`}
                            onClick={() => { if (!(aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1)) { setIsChecked(true);  updateReplacementColors();} }}>
                            CHECK
                        </button>
                    </div>
                ) : (
                    <div className={`w-full flex flex-row justify-between ${isCorrect? "bg-green-panel text-green-text": "bg-red-100 text-red-500"} rounded-lg p-4  items-center mt-4`}>
                        <div className="flex flex-row">
                            {
                                (isCorrect) ? (
                                    <>
                                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="40" cy="40" r="40" fill="white" />
                                            <path d="M55 32.5L35.2067 51.3278C34.8136 51.7017 34.194 51.694 33.8103 51.3103L25.5 43" stroke="#80B42C" strokeWidth="10" strokeinecap="round" />
                                        </svg>

                                        <div className="flex flex-col justify-between p-1">
                                            <div className="text-lg">Excellent!</div>
                                            {/* <div className="mb-auto">今天的会议推迟到明天了。</div> */}
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
                                        </div></>
                                ) : (
                                    <>
                                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="40" cy="40" r="40" fill="white" />
                                            <g transform="rotate(45, 40, 40)">
                                                <path d="M40 10 L40 70" stroke="#f87171" strokeWidth="10" strokeLinecap="round" />
                                                <path d="M10 40 L70 40" stroke="#f87171" strokeWidth="10" strokeLinecap="round" />
                                            </g>
                                        </svg>

                                        <div className="flex flex-col justify-between p-1">
                                            <div className="text-lg">Not quire right</div>
                                            <div className="mb-auto">请检查错误选项/</div>
                                            <div className="flex text-sm flex-row space-x-4">
                                                <div className="flex flex-row justify-start">
                                                    <svg width="16" height="19" className="mr-1" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14.291 18.2717V3.16668C14.291 2.74675 14.1305 2.34402 13.8447 2.04709C13.559 1.75016 13.1714 1.58334 12.7672 1.58334H8.17447C7.45371 1.58334 6.87009 2.19055 6.87009 2.93868C6.87009 3.68759 6.28571 4.29401 5.56571 4.29401H3.04761C2.64347 4.29401 2.25589 4.46082 1.97012 4.75776C1.68435 5.05469 1.5238 5.45742 1.5238 5.87734V10.3898C1.5238 10.8098 1.68435 11.2125 1.97012 11.5094C2.25589 11.8064 2.64347 11.9732 3.04761 11.9732H7.64571C8.04985 11.9732 8.43744 11.8064 8.7232 11.5094C9.00897 11.2125 9.16952 10.8098 9.16952 10.3898V10.2038C9.16952 9.78387 9.33006 9.38115 9.61583 9.08422C9.9016 8.78728 10.2892 8.62047 10.6933 8.62047H14.5257" stroke="#f87171" strokeWidth="2.5" />
                                                    </svg>
                                                    REPORT
                                                </div>
                                                <div className="flex flex-row">
                                                    <svg width="20" height="20" className="mr-1" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0001 14.4L6.9313 18.016C6.81609 18.1183 6.6738 18.1852 6.52151 18.2086C6.36922 18.2319 6.21342 18.2108 6.07283 18.1478C5.93224 18.0848 5.81284 17.9825 5.72898 17.8532C5.64512 17.724 5.60036 17.5733 5.6001 17.4192V14.4H4.0001C3.36358 14.4 2.75313 14.1472 2.30304 13.6971C1.85295 13.247 1.6001 12.6365 1.6001 12V4.00001C1.6001 3.36349 1.85295 2.75304 2.30304 2.30295C2.75313 1.85286 3.36358 1.60001 4.0001 1.60001H16.0001C16.6366 1.60001 17.2471 1.85286 17.6972 2.30295C18.1472 2.75304 18.4001 3.36349 18.4001 4.00001V12C18.4001 12.6365 18.1472 13.247 17.6972 13.6971C17.2471 14.1472 16.6366 14.4 16.0001 14.4H11.0001Z" stroke="#f87171" strokeWidth="2.5" />
                                                    </svg>
                                                    DISCUSS
                                                </div>
                                            </div>
                                        </div></>
                                )
                            }
                        </div>
                        {
                            isCorrect ? (
                                <button className={`h-min rounded-xl py-4 px-6 ${(aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1) ? "outline-2 outline outline-gray-200 bg-gray-300" : "bg-green-button text-white"}`}
                            onClick={increStage}>
                            CONTINUE
                        </button>
                            ):
                            (
                                <button className={`h-min rounded-xl py-4 px-6 ${(aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1) ? "outline-2 outline outline-gray-200 bg-gray-300" : "bg-red-400 text-white"}`}
                            onClick={()=>{
                                setReplacements({
                                    "(a)": <span className="font-bold">(A)</span>,
                                    "(b)": <span className="font-bold">(B)</span>,
                                    "(c)": <span className="font-bold">(C)</span>,
                                    "(d)": <span className="font-bold">(D)</span>
                                });
                                setAIdex(-1);
                                setBIdex(-1);
                                setCIdex(-1);
                                setDIdex(-1);
                                setIsChecked(false);
                            }}>
                            Retry
                        </button>
                            )
                        }
                        
                    </div>
                )
            }
        </div>

    )
}