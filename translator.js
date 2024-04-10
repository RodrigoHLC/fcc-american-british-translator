const americanOnly = require('./american-only.js');
const britishOnly = require('./british-only.js')
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")

// ↓ ↓ ↓ ↓ MY CODE ↓ ↓ ↓ ↓ 
// REVERSE KEY-VALUE PAIR IN US→UK DICTIONARIES TO CREATE UK→US DICTIONARIES
let britishToAmericanSpelling = {};
for(let title in americanToBritishSpelling){
    britishToAmericanSpelling[americanToBritishSpelling[title]] = title
}
let britishToAmericanTitles = {};
for(let title in americanToBritishTitles){
    britishToAmericanTitles[americanToBritishTitles[title]] = title
};

let sourceArr; // TEXT WILL BE SPLIT TO CHECK EVERY WORD
let needsTranslation = false; // IF THIS REMAINS AS false BY THE END, NO TRANSLATION IS NECESSARY
// --------- REGULAR EXPRESSIONS ---------
// REGEX FOR MULTIPLE-WORD EXPRESSIONS (E.G.: "cotton candy")
let multiWordReg;
// TIME REGEXs
let hourRegAm = /(?<![a-z0-9])(([0-1]*[0-9])|(20|21|22|23)):[0-5][0-9](?![a-z0-9])/;  // H:MM or HH:MM FORMAT
let hourRegBr = /(?<![a-z0-9])(([0-1]*[0-9])|(20|21|22|23))\.[0-5][0-9](?![a-z0-9])/; // H.MM or HH.MM FORMAT
let hourReg; // CHANGES TO ONE OF THE PREVIOUS TWO DEPENDING ON LOCALE
// TITLES REGEXS
let titlesAm = /(?<![a-z\/\-])(mr\.|mrs\.|ms\.|mx\.|dr\.|prof\.)(?![a-z\/\-])/i;  // "Mr." OR "mr."
let titlesBr = /(?<![a-z\/\-])(mr|mrs|ms|mx|dr|prof)(?![a-z\/\-])/i; // "Mr" OR "mr"
let titleReg; // CHANGES TO ONE OF THE PREVIOUS TWO DEPENDING ON LOCALE
// SINGLE WORD REGEX
let wordReg = /(?<![\w\-\/])[a-z]+(?![\w\-\/])/i;
// REGEXS FOR HYPHENATED EXPRESIONS (E.G.:  "off-the-rack")
let hyphenReg = /[a-z]+\.*-[a-z]+\.*(-[a-z]+\.*)*/i; // OPTIONAL PERIODS FOR TITLES LIKE Mr./Mrs.
// REGEXS FOR SLASHED EXPRESIONS (E.G.:  "model/actor")
let slashReg = /[a-z]+\.*\/[a-z]+\.*(\/[a-z]+\.*)*/i; // OPTIONAL PERIODS FOR TITLES LIKE Mr./Mrs.
let slashArr = [];
let dictionaries = {};

class Translator {
    
