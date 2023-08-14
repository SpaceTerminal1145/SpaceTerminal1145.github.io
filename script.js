var Output = [];
var InputtedCommand = [];
var HistoryLine = 0;
const CommandList = {
    OUTPUT: {
        Args: ["Content"],
        Execute: function (Args) { OutString(Args.Content); }
    },
    CALC: {
        Args: ["Na", "Nb"],
        Execute: function (Args) { OutString(Args.Na + Args.Nb); }
    },
    OPEN: {
        Args: ["URL"],
        Execute: function (Args) { window.open(Args.URL, "_blank"); }
    },
    COLOR: {
        Args: ["Color"],
        Execute: function (Args) {
            document.querySelector("#Box").style.borderColor = `rgb(${Args.Color})`;
            document.querySelector("#Box").style.boxShadow = `0px 0px 20px rgba(${Args.Color},0.7)`;
            document.querySelector("#Outputter").style.color = `rgb(${Args.Color})`;
            document.querySelector("#InputCommand").style.color = `rgb(${Args.Color})`;
            document.querySelector("#TipSpan").style.color = `rgb(${Args.Color})`;
        }
    }
};
const Outputter = document.getElementById("Outputter");
const Inputter = document.getElementById("InputCommand");
const TipSpan = document.getElementById("TipSpan");
const OutString = function (Text, NewLine = true) {
    if (NewLine) { Output.push(Text.toString()); }
    else { Output[Output.length - 1] += Text.toString(); };
    Update();
};
const Update = function () {
    Outputter.innerHTML = GetInnerHTML();
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
            ThrowError("解释命令", "执行指令所需的参数不足。");
        }
        else if (CommandList[Parser[0]].Args.length < Parser.length - 1) {
            ThrowError("解释命令", "给出了太多参数。");
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
        ThrowError("解释命令", `"${Parser[0]}"不是一个有效的指令。`);
    };
};
const ThrowError = function (Name, Text) { OutString(`${Name}时发生错误：${Text}`); };
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