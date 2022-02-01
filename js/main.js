"use struct"
let file;
let reader;
let str = [];
let word =[];
let translate =[];
let questionNum = 0;
let splitFlag = false;
let httpObj;

// enumの代わり
let FILETYPE = {
      EnglishWord : 0
    , HistoryWord : 1
    , EnglishWord2 : 2
};

let FilePath = [
      "https://api.github.com/search/repositories?q=javascript"
    , "https://api.github.com/search/repositories?q=javascript"
    , ""
];

// addEventListenerは一回しか起動されない。
// ページの読み込みが完了した時点なのでそれも当然か
//window.addEventListener('load', () => {
//    const f = document.getElementById('file1');
//    f.addEventListener('change', evt => {
//        let input = evt.target;
//        if (input.files.length == 0) {
//        console.log('No file selected');
//        return;
//        }
//        file = input.files[0];
//        reader = new FileReader();
//        reader.onload = () => {
//            str.push(reader.result);
//        };
//        reader.readAsText(file);
//    });
//});

function LoadTextFile(type)
{
    httpObj = new XMLHttpRequest();
    httpObj.open("GET", FilePath[type], false);   // 第三引数で同期、非同期を切り替え
    httpObj.send(null);
    
    // 同期処理なので直接呼ぶ
    displayData();
    
    // TODO:直接関数ポインタみたいに渡すことはできないのか？
    // 同期処理では状態変更がすべて終わっているので、
    // 状態変更をキャッチできない。
    //httpObj.onreadystatechange = function(type) {
    //    displayData(type);
    //};
}

function displayData(type)
{
    if (httpObj.readyState === 4 && httpObj.status === 200) {
        str.push(httpObj.responseText);
    }
}

function Question()
{
    // 読み込み完了前の可能性あるけどいったんそのまま
    if( splitFlag == false )
    {
        Split();
        splitFlag = true;
    }
    QuestionRequest();
    const inversion = document.getElementById("inversion").checked;
    let questionText = document.getElementById("questionText");
    questionText.innerHTML = !inversion ? word[questionNum] : translate[questionNum];
    
    let answerText = document.getElementById("qAnswer");
    answerText.innerHTML = "";
    let correct = document.getElementById("Correct");
    let incorrect = document.getElementById("Incorrect");
    correct.innerHTML  = "";
    incorrect.innerHTML  = "";
}

function QuestionRequest()
{
    questionNum = Math.floor( Math.random() * word.length );
    console.log(questionNum);
}

function Answer()
{
    const inversion = document.getElementById("inversion").checked;
    let tmp = !inversion ? translate[questionNum] : word[questionNum];
    const ans = tmp.split("・");
    const textArea = document.getElementById("answer");
    
    let answerText = document.getElementById("qAnswer");
    answerText.innerHTML = tmp;
    
    let correct = document.getElementById("Correct");
    let incorrect = document.getElementById("Incorrect");
    correct.innerHTML  = "";
    incorrect.innerHTML  = "×";
    for( let i = 0; i < ans.length; ++i)
    {
        if( ans[i] == textArea.value)
        {
            // 正解
            console.log("正解");
            correct.innerHTML  = "〇"
            incorrect.innerHTML  = "";
        }
        console.log(ans[i]);
    }
}

function Split()
{
    let wordCount = translateCount = 0;
    let mode = 0;   // 0:word, 1:translate 2:発音ゾーン、今は取得しない
    word[0] = "";
    translate[0] = "";
    for( let i = 0; i < str[0].length; ++i)
    {
        if( mode == 0)
        {
            if(str[0].charAt(i) != ',')
            {
                word[wordCount] += str[0].charAt(i);
            }
            else
            {
                wordCount++;
                word[wordCount] = "";
                mode = 1;
            }
        }
        else if( mode == 1)
        {
            if( (str[0].charAt(i) != "/") && (str[0].charAt(i) != "\r"))
            {
                translate[translateCount] += str[0].charAt(i);
            }
            else
            {
                translateCount++;
                translate[translateCount] = "";
                mode = 2;
            }
        }
        else if( mode == 2)
        {
            if( str[0].charAt(i) == "\n" && str[0].charAt(i + 1) != "\r")
            {
                mode = 0;
            }
        }
    }
    
    // TODO:最後に""だけの要素が残るので取り出し。
    //      アルゴリズム見直したほうが絶対にいい。
    word.length = word.length - 1;
    translate.length = translate.length - 1;
}

// TODO:汎用関数
//      utility.js作ろう
function dispMsg(msg)
{
    console.log(msg);
}