    translate(text, locale){
        let originalText = text; // SAVE ORIGINAL TEXT FOR text KEY IN FINAL RESPONSE OBJECT
        // SET WHICH DICTIONARIES AND REGEXs TO USE
        if( locale =="american-to-british"){
            dictionaries.expressions = americanOnly;
            dictionaries.spelling = americanToBritishSpelling,
            titleReg = titlesAm,
            hourReg = hourRegAm
        } else if ( locale == "british-to-american" ){
            dictionaries.expressions = britishOnly,
            dictionaries.spelling = britishToAmericanSpelling,
            titleReg = titlesBr,
            hourReg = hourRegBr
        }
        // CHECK FOR MULTI-WORD EXPRESSIONS *BEFORE* SPLITTING TEXT BY SPACES
        for(let expression in dictionaries.expressions){
            multiWordReg = new RegExp(`(?!<[a-z])${expression}(?![a-z])`,"gi")
            // IF A MULTI-WORD EXPRESSION IS PRESENT IN STRING:
            if(multiWordReg.test(text)){
                // REPLACE SPACES IN EXPRESSION WITH UNDERSCORES SO .split() WON'T SEPARATE IT
                needsTranslation = true;
                // console.log("1");
                text = text.replace(multiWordReg , `<span class="highlight">${dictionaries.expressions[expression].replace(/\s/ig, "_")}</span>` )
                // workingText = text.replace(new RegExp(`${text.match(multiWordReg)[0]}`,"ig") , `<span class="highlight">${dictionaries.expressions[text.match(multiWordReg)[0]].replace(/\s/ig, "_")}</span>` )
                // text = text.replace(new RegExp(`${text.match(multiWordReg)[0]}`,"ig") , text.match(multiWordReg)[0].replace(/\s/g, "_") )
            }
        }

        // SPLIT TEXT INTO FRAGMENTS (MIGHT INCLUDE SYMBOLS LIKE: , . "" ! ? ETC.)
        sourceArr = text.split(/\s+/); // console.log(sourceArr);

        // SETUP FOR ANALIZING EVERY FRAGMENT
        let frag; // THE PART OF THE INDEX IN sourceArr THAT MATCHED A REGEX
        let fragReg; // USE FRAGMENT TO CREATE A REGEX
        let expressionCheck;  // REGEX OF HYPHENATED EXPRESSIONS 
        let newHour; //
        let newTitle;
        // ANALYZE EVERY FRAGMENT:
        for(let i=0; i<sourceArr.length ; i++){
            // 1) CHECK FOR HOURS
            if(sourceArr[i].match(hourReg)){
                needsTranslation = true;  // DO NOT RETURN "Everything looks good to me!"
                // console.log("2");
                frag = sourceArr[i].match(hourReg)[0]; // THE PART OF THE INDEX IN sourceArr THAT MATCHED A REGEX
                // IF READING AMERICAN TIME
                if(locale == "american-to-british"){
                    // sourceArr[i] = sourceArr[i].match(hourReg)[0].replace(":", ".")
                    newHour = sourceArr[i].match(hourReg)[0].replace(":", "."); // COULD HAVE USED frag.replace(...)
                    // MAKE SURE NOT TO REPLACE THE ENTIRE sourceArr[i], AS IT COULD CONTAIN SYMBOLS AROUND THE frag THAT NEED TO STAY (E.G: ['flavor.'] NEEDS TO REPLACE 'flavor', BUT KEEP THE PERIOD)
                    sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${newHour}</span>`)
                }else if(locale == "british-to-american"){
                    // sourceArr[i] = sourceArr[i].match(hourReg)[0].replace(".", ":")
                    newHour = sourceArr[i].match(hourReg)[0].replace(".", ":"); // COULD HAVE USED frag.replace(...
                    sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${newHour}</span>`) //
                }
                continue // NO MORE CHECKS FOR THIS FRAGMENT
            }
            // 2) CHECK FOR HYPHENATED EXPRESSIONS
            else if(sourceArr[i].match(hyphenReg)){
                frag = sourceArr[i].match(hyphenReg)[0];
                for(let expression in dictionaries.expressions){
                    expressionCheck = new RegExp(`${expression}`,"ig")
                    // IF A HYPHENATED EXP IS PRESENT IN STRING:
                    if(expressionCheck.test(frag)){
                        needsTranslation = true;
                        // console.log("3");
                        sourceArr[i] = sourceArr[i].replace(frag.match(expressionCheck), `<span class="highlight">${dictionaries.expressions[expression]}</span>`);
                        // sourceArr[i] = sourceArr[i].replace(frag.match(expressionCheck), `4<span class="highlight">${dictionaries.expressions[expression]}</span>`);
                        break // STOP SEARCHING DICTIONARY
                    }
                }
                continue // NO MORE CHECKS FOR THIS FRAGMENT
            }
            // 3) CHECK FOR SLASH EXPRESSIONS (E.G.: "actor/model/singer")
            else if(slashReg.test(sourceArr[i])){
                // SPLIT WORDS BY SLASH
                slashArr = sourceArr[i].split("/");
                // console.log("slashArr: ", slashArr);
                // LOOP ONLY THROUGH WORDS THAT WERE SEPARATED BY A SLASH
                for( let x = 0 ; x < slashArr.length ; x++){
                    // CHECK EACH WORD FOR TITLES
                    if(slashArr[x].match(titleReg)){
                        needsTranslation = true;
                        // console.log("4");
                        // console.log(slashArr[x], " matches")
                        frag = sourceArr[i].match(titleReg)[0];
                        if(locale == "american-to-british"){
                            newTitle = frag.replace(".", "");
                            sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${newTitle}</span>`)
                        }else if(locale == "british-to-american"){
                            newTitle = frag+".";
                            sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${newTitle}</span>`)
                        }
                        // console.log("New slashArr[x]: ", slashArr[x])
                        // console.log("New slashArr: ", slashArr)
                        continue // NO MORE CHECKS FOR THIS FRAGMENT
                    }
                    // IF NOT A TITLE, CHECK FOR SINGLE WORDS
                    else if(slashArr[x].match(wordReg)){
                        // console.log(slashArr[x], " matches")
                        frag = slashArr[x].match(wordReg)[0];
                        // console.log("frag: ", frag)
                        fragReg = new RegExp(`^(?<![a-z\-])${frag}(?![a-z\-])$`, "i")
                        for(let expression in dictionaries.spelling){
                            if(fragReg.test(expression)){
                                needsTranslation = true;
                                // console.log("5");
                                slashArr[x] = slashArr[x].replace(frag, `<span class="highlight">${dictionaries.spelling[expression]}</span>`);
                                // slashArr[x] = slashArr[x].replace(frag, `6<span class="highlight">${dictionaries.spelling[expression]}</span>`);
                                continue
                            }
                        };
                        for(let expression in dictionaries.expressions){
                            if(fragReg.test(expression)){
                                needsTranslation = true;
                                // console.log("6");
                                slashArr[x] = slashArr[x].replace(frag, `<span class="highlight">${dictionaries.expressions[expression]}</span>`);
                                // slashArr[x] = slashArr[x].replace(frag, `7<span class="highlight">${dictionaries.expressions[expression]}</span>`);
                                continue
                            }
                        }
                    continue
                    }
                }
                sourceArr[i] = slashArr.join("/");
                continue
            }
            // ↑ ↑ ↑ ↑ END OF WORKING WITH SLASHED EXPRESSIONS ↑ ↑ ↑ ↑

