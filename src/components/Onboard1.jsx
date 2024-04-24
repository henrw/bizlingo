import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";
import AdaptiveTextarea from "./AdaptiveTextarea";
import bizfly from '../assets/bizzie-fly.svg';
import monologue from '../assets/monologue.svg';
import dialogue from '../assets/dialogue.svg';
import axios from 'axios';

export default function Onboard1({ stage, context, setContext, increStage, decreStage }) {

    let intervalId;
    const [scenarioText, setScenarioText] = useState('');
    const [domainText, setDomainText] = useState('');
    const [typeIdx, setTypeIdx] = useState(-1);
    const scenarioPlaceholderText = "Example:\nI want to discuss meeting schedules with my clients.\n我想要和客户讨论制定会议时间。";
    const domainPlaceholderText = "Example: Engineering, Consumer Product, Education...";
    // Adjust the height on component mount and whenever scenarioText changes
    const [progress, setProgress] = useState(0);
    const [vocabSelectIds, setVocabSelectIds] = useState([true, true, true, true, true]);

    const [vocabs, setVocabs] = useState([null, null]);
    const [parsedInstructionalText, setParsedInstructionalText] = useState([]);
    const [conversationIdx, setConversationIdx] = useState(-1);
    let conversationHistory = [];
    
    const combineInstructionalText = (instructionalText) => {
        if (instructionalText == undefined || instructionalText == null) return "";
        return instructionalText.filter(item=>item.personEn.includes("A")).map(item=>item.sentenceEn).join("\n");
    }

    const examples = [
        "### 独白版本1\n\n**A (Me):** This is an important message about our scheduled meeting. Due to a timing conflict, we need to reschedule. Initially, the meeting was set for Thursday at 3 PM. However, I have just learned that our conference room is double-booked. I am looking into other available timeslots on the same day. Could everyone please check their calendar? If you are available at 10 AM or 4 PM on Thursday, let me know your preference. Thank you for your flexibility and understanding. Let's finalize the new time by tomorrow.\n\n**独白版本1翻译**\n\n**A (我):** 这是关于我们计划中的会议的一条重要信息。由于时间上的冲突，我们需要重新安排会议时间。原定于周四下午3点的会议，我刚得知我们的会议室已被双重预订。我正在查看同一天的其他可用时间。请大家检查一下自己的日程表。如果你周四上午10点或下午4点有空，请告诉我你的偏好。感谢你们的灵活性和理解。我们争取在明天之前确定新的会议时间。\n\n---\n\n### 对话版本2\n\n**A (Me):** I hope this message finds you well. I need to inform you about a change concerning our next meeting. We had planned to meet next Wednesday at 2 PM. Unfortunately, I must attend an urgent client meeting at that time. I propose we move our meeting to either 11 AM or 5 PM on the same day. Please reply with which time works better for you or suggest another time if neither is suitable. I appreciate your cooperation in this matter.\n\n**对话版本2翻译**\n\n**A (我):** 希望这条信息你们都好。我需要通知你们关于我们下次会议的一个变动。我们原计划下周三下午2点开会。不幸的是，我必须在那时参加一个紧急的客户会议。我建议我们将会议改到同一天的上午11点或下午5点。请回复哪个时间更适合你，或者如果这两个时间都不合适，可以提出另一个时间。感谢你们在此事上的合作。",
        "### 对话版本1\n\n**A (Me):** Hi, I've noticed there's a schedule conflict with our meeting. Can we discuss a new time?\n\n**B (Colleague):** Sure, when do you suggest?\n\n**A (Me):** How about Thursday at 3 PM? Does that work for you?\n\n**B (Colleague):** Thursday at 3 PM sounds good. I'll check and confirm in a bit.\n\n**A (Me):** Great, please let me know once you confirm so I can adjust my schedule too.\n\n**B (Colleague):** Will do. Thanks for the heads up.\n\n**A (Me):** No problem, thank you for being flexible.\n\n**对话版本1翻译**\n\n**A (我):** 嗨，我注意到我们的会议时间有冲突。我们可以讨论一个新的时间吗？\n\n**B (同事):** 当然，你建议什么时候？\n\n**A (我):** 周四下午3点怎么样？适合你吗？\n\n**B (同事):** 周四下午3点听起来不错。我会检查一下然后确认。\n\n**A (我):** 太好了，请一旦确认就告诉我，这样我也可以调整我的日程。\n\n**B (同事):** 会的。谢谢你提前通知。\n\n**A (我):** 没问题，谢谢你的灵活配合。\n\n---\n\n### 对话版本2\n\n**A (Me):** Hello, there seems to be a clash with our meeting time. Can we find an alternative?\n\n**B (Manager):** Yes, what time are you thinking of?\n\n**A (Me):** Is Wednesday morning at 10 okay for you?\n\n**B (Manager):** Let me check. Wednesday at 10 is fine. Let's reschedule to then.\n\n**A (Me):** Thank you. I'll update my calendar and inform the team.\n\n**B (Manager):** Perfect, I'll send out an updated invitation.\n\n**A (Me):** Thanks, I appreciate your help with this.\n\n**对话版本2翻译**\n\n**A (我):** 你好，我们的会议时间似乎有冲突。我们能找个替代时间吗？\n\n**B (经理):** 是的，你考虑什么时间？\n\n**A (我):** 星期三上午10点对你来说可以吗？\n\n**B (经理):** 让我查一下。星期三上午10点没问题。我们就改到那时吧。\n\n**A (我):** 谢谢。我会更新我的日历并通知团队。\n\n**B (经理):** 完美，我会发送一个更新的邀请。\n\n**A (我):** 谢谢，我很感激你在这件事上的帮助。",
    ]

    const promptTemplates = [
        `根据下面的“场景”和“目标人群”去执行“任务1”\n## 场景：${scenarioText}\n## 领域：${domainText}\n## 目标人群：中国英语语言学习者，语言水平是大学四级通过（CEFR B1 水平），有商务英语学习需求。\n\n## 任务1\n根据“场景”的需求，为“目标人群”生成一段符合其语言水平、领域和商务英语学习需求的沟通独白示例。独白应该符合如下标准：\n1）句子长度：平均每句话8-15个词。\n2）句子结构：可以包含简单句、并列句和一些复合句，避免过于复杂的句子结构。\n3）语法复杂度：使用一般现在时、一般过去时、一般将来时，以及现在完成时等基本时态，偶尔使用条件句和被动语态。\n4）独白仅有A一名角色，角色A是目标人群自己（用“me”来表示），独白由A进行开启。整个独白不超过350个英文单词。\n\n生成两个版本的场景独白，且请用与下面例子一样的格式：\n${examples[0]}`,
        `根据下面的“场景”和“目标人群”去执行“任务1”\n## 场景：${scenarioText}\n## 领域：${domainText}\n## 目标人群：中国英语语言学习者，语言水平是大学四级通过（CEFR B1 水平），有商务英语学习需求。\n\n## 任务1\n根据“场景”的需求，为“目标人群”生成一段符合其语言水平、领域和商务英语学习需求的沟通对话示例。对话应该符合如下标准：\n1）句子长度：平均每句话8-15个词。\n2）句子结构：可以包含简单句、并列句和一些复合句，避免过于复杂的句子结构。\n3）语法复杂度：使用一般现在时、一般过去时、一般将来时，以及现在完成时等基本时态，偶尔使用条件句和被动语态。\n4）对话有A、B两名角色，角色A是目标人群自己（用“me”来表示），角色B是商务场景中的沟通对象（如同事、上下级、公司人员、客户等），在对话角色A需要与角色B就“场景”所描述的内容进行沟通，并一起得出结论。对话由A进行开启。整个对话不超过350个英文单词。\n\n生成两个版本的场景对话，且请用与下面例子一样的格式：\n${examples[1]}`,
        `根据下面的“场景”和“目标人群”去执行“任务2”\n## 场景：${scenarioText}\n## 领域：${domainText}\n## 目标人群：中国英语语言学习者，语言水平是大学四级通过（CEFR B1 水平），有商务英语学习需求。\n\n## 任务2\n根据“选择”的内容，从角色A的表达中提取对“目标人群”来说比较难掌握的5个核心单词或者专业性单词，单词需要符合“目标人群”的语言水平。请专注于角色A在对话中使用的单词，不要包含角色B。\n## 选择: ${combineInstructionalText(parsedInstructionalText[0])}\n\n请用如下的格式进行输出（别加序号）：\n[核心单词]\ncomplexity:复杂性\ntimeline:时间表\nensure:确保\nquality:质量\nadjusted:调整的`,
        `根据下面的“场景”和“目标人群”去执行“任务2”\n## 场景：${scenarioText}\n## 领域：${domainText}\n## 目标人群：中国英语语言学习者，语言水平是大学四级通过（CEFR B1 水平），有商务英语学习需求。\n\n## 任务2\n根据“选择”的内容，从角色A的表达中提取对“目标人群”来说比较难掌握的5个核心单词或者专业性单词，单词需要符合“目标人群”的语言水平。请专注于角色A在对话中使用的单词，不要包含角色B。\n## 选择: ${combineInstructionalText(parsedInstructionalText[1])}\n\n请用如下的格式进行输出（别加序号）：\n[核心单词]\ncomplexity:复杂性\ntimeline:时间表\nensure:确保\nquality:质量\nadjusted:调整的`,
    ];

    useEffect(() => {
        if (parsedInstructionalText.length !== 0 && vocabs[0] === null) {
            generateVocabularies(2);
        }
    }, [parsedInstructionalText]);

    useEffect(() => {
        if (parsedInstructionalText.length !== 0 && vocabs[0] !== null && vocabs[1] === null) {
            generateVocabularies(3);
        }
    }, [vocabs]);
    
    const generateVocabularies = async (idx=2) => {
        console.log("start vocab");
        console.log(promptTemplates[idx]);
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
                        content: promptTemplates[idx]
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
            const vocabLs = parseVocabsText(result.data.choices[0].message.content);
            const vocabsCopy = [...vocabs];
            vocabsCopy[idx-2] = vocabLs
            setVocabs(vocabsCopy);
            setContext({...context, vocabs: vocabsCopy})
            setProgress(400 + (idx-2)*100);
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
        }
    };
    const generateConversations = async () => {
        console.log("start conversation");
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
                        content: promptTemplates[typeIdx]
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
            setProgress(250);

            if (typeIdx === 0) {
                const monologues = parseMonologueText(result.data.choices[0].message.content);
                setParsedInstructionalText(monologues);
                console.log(monologues);
                setContext({...context, monologue: monologues});
            }
            else if (typeIdx === 1)
            {
                const dialogues = parseDialogueText(result.data.choices[0].message.content);
                console.log(dialogues);
                setParsedInstructionalText(dialogues);
                setContext({...context, dialogue: dialogues});
            }
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
        }
    };

    // function parseConversationString(input) {
    //     console.log(input);

    //     const normalizedInput = input.replace(/：/g, ':').replace(/[!"#$%&'*+\-/;<=>?@\[\\\]^_`{|}~]/g, '');
    //     console.log(normalizedInput);

    //     // Use regex to detect the start of each version block, handling Chinese and Arabic numerals
    //     const versionRegex = /(?:\*\*|##)?(?:版本|version)(?:\s?\d+|[一二三四五六七八九十]+)/gi;
    //     const versions = normalizedInput.split(versionRegex).filter(v => v.trim() !== ''); // Filter out any empty results
    //     console.log(versions);
    //     const result = [];

    //     versions.forEach((version, index) => {
    //         if (!version.trim()) return;

    //         const versionKey = 'Version ' + (index + 1).toString();
    //         result.push(version.trim());
    //     });

    //     return result;
    // }

    function parseMonologueText(monologueText) {
        // Split the monologue text into separate monologues based on two newline characters (assuming this is your delimiter)
        const monologueBlocks = monologueText.trim().split('---');
    
        // This array will hold all monologues
        const monologues = [];
    
        // Process each block of monologue
        monologueBlocks.forEach(block => {
            // Each monologue is an array of sentence-person objects
            const monologue = [];
    
            const [englishVersion, ChineseVersion] = block.trim().split('翻译');
    
            // Split each block into lines
            const englishLines = englishVersion.split('\n').filter(line => line.trim());
            const chineseLines = ChineseVersion.split('\n').filter(line => line.trim());
            // Extract the sentence and person from each line
            englishLines.slice(1, -1).forEach(line => {
                console.log(line)
                // Find the colon which separates the person identifier from the sentence
                const cleanLine = line.replace(/[*]/g,"");
                const colonIndex = cleanLine.indexOf(':');
                if (colonIndex !== -1)
                {
                    // Extract the person and the sentence
                    const personEn = cleanLine.substring(0, colonIndex).trim();
                    const sentenceEn = cleanLine.substring(colonIndex + 1).trim();
        
                    // Add the object to the monologue array
                    monologue.push({ personEn, sentenceEn });
                }
                else if (cleanLine.trim() !== '')
                {
                    monologue.push({ personEn: monologue[monologue.length-1].personEn, sentenceEn: cleanLine.trim() });
                }
            });
            for (let i=1; i< chineseLines.length; ++i){
                if (i > monologue.length) return;
                const line = chineseLines[i];
                // Find the colon which separates the person identifier from the sentence
                const cleanLine = line.replace(/[*]/g,"");
                const colonIndex = cleanLine.indexOf(':');
                if (colonIndex !== -1)
                {
                    const personCh = cleanLine.substring(0, colonIndex).trim();
                    const sentenceCh = cleanLine.substring(colonIndex + 1).trim();
                    // Add the object to the monologue array
                    console.log(monologue[i], i, sentenceCh)
                    monologue[i-1].personCh = personCh;
                    monologue[i-1].sentenceCh = sentenceCh;

                }
                else if (cleanLine.trim() !== '')
                {
                    monologue[i-1].personCh = monologue[monologue.length-1].personCh;
                    monologue[i-1].sentenceCh = cleanLine.trim();
                }
    
            };

            console.log(monologue);
            
            // Add the populated monologue to the monologues array
            monologues.push(monologue);
        });

        console.log(monologues)
        

        return monologues;
    }

    function parseVocabsText(vocabTexts) {
        const vocabLines = vocabTexts.trim().split('\n');
        const vocabLs = [];

        vocabLines.forEach(line => {
            // Each dialogue is an array of sentence-person objects
            const [vocabEn, vocabCh] = line.trim().split(/[:：]/);
            if (vocabCh !== undefined) vocabLs.push({vocabEn: vocabEn.replace(/\d+\.\s/g, '').trim(), vocabCh: vocabCh.replace(/\d+\.\s/g, '').trim()})
        });
    
        return vocabLs;
    }

    function parseDialogueText(dialogueText) {
        // Split the dialogue text into separate dialogues based on two newline characters (assuming this is your delimiter)
        const dialogueBlocks = dialogueText.trim().split('---');
    
        // This array will hold all dialogues
        const dialogues = [];
    
        // Process each block of dialogue
        dialogueBlocks.forEach(block => {
            // Each dialogue is an array of sentence-person objects
            const dialogue = [];
    
            const [englishVersion, ChineseVersion] = block.trim().split('翻译');
    
            // Split each block into lines
            const englishLines = englishVersion.split('\n').filter(line => line.trim());
            const chineseLines = ChineseVersion.split('\n').filter(line => line.trim());
    
            // Extract the sentence and person from each line
            englishLines.forEach(line => {
                // Find the colon which separates the person identifier from the sentence
                const cleanLine = line.replace(/[*]/g,"");
                const colonIndex = cleanLine.indexOf(':');
                if (colonIndex === -1) return;  // Skip if no colon found
    
                // Extract the person and the sentence
                const personEn = cleanLine.substring(0, colonIndex).trim();
                const sentenceEn = cleanLine.substring(colonIndex + 1).trim();
    
                // Add the object to the dialogue array
                dialogue.push({ personEn, sentenceEn });
            });
            
            for (let i=0; i< chineseLines.length; ++i){
                const line = chineseLines[i];
                // Find the colon which separates the person identifier from the sentence
                const cleanLine = line.replace(/[*]/g,"");
                const colonIndex = cleanLine.indexOf(':');
                if (colonIndex === -1) return;  // Skip if no colon found
    
                // Extract the person and the sentence
                const personCh = cleanLine.substring(0, colonIndex).trim();
                const sentenceCh = cleanLine.substring(colonIndex + 1).trim();
    
                // Add the object to the dialogue array
                dialogue[i].personCh = personCh;
                dialogue[i].sentenceCh = sentenceCh;
            };
    
            console.log(dialogue);
            // Add the populated dialogue to the dialogues array
            dialogues.push(dialogue);
        });
    
        return dialogues;
    }

    const renderTextWithLineBreaks = (text) => {
        return text.map((line, index) => (
            <React.Fragment key={index}>
                <strong>{line.personEn}</strong>: {line.sentenceEn} <br/>
                <strong>{line.personCh}</strong>: {line.sentenceCh} <br/><br/>
            </React.Fragment>
        ));
    };

    useEffect(() => {
        setScenarioText(scenarioPlaceholderText);
        setDomainText(domainPlaceholderText);

        intervalId = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress === 399 || prevProgress === 499 || prevProgress === 299) return prevProgress;
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
                            <button className={`mr-10 flex flex-col items-center justify-center w-52 h-48 outline ${typeIdx === 0 ? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={() => { setTypeIdx(0); setContext({...context, typeIdx: 0});}}>
                                <img src={monologue} width={100} className="mb-1" alt="Bizlingo Bag" />
                                Monologue
                            </button>
                            <button className={`flex flex-col items-center justify-center w-52 h-48 outline ${typeIdx === 1 ? "outline-4 outline-blue-200" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={() => { setTypeIdx(1); setContext({...context, typeIdx: 1});}}>
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
                                onClick={() => {
                                    increStage();
                                    generateConversations();
                                }}
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

                        {/* <img style={{ left: `${progress + 860}px`, }} src={bizfly} width={200} className="fixed top-1/2 transform -translate-y-1/2 -translate-x-1/2" alt="Bizlingo Bag" /> */}
                    </>
                )
            }
            {
                stage === 2 && progress === 500 && (
                    <>
                        <HeadBar text={"Step 3: Confirm Your Learning Plan"} />
                        <div className="font-bold text-lg m-2 mt-4">
                            Based on your goal, which dialogue would you prefer?
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <button className={`w-5/12 rounded-xl p-2 text-left text-gray-500 outline ${conversationIdx === 0 ? "outline-4 outline-blue-200 bg-blue-100" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={()=>{setConversationIdx(0); setContext({...context, paragraphIdx: 0}); setContext({...context, paragraphIdx: 0});}}
                            >
                                {renderTextWithLineBreaks(parsedInstructionalText[0])}
                            </button>
                            <button className={`w-5/12 rounded-xl p-2 text-left text-gray-500 outline ${conversationIdx === 1 ? "outline-4 outline-blue-200 bg-blue-100" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={()=>{setConversationIdx(1); setContext({...context, paragraphIdx: 1}); setContext({...context, paragraphIdx: 1});}}
                            >
                                {renderTextWithLineBreaks(parsedInstructionalText[1])}
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
            {
                stage === 3 && (
                    <>
                        <HeadBar text={"Step 3: Confirm Learning Plan"} />
                        <div className="font-bold text-lg m-2 mt-4">
                            Based on your goal, you will be learning:
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <div className="rounded-lg outline outline-2 outline-gray-200 w-[400px]">
                                {
                                    vocabs[conversationIdx].map((vocab, idx) => (
                                        <button onClick={()=>{let newVocabSelectIds = [...vocabSelectIds]; newVocabSelectIds[idx] = !newVocabSelectIds[idx]; setVocabSelectIds(newVocabSelectIds); setContext({...context, vocabSelectIds: newVocabSelectIds});}}
                                            key={idx} className={`p-2 w-[400px] ${vocabSelectIds[idx]?"bg-blue-100": ""} outline-gray-200 outline-2 outline ${idx===0?"rounded-t-lg": (idx === vocabs[conversationIdx].length-1 ? "rounded-b-lg":"")}`}>{vocab.vocabCh} {vocab.vocabEn}</button>
                                    ))
                                }
                            </div>
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