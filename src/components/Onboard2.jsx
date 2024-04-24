import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";
import AdaptiveTextarea from "./AdaptiveTextarea";
import bizfly from '../assets/bizzie-fly.svg';
import monologue from '../assets/monologue.svg';
import dialogue from '../assets/dialogue.svg';
import axios from 'axios';
import { parseVocabsText } from '../utils/parseGpt';
import Blank from "./Blank";


export default function Onboard({ stage, context, setContext, increStage, decreStage }) {

    let intervalId;
    const [scenarioText, setScenarioText] = useState('I am a marketing manager and must negotiate a new advertising contract with our agency.');
    const [domainText, setDomainText] = useState('');
    // const [typeIdx, setTypeIdx] = useState(-1);

    const scenarioPlaceholderText = "Example:\nI want to discuss meeting schedules with my clients.\n我想要和客户讨论制定会议时间。";
    const domainPlaceholderText = "Example: Engineering, Consumer Product, Education...";

    // Adjust the height on component mount and whenever scenarioText changes
    const [progress, setProgress] = useState(0);

    const [parsedConversations, setParseConversations] = useState(["test", "test"]);
    const [conversationIdx, setConversationIdx] = useState(-1);

    const [words, setWords] = useState([]);
    const [patterns, setPatterns] = useState([]);

    const [wordSelectIds, setWordSelectIds] = useState([]);
    const [patternSelectIds, setPatternSelectIds] = useState([]);

    const [questions, setQuestions] = useState([]);

    const conversationStr = `### Version 1: English Dialogue

    **Role A (Marketing Manager - Me):** Good morning. We need to discuss the new advertising contract. Are you available now?
    
    **Role B (Agency Representative):** Good morning. Yes, I'm ready. What are your main concerns?
    
    **Role A:** Our budget has been reduced, so we need to negotiate the cost. Can we lower the price?
    
    **Role B:** I understand your situation. Let's review the services and see where we can adjust.
    
    **Role A:** Also, we want to focus more on digital channels. Can we shift some funds there?
    
    **Role B:** That's possible. We can reallocate some resources to digital marketing. It could be more cost-effective.
    
    **Role A:** Great! And can we get a monthly performance report?
    
    **Role B:** Absolutely, we can provide detailed monthly reports. 
    
    **Role A:** Thank you. When can we have the revised proposal?
    
    **Role B:** I'll prepare it and send it by next Wednesday. Is that okay?
    
    **Role A:** Yes, that works. Thank you for your flexibility.
    
    **Role B:** You're welcome. Let's make this campaign successful together.
    
    ### Version 1: Chinese Dialogue Translation
    
    **角色A（市场经理-我）：** 早上好。我们需要讨论新的广告合同。你现在有空吗？
    
    **角色B（代理商代表）：** 早上好。是的，我准备好了。您主要关心哪些问题？
    
    **角色A：** 我们的预算减少了，所以我们需要就成本进行谈判。我们可以降低价格吗？
    
    **角色B：** 我理解你的情况。让我们回顾一下服务内容，看看哪里可以调整。
    
    **角色A：** 另外，我们希望更多地关注数字渠道。我们可以将一些资金转移到那里吗？
    
    **角色B：** 这是可能的。我们可以将一些资源重新分配到数字营销上。这可能更具成本效益。
    
    **角色A：** 太好了！我们可以获得每月的绩效报告吗？
    
    **角色B：** 当然，我们可以提供详细的每月报告。
    
    **角色A：** 谢谢。我们什么时候可以收到修改后的提案？
    
    **角色B：** 我会准备并在下周三之前发送给您。可以吗？
    
    **角色A：** 可以，这很适合。感谢您的灵活性。
    
    **角色B：** 不客气。让我们一起让这次活动成功。
    
    ---
    
    ### Version 2: English Dialogue
    
    **Role A (Marketing Manager - Me):** Hello. I want to talk about the terms of our new advertising contract. Is this a good time?
    
    **Role B (Agency Representative):** Hello. Sure, I'm all ears. What do you propose?
    
    **Role A:** I noticed our previous contract didn't include social media. Can we add that?
    
    **Role B:** Absolutely, we can include social media. Which platforms are you interested in?
    
    **Role A:** Mainly Instagram and Facebook. Also, can we ensure a quicker turnaround for our campaigns?
    
    **Role B:** Certainly, we can prioritize your campaigns for faster execution.
    
    **Role A:** That's excellent. Lastly, can we have an option to revise the content more frequently?
    
    **Role B:** Yes, we can offer more flexibility with content revisions. Let's detail that in the contract.
    
    **Role A:** Perfect. How soon can we finalize these changes?
    
    **Role B:** I'll draft the changes and send them over by Friday. Does that work?
    
    **Role A:** That sounds good. I appreciate your cooperation.
    
    **Role B:** Anytime. We're here to support your marketing goals.
    
    ### Version 2: Chinese Dialogue Translation
    
    **角色A（市场经理-我）：** 你好。我想谈谈我们新广告合同的条款。现在谈这个合适吗？
    
    **角色B（代理商代表）：** 你好。当然，我洗耳恭听。你有什么建议？
    
    **角色A：** 我注意到我们之前的合同没有包括社交媒体。我们可以添加这个吗？
    
    **角色B：** 当然
    
    ，我们可以包括社交媒体。你对哪些平台感兴趣？
    
    **角色A：** 主要是Instagram和Facebook。另外，我们可以确保我们的活动更快启动吗？
    
    **角色B：** 当然，我们可以优先处理您的活动，以实现更快的执行。
    
    **角色A：** 太好了。最后，我们可以更频繁地修订内容吗？
    
    **角色B：** 是的，我们可以提供更多关于内容修订的灵活性。我们将在合同中详细说明。
    
    **角色A：** 完美。我们多久能敲定这些变更？
    
    **角色B：** 我会起草这些变更并在周五之前发送给你。这样可以吗？
    
    **角色A：** 听起来不错。我很感激你的合作。
    
    **角色B：** 随时。我们在这里支持您的营销目标。`

    const question1Str = `### Question 1
#### Question:
Imagine you are a marketing manager discussing a new advertising contract with an agency representative.

Marketing Manager (Me): Good morning. We need to discuss the new advertising contract. Are you available now?
Agency Representative: Good morning. Yes, I'm ready. What are your main concerns?
Marketing Manager: Our budget has been reduced, so we need to (a) the cost. Can we lower the price?
Agency Representative: I understand your situation. Let's review the services and see where we can adjust.
Marketing Manager: Also, we want to focus more on (b) . Can we shift some funds there?
Agency Representative: That's possible. We can (c) some resources to digital marketing. It could be more cost-effective.
Marketing Manager: Great! And can we get a (d) report?
Agency Representative: Absolutely, we can provide detailed monthly reports.
Marketing Manager: Thank you. When can we have the revised proposal?
Agency Representative: I'll prepare it and send it by next Wednesday. Is that okay?
Marketing Manager: Yes, that works. Thank you for your flexibility.

#### Choices: 
(a) negotiate; budget; digital channels; reallocate
(b) digital channels; negotiate; budget; performance report
(c) reallocate; budget; negotiate; digital channels
(d) performance report; negotiate; reallocate; budget

#### Answers:
(a) negotiate
(b) digital channels
(c) reallocate
(d) performance report`;

    const question2Str = `### Question 2
#### Question:
Imagine you are a marketing manager discussing a new advertising contract with an agency representative.

Marketing Manager (Me): Good morning. We need to discuss the new advertising contract. Are you available now?
Agency Representative: Good morning. Yes, I'm ready. What are your main concerns?
Marketing Manager: ___(a)___?
Agency Representative: I understand your situation. Let's review the services and see where we can adjust.
Marketing Manager: ___(b)___?
Agency Representative: That's possible. We can reallocate some resources to digital marketing. It could be more cost-effective.
Marketing Manager: ___(c)___?
Agency Representative: Absolutely, we can provide detailed monthly reports.
Marketing Manager: ___(d)___?
Agency Representative: I'll prepare it and send it by next Wednesday. Is that okay?
Marketing Manager: Yes, that works. Thank you for your flexibility.

#### Choices: 
(a) the cost; Our budget; need to; has been; negotiate; reduced; so we
(b) more on; Also, we; focus; digital channels; want to; we; Can; shift; some funds; there
(c) monthly performance; Great! And; report; can we; get a
(d) revised proposal; the; When; can; we have; Thank you

#### Answers:
(a) Our budget has been reduced, so we need to negotiate the cost.
(b) Also, we want to focus more on digital channels. Can we shift some funds there?
(c) Great! And can we get a monthly performance report?
(d) Thank you. When can we have the revised proposal?`;

    const question3Str = `### Question 3
#### Question:
Imagine you are a marketing manager discussing potential adjustments to a project's timeline with a project manager due to unforeseen delays. You need to ensure that the changes will not impact the overall quality and deliverables of the project.

#### Conversation:
Marketing Manager (Me): Hi, thanks for meeting me on such short notice. We have some issues with the current project timeline.
Project Manager: No problem, what's the specific concern?
Marketing Manager: ___(a)___.
Project Manager: I see. Do you have any suggestions on how we should proceed?
Marketing Manager: ___(b)___?
Project Manager: That sounds feasible. How about the resources?
Marketing Manager: ___(c)___.
Project Manager: Understood. And the reporting?
Marketing Manager: ___(d)___.
Project Manager: Great, I’ll make the necessary adjustments. When do you need this by?
Marketing Manager: ___(e)___.

#### Choices:
(a)
a-1: Our timeline has been impacted, so we need to reassess our milestones.
a-2: Maybe we can push everything back by two weeks.
a-3: I think we should cancel the project.

(b)
b-1: Can we reallocate some resources to ensure we meet the new deadlines?
b-2: I believe a complete overhaul of the project is needed.
b-3: Should we not consider adjusting anything?

(c)
c-1: It's crucial we maintain our budget despite these changes.
c-2: I suggest we increase the budget significantly.
c-3: Maybe cutting costs on marketing can save us some time.

(d)
d-1: I would like to receive weekly progress updates moving forward.
d-2: We don't need to change the reporting frequency.
d-3: Let's not bother with reports for now.

(e)
e-1: When can we have the updated project plan?
e-2: Take your time, no rush on the updates.
e-3: I need it by tomorrow, is that possible?

#### Answers:
(a) Our timeline has been impacted, so we need to reassess our milestones.
(b) Can we reallocate some resources to ensure we meet the new deadlines?
(c) It's crucial we maintain our budget despite these changes.
(d) I would like to receive weekly progress updates moving forward.
(e) When can we have the updated project plan?`;

    const [parsedInstructionalText, setParsedInstructionalText] = useState([]);
    let conversationHistory = [];

    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a business English tutor targeting Chinese English learners, with twenty years of tutoring experience and professional business English knowledge. I will give you some "tasks" related to business English that you need to execute.' },
        { role: 'user', content: '## Task 1\n\nGenerate a specific business English conversation scenario description for business English learners in 20 words, including the professional role of the subject "I", the object of the conversation, and the specific purpose or content of the conversation. Please follow the format and example provided below:\n\nI am a front-end developer and need to discuss web design with a UI designer.' }
    ]);

    const oneShotExamples = [
        "### Version 1: English Dialogue\n\n**A (Me):** Hi, I've noticed there's a schedule conflict with our meeting. Can we discuss a new time?\n\n**B (Colleague):** Sure, when do you suggest?\n\n**A (Me):** How about Thursday at 3 PM? Does that work for you?\n\n**B (Colleague):** Thursday at 3 PM sounds good. I'll check and confirm in a bit.\n\n**A (Me):** Great, please let me know once you confirm so I can adjust my schedule too.\n\n**B (Colleague):** Will do. Thanks for the heads up.\n\n**A (Me):** No problem, thank you for being flexible.\n\n### Version 1: Chinese Dialogue Translation\n\n**A (我):** 嗨，我注意到我们的会议时间有冲突。我们可以讨论一个新的时间吗？\n\n**B (同事):** 当然，你建议什么时候？\n\n**A (我):** 周四下午3点怎么样？适合你吗？\n\n**B (同事):** 周四下午3点听起来不错。我会检查一下然后确认。\n\n**A (我):** 太好了，请一旦确认就告诉我，这样我也可以调整我的日程。\n\n**B (同事):** 会的。谢谢你提前通知。\n\n**A (我):** 没问题，谢谢你的灵活配合。\n\n---\n\n### Version 2: English Dialogue\n\n**A (Me):** Hello, there seems to be a clash with our meeting time. Can we find an alternative?\n\n**B (Manager):** Yes, what time are you thinking of?\n\n**A (Me):** Is Wednesday morning at 10 okay for you?\n\n**B (Manager):** Let me check. Wednesday at 10 is fine. Let's reschedule to then.\n\n**A (Me):** Thank you. I'll update my calendar and inform the team.\n\n**B (Manager):** Perfect, I'll send out an updated invitation.\n\n**A (Me):** Thanks, I appreciate your help with this.\n\n### Version 2: Chinese Dialogue Translation\n\n**A (我):** 你好，我们的会议时间似乎有冲突。我们能找个替代时间吗？\n\n**B (经理):** 是的，你考虑什么时间？\n\n**A (我):** 星期三上午10点对你来说可以吗？\n\n**B (经理):** 让我查一下。星期三上午10点没问题。我们就改到那时吧。\n\n**A (我):** 谢谢。我会更新我的日历并通知团队。\n\n**B (经理):** 完美，我会发送一个更新的邀请。\n\n**A (我):** 谢谢，我很感激你在这件事上的帮助。",
    ]

    const prompts = [
        `Based on the "scenario", "domain" and "target audience" below, execute "Task 2"\n## Scenario\n${scenarioText}\n\n## Domain:\n${domainText}\n\n## Target Audience\nChinese English language learners, with a language proficiency of passing the CET-4 (CEFR Level B1), and a need to learn business English.\n\n## Task 2\nAccording to the needs of the "scenario," generate a communication dialogue example for the "target audience" that fits their language level and business English learning needs. The dialogue should meet the following standards:\n1) Sentence length: an average of 8-15 words per sentence.\n2) Sentence structure: can include simple sentences, compound sentences, and some complex sentences, avoiding overly complicated sentence structures.\n3) Grammatical complexity: use basic tenses like the simple present, simple past, simple future, and present perfect, with occasional use of conditional sentences and passive voice.\n4) The dialogue has two roles, A and B. Role A represents the target audience themselves (indicated as "me"), and Role B is a communication partner in a business context (such as a colleague, superior/inferior, company personnel, client, etc.). In the dialogue, Role A needs to communicate with Role B about the content described in the "scenario" and come to a conclusion together. The dialogue is initiated by Role A. The entire dialogue should not exceed 350 English words.\nGenerate two versions of the scenario dialogue, each version outputting in the form of one English dialogue followed by one Chinese dialogue translation.\n\nUse the exact same format as the following example：\n${oneShotExamples[0]}`,
        `Based on the "Choice" and "Target Audience" below, execute "Task 3"\n\n## Choice\nSelect the dialogue content of [Version ${conversationIdx + 1}] above as the learning material.\n\n## Target Audience\nChinese English language learners who have passed the College English Test Band 4 (CEFR B1 level) and have a need to learn Business English.\n\n## Task 3\nBased on the dialogue content from the "Choice," extract 3-5 core words or professional terms that are relatively difficult for the "Target Audience" to grasp from Role A's expressions, as well as 3-5 sentence patterns that the target audience needs to practice. The words and sentence patterns need to match the language level of the "Target Audience." Please focus on the words and sentence patterns used by Role A in the dialogue, excluding those used by Role B. Refer to the following output example and format for your output:\n\n[Core Words]\ncomplexity\ntimeline\nensure\nquality\nadjusted\n\n[Key Sentence Patterns]\nDue to [reason], we're unable to [action].\nWe can ensure [something] within [time period].\nWould [proposal] work for you?`,
        `Based on the "Target Audience" below, execute "Task 4"\n\n## Target Audience:\nChinese English language learners who have passed the College English Test Band 4 (CEFR Level B1) and have a need to learn business English.\n\n## Task 4\nBased on the "Scenario," "Choices" of dialogue [version], [core words], [key sentence patterns] above, generate a "learning objective" for the "target audience," and directly use the output results above without modifying the language content. Output according to the following format and example:\n\n### Task 4 Output Format\n[Scenario]\n\n[Dialogue]\n\n[Core Words]\n\n[Key Sentence Patterns]\n\n[Learning Objective]\n\n### Task 4 Output Example\nScenario:\nThere is a scheduling conflict for the meeting time, and the meeting time needs to be changed.\n\nDialogue:\nA (Me): Hi, I've noticed there's a schedule conflict with our meeting. Can we discuss a new time?\nB (Colleague): Sure, when do you suggest?\nA (Me): How about Thursday at 3 PM? Does that work for you?\nB (Colleague): Thursday at 3 PM sounds good. I'll check and confirm in a bit.\nA (Me): Great, please let me know once you confirm so I can adjust my schedule too.\nB (Colleague): Will do. Thanks for the heads up.\nA (Me): No problem, thank you for being flexible.\n\nCore Words:\nconflict\nschedule\nadjust\nconfirm\nflexible\n\nKey Sentence Patterns:\nI've noticed there's a [noun] with our [noun].\nCan we discuss a new [noun]? \nDoes that work for you?\nPlease let me know once you [verb].\nThank you for being [adjective]. \n\nLearning Objective:\nThrough this learning, you will be able to communicate in proper English when encountering a meeting time conflict, express your preferred time arrangement, and coordinate with others to determine a new meeting time. Additionally, you will learn how to express flexibility and gratitude in business communications.`,
        `## Task 5\nBased on the "Learning Objective", "Core Words", "Key Sentence Patterns", and "Dialogue" in the "Output of Task 4", generate business English practice questions to help the target audience achieve the learning objective. The questions need to align with the "Question" described below and refer to the format of the "Question Example", outputting in full English. Use exactly the same tags! Be aware of the singular/plural form. \n\n### Question 1\n#### Question:\nBased on the "Dialogue" in the "Output of Task 4", provide a specific scenario case;\nExtract 3~5 blanks from the "Dialogue" section in the "Output of Task 4" related to the "Core Words", number each blank with a, b, c, d, e, and keep the rest of the "Dialogue" unchanged in the Question. Note that the "Core Words" should be consistent with the output results in the "Output of Task 4".\n\n#### Choices: \nFor each blank a, b, c, e, d, provide four options, including the correct answer. The other three distractors should be chosen randomly from the "Core Words" without repetition.\n\n#### Answers:\nPlace the numbering of the blanks and the corresponding answers here.\nUse the same labels as the example:\n### Question Example 1\n#### Question:\n#### Question:\n\nImagine you are a UX designer discussing your approach to user experience design in a job interview.\nInterviewer: So, tell me about how you approach your work in UX design.\nYou: Hello, I'm here to discuss my role as a UX designer. I (a) user feedback and apply it to improve our designs. On a recent project, we increased user satisfaction by 30% after (b) the interface. I (c) closely with marketing and engineering to align our goals. Keeping up with rapid technology changes is a challenge, but I'm always (d).\n\n#### Choices: \n(a) analyze; feedback; interface; adaptability\n(b) redesigning; collaborate; feedback; analyze\n(c) collaborate; adaptability; analyze; interface\n(d) learning; feedback; adaptability; redesigning\n\n#### Answers:\n(a) analyze\n(b) redesigning\n(c) collaborate\n(d) learning`,
        `### Question 2\n\n#### Question:\nBased on the "Dialogue" in the "Output of Task 4", provide a specific scenario case;\nUse the "Dialogue" from the "Output of Task 4" without creating new dialogues. Identify the sentences containing "Core Words" or "Key Sentence Patterns" and blank out the entire sentence, not just single words! Number each blank with a, b, c, d, e, and present the other parts of the "Dialogue" in the Question. Note that the "Dialogue", "Core Words", and "Key Sentence Patterns" should all be consistent with the output results in the "Output of Task 4".\n\n#### Choices: \nBreak each blanked sentence into several phrases (for example, break "I like your cats" into "I", "like", "your cats" - three phrases), with each phrase not exceeding three words, and then output the phrases in a scrambled order as multiple options, without any distractors. Then, process the sentences for each blank a, b, c, d, e in this manner.\n\n#### Answers:\nReoutput each blanked entire sentence in the correct order as it appears in the dialogue, corresponding it with the blank numbering a, b, c, d, e.\nUse the same labels as the example. Be aware of the singular/plural form:\n### Question Example 2\n#### Dialogue:\nA (Me): Hi, I've noticed there's a schedule conflict with our meeting. Can we discuss a new time?\nB (Colleague): Sure, when do you suggest?\nA (Me): How about next Thursday at 3 PM? Does that work for you?\nB (Colleague): That sounds good … but I need to double-check my calendar and get it back to you.\nA (Me): Great, please let me know once you confirm so I can adjust my schedule too.\nB (Colleague): Will do. Thanks for the heads up.\nA (Me): No problem, thank you for being flexible.\n\n#### Question:\nImagine you are trying to let your client know that a meeting you have scheduled for next Tuesday will have to be moved to another day due to a conflict that came up.\n\nYou:  Hi, ___(a)___. Can we discuss a new time?\nClient: Sure, when do you suggest?\nYou: How about next Thursday at 3 PM? ___(b)___?\nClient: That sounds good … but I need to double-check my calendar and get it back to you.\nYou: Great, ___(c)___.\nClient: Will do. Thanks for the heads up.\nYou: No problem, ___(d)___.\n\n\n#### Choices: \n(a) with our meeting; I've noticed;  conflict; there is a; schedule\n(b) that; work; for you; Does\n(c) let me know; adjust; once you confirm; I can; my schedule; too; please; so\n(d) being; thank you; flexible; for\n\n#### Answers:\n(a) I've noticed there's a schedule conflict with our meeting\n(b) Does that work for you\n(c) please let me know once you confirm so I can adjust my schedule too\n(d) thank you for being flexible.`,
        `### Question 3\n\n#### Question:\nBased on the "scenario" in the "Output of Task 4", design a new and specific scenario case;\nUsing the "Key Sentence Patterns" and "Core Words" from the "Output of Task 4", design a new dialogue for your newly designed specific scenario case, called "Conversation". The dialogue format and language difficulty (length, word difficulty) should remain consistent with the "Dialogue" in the "Output of Task 4". Then, identify the sentences in the "Conversation" that contain "Core Words" or "Key Sentence Patterns" and blank out the entire sentence, not just single words! Number each blank with a, b, c, d, e, and present the other parts of the "Conversation" in the Question. Note that the "Core Vocabulary" and "Key Sentence Patterns" should be consistent with the output results in the "Output of Task 4".\n\n#### Choices:\nFor each blanked sentence, design three options, including the original sentence from the "new dialogue" and two distractors. Then, process the sentences for each blank a, b, c, d, e in this manner.\n\n#### Answers:\nProvide the correct sentence answers for the blanks a, b, c, d, e respectively.\nUse the same labels as the example. Be aware of the singular/plural form:\n### Question Example 3\n#### Question:\nImagine you are trying to let your client know that a meeting you have scheduled for next Tuesday will have to be moved to another day due to a conflict that came up. Remember that this is an important client and you would like to keep the communication formal and polite. \n\n#### Conversation:\nClient: Hey, I know you wanted to talk shortly, what’s the matter? \nYou: ___(a)___ \nClient: Is there an issue? \nYou: Yes. ____(b)____\nLet me check my schedule … Yes, that would work. I will see you on Wednesday. \n\n#### Choices:\n(a)\na-1: Thank you for your time on such short notice. I am reaching out to talk about our upcoming meeting next Tuesday. \na-2: My boss can’t make it to our meeting next Tuesday. \na-3: We gotta reschedule that meeting for next Tuesday. \n\n(b)\nb-1: Due to a conflict that came up, we are wondering if we can reschedule the meeting for Wednesday afternoon if it works for your team. \nb-2: How does Wednesday afternoon look for your team? \nb-3: Wednesday afternoon is what I have in mind now. \n\n#### Answers:\n(a) Thank you for your time on such short notice. I am reaching out to talk about our upcoming meeting next Tuesday. \n(b) Due to a conflict that came up, we are wondering if we can reschedule the meeting for Wednesday afternoon if it works for your team.`
    ]

    // useEffect(() => {
    //     if (parsedInstructionalText.length !== 0 && vocabs[0] === null) {
    //         generateVocabularies(2);
    //     }
    // }, [parsedInstructionalText]);

    // useEffect(() => {
    //     if (parsedInstructionalText.length !== 0 && vocabs[0] !== null && vocabs[1] === null) {
    //         generateVocabularies(3);
    //     }
    // }, [vocabs]);

    function parseQuestion1String(input) {

        const sections = input.split(/(### Question \d+)/).slice(1);
        const questions = [];
        console.log(sections);
        for (let i = 0; i < sections.length; i += 2) {
            const questionBlock = sections[i] + sections[i + 1];
            console.log(questionBlock);
            const questionType = 1;
            const questionText = questionBlock.match(/#### Question:\s*([\s\S]*?)\n#### Choices:/)[1].trim();
            const choicesText = questionBlock.match(/#### Choices:\s*([\s\S]*?)\n#### Answers:/)[1].trim();
            const answersText = questionBlock.match(/#### Answers:\s*([\s\S]*)/)[1].trim();

            const choices = {};
            choicesText.split('\n').forEach(choice => {
                const [key, values] = choice.match(/\((.*?)\) (.*)/).slice(1);
                choices[key] = values.split('; ').map(item => item.trim());
            });

            const answers = {};
            answersText.split('\n').forEach(answer => {
                const tmp = answer.match(/\((.*?)\) (.*)/)
                if (tmp !== null && tmp.length > 1){
                    const [key, value] = tmp.slice(1);
                    answers[key] = value.trim();
                }
            });
            console.log({
                questionType,
                questionText,
                choices,
                answers
            });
            setQuestions(prevQuestions => [...prevQuestions, {
                questionType,
                questionText,
                choices,
                answers
            }]);
            return {
                questionType,
                questionText,
                choices,
                answers
            };
        }

        // return questions;
    }

    function parseQuestion2String(input) {
        const structuredObject = {
            question: "",
            conversations: [],
            choices: {},
            answers: {},
            questionType: 2,
        };

        const sections = input.split(/#### /g).slice();

        // Get the main question
        structuredObject.question = sections[1].split("\n")[1].trim();

        // Extract dialogues
        const dialogueLines = sections[1].split('\n').filter(line => line.includes(':')).map(line => line.trim());
        structuredObject.conversations = dialogueLines.map(line => {
            const parts = line.split(':');
            const speaker = parts[0].trim();
            const text = parts.length > 1 ? parts.slice(1).join(':').trim() : ""; // Join back the remaining parts and trim

            return { speaker, text };
        }).filter(item => (item.text!== undefined && item.text.trim() !== ""));

        // Extract choices
        const choicesLines = sections[2].split('\n').filter(line => line.includes('(')).map(line => line.trim());
        choicesLines.forEach(choice => {
            const match = choice.match(/\((.)\)/);
            const key = match[1];
            structuredObject.choices[key] = choice.split(')').pop().trim();
        });
        console.log(structuredObject);
        // Extract answers
        const answersLines = sections[3].split('\n').filter(line => line.includes('(')).map(line => line.trim());
        answersLines.forEach(answer => {
            const match = answer.match(/\((.)\)/);
            const key = match[1];
            structuredObject.answers[key] = answer.split(')').pop().trim();
        });

        setQuestions(prevQuestions => [...prevQuestions, structuredObject]);
        return structuredObject;

    }

    function parseQuestion3String(input) {
        const structuredObject = { questionType: 3 };

        // Extract Question and Conversation
        const questionMatch = input.match(/#### Question:\s*([\s\S]*?)#### Conversation:/);
        const conversationMatch = input.match(/#### Conversation:\s*([\s\S]*?)#### Choices:/);

        if (questionMatch && questionMatch[1]) {
            structuredObject.question = questionMatch[1].trim();
        }
        if (conversationMatch && conversationMatch[1]) {
            const conversationLines = conversationMatch[1].trim().split('\n').map(line => line.trim());
            structuredObject.conversations = conversationLines.map(line => {
                const parts = line.split(':');
                const speaker = parts[0].trim();
                const text = parts.length > 1 ? parts.slice(1).join(':').trim() : ""; // Join back the remaining parts and trim

                return { speaker, text };
            }).filter(item => (item.text!== undefined && item.text.trim() !== ""));

        }

        // Extract Choices
        const choicesMatch = input.match(/#### Choices:\s*([\s\S]*?)#### Answers:/);
        if (choicesMatch && choicesMatch[1]) {
            structuredObject.choices = {};
            const choicesSections = choicesMatch[1].match(/\([a-e]\)([^]*?)(?=\([a-e]\)|$)/g);
            if (choicesSections) {
                choicesSections.forEach(section => {
                    const key = section.trim().charAt(1);
                    structuredObject.choices[key] = section.trim().substring(3).split('\n').reduce((acc, line) => {
                        const match = line.match(/([a-e]-\d+): (.*)/);
                        if (match) {
                            acc[match[1]] = match[2].trim();
                        }
                        return acc;
                    }, {});
                });
            }
        }

        // Extract Answers
        const answersMatch = input.match(/#### Answers:\s*([\s\S]*)/);
        if (answersMatch && answersMatch[1]) {
            structuredObject.answers = {};
            const answersSections = answersMatch[1].match(/\([a-e]\) (.*)/g);
            if (answersSections) {
                answersSections.forEach(section => {
                    const key = section.trim().charAt(1);
                    const answer = section.trim().substring(4);
                    structuredObject.answers[key] = answer.trim();
                });
            }
        }

        setQuestions(prevQuestions => [...prevQuestions, structuredObject]);
        console.log(structuredObject, questions);
        return structuredObject;
    }

    function parseConversationString(input) {
        const normalizedInput = input.replace(/：/g, ':').replace(/[!"#$%&'*+\/;<=>?@\[\\\]^_`{|}~]/g, '');
        // console.log(normalizedInput);

        const [dialogueText1, dialogueText2] = normalizedInput.trim().split('---');

        // console.log(dialogueText1, dialogueText2);

        setParseConversations([dialogueText1.trim().replace("Version 1: ", "").replace("Version 1: ", ""), dialogueText2.trim().replace("Version 2: ", "").replace("Version 2: ", "")]);
    }

    function parseWordsPatterns(input) {
        const lines = input.trim().split('\n');
        let isWord = true;
        const newWords = [];
        const newPatterns = [];

        lines.forEach(line => {
            if (line.includes("Core Words")) {
                isWord = true;
                return;
            }
            else if (line.includes("Key Sentence Patterns")) {
                isWord = false;
                return;
            }
            else if (line.trim() === "") {
                return;
            }

            if (isWord) {
                newWords.push(line.replace(/\d+\.\s/g, '').trim());
            }
            else {
                newPatterns.push(line.replace(/\d+\.\s/g, '').trim());
            }
        });
        console.log(newWords, newPatterns);
        setWords(newWords);
        setPatterns(newPatterns);
        setWordSelectIds(Array(newWords.length).fill(true));
        setPatternSelectIds(Array(newPatterns.length).fill(true));
    }

    const [loading, setLoading] = useState(false);

    const gpt4ApiCall = async (newPrompt = "", setSomeContext = null) => {
        const newMessages = [...messages];
        if (newPrompt !== "") newMessages.push({ role: 'user', content: newPrompt });
        console.log("start:", newMessages);
        if (newPrompt !== "") setLoading(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: newMessages
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const newMessage = data.choices[0].message;
            newMessages.push(newMessage);
            setMessages(newMessages);
            console.log("end:", newMessage);
            if (setSomeContext !== null) setSomeContext(newMessage.content);
            if (newPrompt !== "") setLoading(false);

            return newMessage.content;
        } catch (error) {
            console.error('Error calling ChatGPT API:', error);
            throw error;
        }
    }

    const renderTextWithLineBreaks = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}{index < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    // useEffect(() => {
    //     setScenarioText(scenarioPlaceholderText);
    //     setDomainText(domainPlaceholderText);

    //     intervalId = setInterval(() => {
    //         setProgress(prevProgress => {
    //             if (prevProgress === 399 || prevProgress === 499 || prevProgress === 299) return prevProgress;
    //             if (prevProgress >= 500) {
    //                 clearInterval(intervalId);
    //                 return prevProgress; // Stop when image reaches the window width minus its own width to avoid overflow
    //             }
    //             return prevProgress + 1; // Increase position by 10px every second
    //         });
    //     }, 100);
    // }, []);

    // const gpt4Pipeline = async () => {
    //     await 
    // }

    const generateCoursePipeline = async () => {
        // await gpt4ApiCall(prompts[1], parseWordsPatterns);
        // await gpt4ApiCall(prompts[2]);
        // await gpt4ApiCall(prompts[3], parseQuestion1String);
        parseQuestion1String(question1Str);
        // await gpt4ApiCall(prompts[4], parseQuestion2String);
        parseQuestion2String(question2Str);
        // await gpt4ApiCall(prompts[5], parseQuestion3String);
        parseQuestion3String(question3Str);
    }

    return (
        <>
            {
                stage === 0 && !loading && (
                    <>
                        <HeadBar text={"Stage 1: Set Your Learning Goal"} />
                        <div className="font-bold text-lg m-2 mt-4">
                            What is your target use case scenario?
                        </div>
                        <AdaptiveTextarea placeholderText={scenarioPlaceholderText} text={scenarioText} setText={setScenarioText} />
                        <div className="flex flex-row justify-end mt-2">
                            <button onClick={() => { gpt4ApiCall("", setScenarioText) }} className="bg-gray-200 rounded-lg p-2">Shuffle Scenario</button>
                        </div>


                        <div className="font-bold text-lg m-2 mt-4">
                            What is your business domain?
                        </div>
                        <AdaptiveTextarea placeholderText={domainPlaceholderText} text={domainText} setText={setDomainText} />

                        <button className="w-full mt-4 rounded-xl p-2 outline outline-2 outline-gray-200 bg-theme-green text-white"
                            onClick={() => { increStage(); parseConversationString(conversationStr); }} // gpt4ApiCall(prompts[0], parseConversationString);
                        >
                            CONTINUE
                        </button>
                    </>
                )
            }
            {
                stage === 1 && !loading && (
                    <>
                        <HeadBar text={"Step 3: Confirm Your Learning Plan"} />
                        <div className="font-bold text-lg m-2 mt-4">
                            Based on your goal, which dialogue would you prefer?
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <div className={`cursor-pointer w-5/12 rounded-xl p-2 text-left text-gray-500 outline ${conversationIdx === 0 ? "outline-4 outline-blue-200 bg-blue-100" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={() => { setConversationIdx(0); setContext({ ...context, paragraphIdx: 0 }); setContext({ ...context, paragraphIdx: 0 }); }}
                            >
                                {renderTextWithLineBreaks(parsedConversations[0])}
                            </div>
                            <div className={`cursor-pointer w-5/12 rounded-xl p-2 text-left text-gray-500 outline ${conversationIdx === 1 ? "outline-4 outline-blue-200 bg-blue-100" : "outline-2 outline-gray-200"} rounded-lg`}
                                onClick={() => { setConversationIdx(1); setContext({ ...context, paragraphIdx: 1 }); setContext({ ...context, paragraphIdx: 1 }); }}
                            >
                                {renderTextWithLineBreaks(parsedConversations[1])}
                            </div>
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <button className="w-5/12 rounded-xl p-2 outline outline-2 outline-gray-200 text-gray-500"
                                onClick={decreStage}
                            >
                                GO BACK
                            </button>
                            <button className="w-5/12 rounded-xl p-2 outline outline-2 outline-gray-200 bg-theme-green text-white"
                                onClick={() => { increStage(); generateCoursePipeline(); }}
                            >
                                CONTINUE
                            </button>
                        </div>
                    </>
                )
            }
            {/* {
                stage === 2 && !loading && (
                    <>
                        <HeadBar text={"Step 3: Confirm Learning Plan"} />
                        <div className="font-bold text-lg m-2 mt-4">
                            Based on your goal, you will be learning:
                        </div>
                        <div className="font-bold text-md m-4">
                            Key Words:
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <div className="rounded-lg outline outline-2 outline-gray-200 w-[500px]">
                                {
                                    words.map((item, idx) => (
                                        <button onClick={() => { let newWordSelectIds = [...wordSelectIds]; newWordSelectIds[idx] = !newWordSelectIds[idx]; setWordSelectIds(newWordSelectIds); setContext({ ...context, wordSelectIds: newWordSelectIds }); }}
                                            key={idx} className={`p-2 w-[500px] ${wordSelectIds[idx] ? "bg-blue-100" : ""} outline-gray-200 outline-2 outline ${idx === 0 ? "rounded-t-lg" : (idx === words.length - 1 ? "rounded-b-lg" : "")}`}>{item}</button>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="font-bold text-md m-4">
                            Key Patterns:
                        </div>
                        <div className="flex flex-row justify-center w-full mt-4 space-x-4">
                            <div className="rounded-lg outline outline-2 outline-gray-200 w-[400px]">
                                {
                                    patterns.map((item, idx) => (
                                        <button onClick={() => { let newPatternSelectIds = [...patternSelectIds]; newPatternSelectIds[idx] = !newPatternSelectIds[idx]; setPatternSelectIds(newPatternSelectIds); setContext({ ...context, patternSelectIds: newPatternSelectIds }); }}
                                            key={idx} className={`p-2 w-[400px] ${patternSelectIds[idx] ? "bg-blue-100" : ""} outline-gray-200 outline-2 outline ${idx === 0 ? "rounded-t-lg" : (idx === patterns.length - 1 ? "rounded-b-lg" : "")}`}>{item}</button>
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
            } */}

            {
                stage === 2 && !loading && (
                    <>
                        <div className="font-bold text-xl m-2 mt-4">
                            Fill in the blank
                        </div>
                        <div className="text-lg m-2 mt-4">
                            <Blank increStage={increStage} questionText={questions[0].questionText} choices={questions[0].choices} answers={questions[0].answers}/>
                        </div>
                        
                    </>
                )
            }


            {
                loading && (
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

        </>
    );
};