            // 4) CHECK FOR TITLES
            else if(sourceArr[i].match(titleReg)){
                needsTranslation = true;
                // console.log("7");
                frag = sourceArr[i].match(titleReg)[0]; // THE PART OF THE INDEX IN sourceArr THAT MATCHED A REGEX

                if(locale == "american-to-british"){
                    newTitle = frag.replace(".", "");
                    sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${newTitle}</span>`)
                    // sourceArr[i] = sourceArr[i].replace(".", "")
                }else if(locale == "british-to-american"){
                    newTitle = frag+".";
                    sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${newTitle}</span>`)
                }
                continue // NO MORE CHECKS FOR THIS FRAGMENT
            }
            // 5) CHECK FOR SINGLE WORDS
            else if(sourceArr[i].match(wordReg)){
                frag = sourceArr[i].match(wordReg)[0];
                fragReg = new RegExp(`^(?<![a-z\-])${frag}(?![a-z\-])$`, "i")
                for(let expression in dictionaries.spelling){
                    if(fragReg.test(expression)){
                        needsTranslation = true;
                        // console.log("8");
                        sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${dictionaries.spelling[expression]}</span>`);
                        // sourceArr[i] = sourceArr[i].replace(frag, `2<span class="highlight">${dictionaries.spelling[expression]}</span>`);
                        break // STOP CHECKING DICTIONARIES
                    }
                };
                for(let expression in dictionaries.expressions){
                    if(fragReg.test(expression)){
                        needsTranslation = true;
                        // console.log("9");
                        sourceArr[i] = sourceArr[i].replace(frag, `<span class="highlight">${dictionaries.expressions[expression]}</span>`);
                        // sourceArr[i] = sourceArr[i].replace(frag, `3<span class="highlight">${dictionaries.expressions[expression]}</span>`);
                        break // STOP CHECKING DICTIONARIES
                    }
                }
            }
        }

        // IF NOTHING HAPPENED DURING PREVIOUS LOOP AND NO TRANSLATION WAS REQUIRED:
        if(!needsTranslation){
            return {
                text: originalText,
                translation: "Everything looks good to me!"
            }
        }

        // IF TRANSLATIONS WERE EXECUTED:

        // JOIN THE ENTIRE ARRAY USING SPACES
        let translatedStr = sourceArr.join(" ");
        // REPLACE UNDERSCORES (_) FROM MULTI-WORD EXPRESSIONS
        translatedStr = translatedStr.replace(/_/g, " ");
        needsTranslation = false; // RESET SO FUTURE REQUESTS WORK PROPERLY
        return {
            "text": originalText,
            "translation": translatedStr
        }
    }
}
// console.log("");
module.exports = Translator;