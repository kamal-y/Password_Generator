const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const dataCopy = document.querySelector("[data-copy-icon]");
const copyMsg = document.querySelector("[data-copiedMessage]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const symbolsCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");
const dataIndicator = document.querySelector("[data-indicator]");
const genButton = document.querySelector("[generate-password-btn]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

let password = "";
let passwordlength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");
const symbol='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function handleSlider(){
    inputSlider.value = passwordlength;
    lengthDisplay.innerText =  passwordlength ;
    let min = inputSlider.min;
    let max = inputSlider.max;

    inputSlider.style.backgroundSize=( (passwordlength-min)*100/(max-min) )+"% 100%";
}

function setIndicator(color){
    dataIndicator.style.backgroundColor = color;
    dataIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndmInteger(min,max){
    return Math.floor(Math.random()*(max-min)) +min;
}

function generateRdmNumber(){
    return getRndmInteger(0,9);
}

function generateUpperCase(){
    return String.fromCharCode( getRndmInteger( 65,91 ) );
}

function generateLowerCase(){
    return String.fromCharCode( getRndmInteger( 97,123 ) );
}

function generateSymbol(){
    randNum = getRndmInteger(0,symbol.length);
    return symbol[randNum];
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbols=false;

    if(upperCaseCheck.checked) hasUpper= true;
    if(lowerCaseCheck.checked) hasLower= true;
    if(numbersCheck.checked) hasNumber= true;
    if(symbolsCheck.checked) hasSymbols= true;

    if (hasUpper && hasLower && (hasNumber || hasSymbols) && passwordlength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbols) &&
        passwordlength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

async function copyToClipBoard(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
        console.log("data copied successfully");
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(
        ()=>{
            copyMsg.classList.remove("active");
        }
    ,2000);
}

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handlechange(){
    checkCount=0;
    allCheckBox.forEach(
        (checkbox)=>{
            if(checkbox.checked)
                checkCount++;
        }
    )

    if(checkCount > passwordlength){
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(
    (checkbox)=>{
        checkbox.addEventListener('change',handlechange);
    }
)

inputSlider.addEventListener("input",(e)=>{
    passwordlength = e.target.value;
    handleSlider();
})

dataCopy.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyToClipBoard();
})

genButton.addEventListener('click',
()=>{
    if(checkCount==0)
    return;

    password="";

    let funcArr=[];

    if(upperCaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowerCaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRdmNumber);
    if(symbolsCheck.checked) funcArr.push(generateSymbol);

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    for(let i=0;i<passwordlength-funcArr.length; i++){
        randNum=getRndmInteger(0,funcArr.length);
        password+=funcArr[randNum]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
}
);