const removePunctuationEnglish = (inputString: string): string => {
    // Define a regular expression that matches all punctuation
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

    // Use the replace method to remove all occurrences of punctuation
    const resultString = inputString.replace(punctuationRegex, '');

    return resultString;
};

const removePunctuationArabic = (inputString: string): string => {
    // Define a regular expression that matches all punctuation
    const punctuationRegex =
        /[٭۔٬٫٪؟؞؛؍،؊؉`÷×<>\-_()&^%\]\[/:".,'{}~¦+|!–ًٌٍَُِْٰ]/g;

    // Use the replace method to remove all occurrences of punctuation
    const resultString = inputString.replace(punctuationRegex, '');

    return resultString;
};

const removeTatweel = (text: string) => {
    return text.replace(/ـ/g, '');
};

const removeSpaces = (text: string) => {
    try {
        return text
            .replace(/\u2007/g, '')
            .replace(/ /g, ' ')
            .replace(/\u202F/g, '')
            .replace(/\u00A0/g, '')
            .trim()
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\t/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    } catch (e) {
        return text.trim();
    }
};

export const checkTextAndReWrite = (text: string) => {
    let resultText = text;
    resultText = removePunctuationArabic(resultText);
    resultText = removePunctuationEnglish(resultText);
    resultText = resultText.replace(/[ٱأآإ]/g, 'ا');
    resultText = resultText.replace(/[ؤ]/g, 'و');
    resultText = resultText.replace(/[ئ]/g, 'ذ');
    resultText = resultText.replace(/[ة]/g, 'ه');
    resultText = resultText.replace(/[ى]/g, 'ي');
    resultText = removeTatweel(resultText);
    resultText = removeSpaces(resultText);
    return resultText;
};
