import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";
import AdaptiveTextarea from "./AdaptiveTextarea";
import bizfly from '../assets/bizzie-fly.svg';
import monologue from '../assets/monologue.svg';
import dialogue from '../assets/dialogue.svg';
import axios from 'axios';

export default function Onboard({ stage, setContext, increStage, decreStage }) {

    let intervalId;
    const [scenarioText, setScenarioText] = useState('');
    const [domainText, setDomainText] = useState('');
    const [interest, setInterest] = useState('');
    const scenarioPlaceholderText = "Example:\nI want to discuss meeting schedules with my clients.\n我想要和客户讨论制定会议时间。";
    const domainPlaceholderText = "Example: Engineering, Consumer Product, Education...";
    // Adjust the height on component mount and whenever scenarioText changes
    const [progress, setProgress] = useState(-300);

    const [response, setResponse] = useState([]);

    const [parsedConversations, setParsedConversations] = useState([]);
    const [conversationIdx, setConversationIdx] = useState(-1);

    const generateConversations = async () => {
        try {
            const payload = {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "你是一个面向于中国英语学习者的商务英语老师，有二十年教龄和相关的商务英语知识。我会给你一些与商务英语教学相关的“任务”，需要你来执行。"
                    },
                    {
                        role: "user",
                        content: `根据下面的“场景”和“目标人群”去执行“任务1”\n## 场景\n${scenarioText}（领域：${domainText}）\n\n## 目标人群\n中国英语语言学习者，语言水平是大学四级通过（CEFR B1 水平），有商务英语学习需求。\n\n## 任务1\n根据“场景”的需求，为“目标人群”生成一段符合其语言水平和商务英语学习需求的沟通对话示例。对话应该符合如下标准：\n1）句子长度：平均每句话8-15个词。\n2）句子结构：可以包含简单句、并列句和一些复合句，避免过于复杂的句子结构。\n3）语法复杂度：使用一般现在时、一般过去时、一般将来时，以及现在完成时等基本时态，偶尔使用条件句和被动语态。\n4）对话有A、B两名角色，角色A是目标人群自己（用“me”来表示），角色B是商务场景中的沟通对象（如同事、上下级、公司人员、客户等），在对话角色A需要与角色B就“场景”所描述的内容进行沟通，并一起得出结论。对话由A进行开启。整个对话不超过350个英文单词。\n生成两个版本的场景对话，每个版本都以一遍英文对话、一遍中文对话翻译的形式输出。每个版本用“版本N”标注。`
                    },
                ]
            };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
                },
                data: payload,
                url: 'https://api.openai.com/v1/chat/completions',
            };

            const result = await axios(options);
            setProgress(500);
            clearInterval(intervalId);
            setParsedConversations(parseConversationString(result.data.choices[0].message.content));
            setResponse(prev => [...prev, result.data]);
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
        }
    };

    function parseConversationString(input) {
        console.log(input);

        const normalizedInput = input.replace(/：/g, ':').replace(/[!"#$%&'*+\-/;<=>?@\[\\\]^_`{|}~]/g, '');
        console.log(normalizedInput);

        // Use regex to detect the start of each version block, handling Chinese and Arabic numerals
        const versionRegex = /(?:\*\*|##)?(?:版本|version)(?:\s?\d+|[一二三四五六七八九十]+)/gi;
        const versions = normalizedInput.split(versionRegex).filter(v => v.trim() !== ''); // Filter out any empty results
        console.log(versions);
        const result = [];

        versions.forEach((version, index) => {
            if (!version.trim()) return;

            // Use 'Version X' as key where X is index + 1 (since version numbers were split out)
            const versionKey = 'Version ' + (index + 1).toString();
            result.push(version.trim());

            // // Split the content into sections based on the presence of "英文对话" or "中文对话翻译"
            // const sections = version.split(/英文对话|中文对话翻译/).filter(s => s.trim() !== '');
            // sections.forEach((section, idx) => {
            //     const title = (idx % 2 === 0) ? 'English Conversation' : 'Chinese Translation';
            //     const dialogues = section.trim().split('\n').map(line => {
            //         const [speaker, speech] = line.split(/:(.+)/); // Split on the first colon to ensure full speeches are captured
            //         return { speaker: speaker.trim(), speech: speech.trim() };
            //     });

            //     result[versionKey][title] = dialogues;
            // });
        });

        return result;
    }

    const renderTextWithLineBreaks = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}{index < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    useEffect(() => {
        setScenarioText(scenarioPlaceholderText);
        setDomainText(domainPlaceholderText);

        intervalId = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress === 499 && parsedConversations.length === 0) return prevProgress;
                if (prevProgress >= 500) {
                    clearInterval(intervalId);
                    return prevProgress; // Stop when image reaches the window width minus its own width to avoid overflow
                }
                return prevProgress + 1; // Increase position by 10px every second
            });
        }, 100);
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
                            <button className={`mr-10 flex flex-col items-center justify-center w-52 h-48 outline ${interest === "Monologue" ? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
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

                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <button className="w-5/12 rounded-xl p-2 outline outline-2 outline-gray-200 text-gray-500"
                                onClick={decreStage}
                            >
                                GO BACK
                            </button>
                            <button className="w-5/12 rounded-xl p-2 outline outline-2 outline-gray-200 bg-theme-green text-white"
                                onClick={() => { increStage(); generateConversations(); }}
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
                                    <stop stopColor="#26FF55" />
                                    <stop offset="0.466774" stopColor="#268AFF" />
                                    <stop offset="0.973038" stopColor="#FC55FF" />
                                </radialGradient>
                                <radialGradient id="paint1_radial_111_948" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(750.697 34.4635) rotate(114.523) scale(140.271 181.97)">
                                    <stop stopColor="#26FF55" />
                                    <stop offset="0.466774" stopColor="#268AFF" />
                                    <stop offset="0.973038" stopColor="#FC55FF" />
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
                        <HeadBar text={"Step 3: Confirm Your Lesson Plan"} />
                        <div className="font-bold text-lg m-2 mt-4">
                            Based on your goal, which dialogue would you prefer?
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <button className={`w-5/12 rounded-xl p-2 text-left text-gray-500 outline ${conversationIdx === 0 ? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={()=>{setConversationIdx(0)}}
                            >
                                {renderTextWithLineBreaks(parsedConversations[0])}
                            </button>
                            <button className={`w-5/12 rounded-xl p-2 text-left text-gray-500 outline ${conversationIdx === 1 ? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={()=>{setConversationIdx(1)}}
                            >
                                {renderTextWithLineBreaks(parsedConversations[1])}
                            </button>
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
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