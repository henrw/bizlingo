
export function parseVocabsText(vocabTexts) {
    const vocabLines = vocabTexts.trim().split('\n');
    const vocabLs = [];

    vocabLines.forEach(line => {
        // Each dialogue is an array of sentence-person objects
        const [vocabEn, vocabCh] = line.trim().split(/[:：]/);
        if (vocabCh !== undefined) vocabLs.push({ vocabEn: vocabEn.replace(/\d+\.\s/g, '').trim(), vocabCh: vocabCh.replace(/\d+\.\s/g, '').trim() })
    });

    return vocabLs;
}
export function parseDialogueText(dialogueText) {
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
            const cleanLine = line.replace(/[*]/g, "");
            const colonIndex = cleanLine.indexOf(':');
            if (colonIndex === -1) return;  // Skip if no colon found

            // Extract the person and the sentence
            const personEn = cleanLine.substring(0, colonIndex).trim();
            const sentenceEn = cleanLine.substring(colonIndex + 1).trim();

            // Add the object to the dialogue array
            dialogue.push({ personEn, sentenceEn });
        });

        for (let i = 0; i < chineseLines.length; ++i) {
            const line = chineseLines[i];
            // Find the colon which separates the person identifier from the sentence
            const cleanLine = line.replace(/[*]/g, "");
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

export function parseMonologueText(monologueText) {
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
            const cleanLine = line.replace(/[*]/g, "");
            const colonIndex = cleanLine.indexOf(':');
            if (colonIndex !== -1) {
                // Extract the person and the sentence
                const personEn = cleanLine.substring(0, colonIndex).trim();
                const sentenceEn = cleanLine.substring(colonIndex + 1).trim();

                // Add the object to the monologue array
                monologue.push({ personEn, sentenceEn });
            }
            else if (cleanLine.trim() !== '') {
                monologue.push({ personEn: monologue[monologue.length - 1].personEn, sentenceEn: cleanLine.trim() });
            }
        });
        for (let i = 1; i < chineseLines.length; ++i) {
            if (i > monologue.length) return;
            const line = chineseLines[i];
            // Find the colon which separates the person identifier from the sentence
            const cleanLine = line.replace(/[*]/g, "");
            const colonIndex = cleanLine.indexOf(':');
            if (colonIndex !== -1) {
                const personCh = cleanLine.substring(0, colonIndex).trim();
                const sentenceCh = cleanLine.substring(colonIndex + 1).trim();
                // Add the object to the monologue array
                console.log(monologue[i], i, sentenceCh)
                monologue[i - 1].personCh = personCh;
                monologue[i - 1].sentenceCh = sentenceCh;

            }
            else if (cleanLine.trim() !== '') {
                monologue[i - 1].personCh = monologue[monologue.length - 1].personCh;
                monologue[i - 1].sentenceCh = cleanLine.trim();
            }

        };

        console.log(monologue);

        // Add the populated monologue to the monologues array
        monologues.push(monologue);
    });

    console.log(monologues)


    return monologues;
}

export const combineInstructionalText = (instructionalText) => {
    if (instructionalText == undefined || instructionalText == null) return "";
    return instructionalText.filter(item => item.personEn.includes("A")).map(item => item.sentenceEn).join("\n");
}