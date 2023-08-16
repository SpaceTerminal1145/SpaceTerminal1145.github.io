var Output = [];
var InputtedCommand = [];
var HistoryLine = 0;
var Color = { r: 0, g: 128, b: 1 };
var UserLanguage = "zh_CN";
var WindowTitle = Language[UserLanguage].WindowTitle;
var CommandList = {
    OUTPUT: {
        Args: ["Content"],
        Execute: function (Args) { OutString(Args.Content); }
    },
    "CALC+": {
        Args: ["Na", "Nb"],
        Execute: function (Args) { OutString(Args.Na + Args.Nb); }
    },
    OPEN: {
        Args: ["URL"],
        Execute: function (Args) { window.open(Args.URL, "_blank"); }
    },
    COLOR: {
        Args: ["r", "g", "b"],
        Execute: function (Args) { Color = Args; Update(); }
    },
    CLEAR: {
        Args: [],
        Execute: function (_Args) { Output = []; Update(); }
    },
    TITLE: {
        Args: ["Title"],
        Execute: function (Args) { if (Args.Title === "") { WindowTitle = Language[UserLanguage].WindowTitle; Update() ;return; }; WindowTitle = Args.Title; Update(); }
    },
    LANGUAGE: {
        Args: ["TL"],
        Execute: function (Args) {
            if (!Object.keys(Language).includes(Args.TL)) {
                OutString(Language[UserLanguage].ChangeFailed);
                return;
            };
            UserLanguage = Args.TL;
            OutString(`${Language[UserLanguage].ChangedSuccessfully1}${LanguageName[Args.TL]}${Language[UserLanguage].ChangedSuccessfully2}`);
        }
    }
};
const Outputter = document.getElementById("Outputter");
const Inputter = document.getElementById("InputCommand");
const OutString = function (Text = "", NewLine = true) {
    if (NewLine) { Output.push(Text.toString()); }
    else { Output[Output.length - 1] += Text.toString(); };
    Update();
};
const Update = function () {
    Outputter.innerHTML = GetInnerHTML();
    document.querySelector("#TitleBox").innerText = WindowTitle;
    document.querySelector("#TitleBox").style.borderColor = `rgb(${Color.r},${Color.g},${Color.b})`;
    document.querySelector("#TipSpan").style.color = `rgb(${Color.r},${Color.g},${Color.b})`;
    document.querySelector("#Box").style.borderColor = `rgb(${Color.r},${Color.g},${Color.b})`;
    Outputter.style.color = `rgb(${Color.r},${Color.g},${Color.b})`;
    Inputter.style.color = `rgb(${Color.r},${Color.g},${Color.b})`;
};
const GetInnerHTML = function () {
    let Result = "";
    for (let i = 0; i < Output.length; i++) {
        Result += Output[i].replace("\n", "<br>");
        Result += "<br>";
    };
    return Result;
};
/**
 * 
 * @param {string} Command 
 */
const RunCommand = function (Command) {
    let Parser = Command.split(" ");
    Parser[0] = Parser[0].toUpperCase();
    if (Parser[0].replace(" ", "") === "") { return; };
    if (Object.keys(CommandList).includes(Parser[0])) {
        if (CommandList[Parser[0]].Args.length > Parser.length - 1) {
            ThrowError(Language[UserLanguage].InterpretCommand, Language[UserLanguage].InsParameters);
        }
        else if (CommandList[Parser[0]].Args.length < Parser.length - 1) {
            ThrowError(Language[UserLanguage].InterpretCommand, Language[UserLanguage].TooManyParameters);
        }
        else {
            let Arg = {};
            var TValue;
            for (let i in CommandList[Parser[0]].Args) {
                TValue = Parser[parseInt(i) + 1];
                if (parseFloat(TValue) == TValue) { TValue = parseFloat(TValue); };
                Arg[CommandList[Parser[0]].Args[i]] = TValue;
            };
            CommandList[Parser[0]].Execute(Arg);
        };
    }
    else {
        ThrowError(Language[UserLanguage].InterpretCommand, `${Language[UserLanguage].InvalidCommand1}${Parser[0]}${Language[UserLanguage].InvalidCommand2}`);
    };
};
const ThrowError = function (Name, Text) { OutString(`${Name}${Language[UserLanguage].FindError}${Text}`); };
document.addEventListener(
    "keydown",
    function (e) {
        console.log(e.key)
        if (e.key === "Enter") {
            OutString(`> ${Inputter.value}`);
            InputtedCommand.push(Inputter.value);
            HistoryLine = InputtedCommand.length;
            RunCommand(Inputter.value);
            Inputter.value = "";
        }
        else if (e.key === "ArrowUp") {
            if (HistoryLine - 1 < 0) { HistoryLine = InputtedCommand.length; };
            HistoryLine--;
            Inputter.value = InputtedCommand[HistoryLine];
        }
        else if (e.key === "ArrowDown") {
            if (HistoryLine + 1 > InputtedCommand.length - 1) { HistoryLine = -1; };
            HistoryLine++;
            Inputter.value = InputtedCommand[HistoryLine];
        };
    }
);
document.getElementById("Box").addEventListener(
    "click",
    function () {
        Inputter.focus();
    }
);
OutString("Space Terminal v1.1.0");