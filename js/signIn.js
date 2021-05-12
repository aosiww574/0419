const tip = document.querySelectorAll(".tip");
tip[0].innerText = 'Please enter player id';
tip[1].innerText = 'Password must be 8~20 alphanumeric';
tip[2].innerText = 'Please re-enter your password';

// Player ID
const userName = document.querySelector("#userName");
const regexNameCheck = /.*(?=.*\d)(?=.*[a-zA-Z]).*/
var nameStatus = false;
userName.addEventListener("blur", checkName);
function checkName() {
    // 不成立的話提出警告
    if (!regexNameCheck.test(userName.value)) {
        tip[0].innerText = 'Please must be 5~9 alphanumeric';
        tip[0].style.color = 'red';
        // 
        console.log('false')
        nameStatus = false;
    } else {
        tip[0].innerText = 'true';
        tip[0].style.color = 'black';
        // 
        console.log('true')
        nameStatus = true;
    }
}

// 密碼一
const userPassword = document.querySelector("#password");
userPassword.addEventListener("blur", checkPassword);
var passwordStatus = false;
function checkPassword() {
    if (!regexNameCheck.test(userPassword.value)) {
        // alert('Please must be 8~20 alphanumeric');
        tip[1].innerText = 'Please must be 8~20 alphanumeric';
        tip[1].style.color = 'red';
        // 
        console.log('false')
        passwordStatus = false;
    } else {
        tip[1].innerText = 'true';
        tip[1].style.color = 'black';
        // 
        console.log('true')
        passwordStatus = true;
    }
    if (userRePassword.value !== '') {
        checkRePassword()
        // 
        console.log('userRePassword')
    }
}

// 密碼二
const userRePassword = document.querySelector("#re-password");
userRePassword.addEventListener("blur", checkRePassword);
var rePasswordStatus = false;
function checkRePassword() {
    if (userPassword.value !== userRePassword.value || userRePassword.value === '') {
        tip[2].innerText = 'Your password and Confirm Password are different please re-enter';
        tip[2].style.color = 'red';
        // 
        console.log('false')
        rePasswordStatus = false;
    } else {
        tip[2].innerText = 're-password is true';
        tip[2].style.color = 'black';
        // 
        console.log('true')
        rePasswordStatus = true;
    }
}

// Contact Number(手機號碼)
const userPhone = document.querySelector("#phone");
const sendTextButton = document.querySelector("#sendMessage");
sendTextButton.className = "disabled";
const regexPhone = /\d{9}/;
var phoneStatus = false;
userPhone.addEventListener("blur", checkPhone);
function checkPhone() {
    // 
    console.log(userPhone.value)
    // 是否為9個數字
    if (regexPhone.test(userPhone.value)) {
        var xhrMobile = new XMLHttpRequest()
        xhrMobile.open('post', 'https://api.yabobkk.com/yabo-ecp/api/v1/sms/mobileStatus/register', true)
        xhrMobile.setRequestHeader('Content-type', 'application/json')
        // 還沒被註冊過的
        // var mobileData = { mobile: "66 888456789" };
        // 被註冊過的
        // var mobileData = { mobile: "66 982325484" };
        // 正式用的
        var mobileData = { mobile: '66' + userPhone.value };
        var JMobileData = JSON.stringify(mobileData);
        xhrMobile.send(JMobileData)
        xhrMobile.onload = function () {
            console.log(xhrMobile)
            console.log(xhrMobile.responseText);
            var x = JSON.parse(xhrMobile.responseText)
            if (x.code === 1) {
                // 1
                // เบอร์นี้กำลังลงทะเบียนอยู่
                // mobile verifying by another player
                console.log('เบอร์นี้กำลังลงทะเบียนอยู่')
                tip[3].innerText = 'เบอร์นี้กำลังลงทะเบียนอยู่';
                phoneNumberCanNotUse()
            } else if (x.code === 2) {
                // 2
                // เบอร์นี้ได้ลงทะเบียนแล้ว
                // mobile has been verified by another player
                console.log('เบอร์นี้ได้ลงทะเบียนแล้ว')
                tip[3].innerText = 'เบอร์นี้ได้ลงทะเบียนแล้ว';
                phoneNumberCanNotUse()
            } else if (x.code === 0) {
                console.log('frontend issue')
                tip[3].innerText = 'frontend issue';
                phoneNumberCanNotUse()
            } else {
                console.log('is fine')
                tip[3].innerText = 'is true';
                phoneNumberCanBeUse()
            }
        }
        // 非9個數字
    } else {
        console.log('請打9個數字')
    }
}

function phoneNumberCanBeUse() {
    // tip[3].innerText = 'is true';
    tip[3].style.color = 'gray';
    sendTextButton.className = "";
    // 
    console.log('true')
    phoneStatus = true;
}
function phoneNumberCanNotUse() {
    // tip[3].innerText = 'is false!';
    tip[3].style.color = 'red';
    sendTextButton.className = "disabled";
    // 
    console.log('false')
    phoneStatus = false;
}
checkPhone()



// 網頁驗證碼
var captchaUuid = 'uuid';
const captchaImg = document.querySelector("#captcha-img");
captchaImg.addEventListener("click", getCaptchaImg)
// var captchaStatus = false;
var captchaStatus = true;
function getCaptchaImg() {
    $.ajax({
        type: 'GET',
        url: 'https://api.yabobkk.com/yabo-ecp/api/v1/captchas/random',
        success: function (data) {
            // console.log(data)
            captchaUuid = data.uuid;
            captchaImg.src = data.image;
        },
        error: function () {
            alert('驗證碼傳送失敗')
        }
    })
}
// 打開網頁時先呼叫第一次
getCaptchaImg()


// 驗證uuid和使用者輸入的對不對
// 但不確定驗證方式為何?
const userCaptcha = document.querySelector("#captcha");
userCaptcha.addEventListener("blur", checkCaptcha);
function checkCaptcha() {
    if (captchaUuid == userCaptcha) {
        console.log('true')
    } else {
        console.log('false')
    }
}





const agreeCheckbox = document.querySelector('#agree');
// 表單傳送前的資料基本確認
function validateForm() {
    checkName()
    checkPassword()
    checkRePassword()
    checkPhone()
    console.log(agreeCheckbox.checked)
    // 帳號,密碼,密碼第二次輸入,手機,驗證碼,checkbox
    if (nameStatus && passwordStatus && rePasswordStatus && phoneStatus && captchaStatus && agreeCheckbox.checked === true)
        return true
    return false
}

// 傳送手機驗證碼+倒數
var intervalX, interval;
var afterSendMessage = document.querySelector('.afterSendMessage')
function sendAPI() {
    // 
    console.log('sendAPI')
    clearInterval(interval)
    intervalX = 180
    interval = window.setInterval('time10()', 10)
    sendTextButton.className = "disabled";

    var xhrSendMessage = new XMLHttpRequest()
    xhrSendMessage.open('post', 'https://api.yabobkk.com/yabo-ecp/api/v1/sms/sendVerificationCode/register', true)
    xhrSendMessage.setRequestHeader('Content-type', 'application/json')
    // 還沒被註冊過的
    var mobileData = { mobile: "66 " + userPhone.value };
    console.log(mobileData)
    // 被註冊過的
    // var mobileData = { mobile: "66 982325484" };
    console.log(mobileData)
    var JMobileData = JSON.stringify(mobileData);
    xhrSendMessage.send(JMobileData)
    xhrSendMessage.onload = function () {
        console.log(xhrSendMessage)
        console.log(xhrSendMessage.responseText)
        var xsm = JSON.parse(xhrSendMessage.responseText)
        if (xsm.code === 1) {
            // 1
            // เบอร์นี้กำลังลงทะเบียนอยู่
            // mobile verifying by another player
            console.log('เบอร์นี้กำลังลงทะเบียนอยู่')
            tip[4].innerText = 'เบอร์นี้กำลังลงทะเบียนอยู่';
        } else if (xsm.code === 2) {
            // 2
            // เบอร์นี้ได้ลงทะเบียนแล้ว
            // mobile has been verified by another player
            // console.log('เบอร์นี้ได้ลงทะเบียนแล้ว')
            // afterSendMessage.innerText = 'เบอร์นี้ได้ลงทะเบียนแล้ว';
            console.log('mobile ' + mobileData + ' has been verified')
            tip[4].innerText = 'mobile ' + mobileData + ' has been verified';
        } else if (xsm.code === 4) {
            console.log('PlayerOtpNotExpiredException')
            tip[4].innerText = 'PlayerOtpNotExpiredException';
        } else if (xsm.code === 5) {
            console.log('SmsNotFoundException')
            tip[4].innerText = 'SmsNotFoundException';
        } else if (xsm.code === 6) {
            console.log('SmsOutOfServiceException msg: SMS_CODE is out of service')
            tip[4].innerText = 'SmsOutOfServiceException msg: SMS_CODE is out of service';
        } else if (xsm.code === 7) {
            console.log('The specified mobile has already been registered')
            tip[4].innerText = 'The specified mobile has already been registered';
        } else if (xsm.code === 0) {
            console.log('frontend issue')
            tip[4].innerText = 'frontend issue';
        } else {
            console.log('is fine')
            tip[4].innerText = 'is true';
            // afterSendMessage.style.color = 'black';
        }
    }
}

// 倒數
function time10() {
    if (intervalX > 0) {
        intervalX -= 1;
        // 
        // console.log(x)
        afterSendMessage.innerText = intervalX + 'sec'
    } else if (intervalX === 0) {
        // 
        console.log('time out!')
        afterSendMessage.innerText = 'time out!'
        sendTextButton.className = "";
        clearInterval(interval)
    }
}





// function postFormData(params) {
//     var xhrPostFormData = new XMLHttpRequest()
//     xhrPostFormData.open('POST', 'https://api.yabobkk.com/yabo-ecp/api/v1/register', true)
//     xhrPostFormData.setRequestHeader('Content-type', 'multipart/form-data')
//     xhrPostFormData.onload = function name(params) {

//     }
// }





function passwordHash(playerid, password) {
    return CryptoJS.HmacSHA1(password, playerid).toString();
}

// 設定測試用的數據
var verification = document.querySelector('#Verification')
// userName.value = "player1"
userPassword.value = "Aa@666666"
// userRePassword.value = "123456";
userRePassword.value = "Aa@666666";
userPhone.value = "888888888"
userCaptcha.value = "1234"
verification.value = "000111"
var hash = passwordHash(userName.value, userPassword.value)
console.log(hash)

// 傳送form表單
// 還沒做完
function sendData() {
    var XHR = new XMLHttpRequest();

    // 我们把这个 FormData 和表单元素绑定在一起。
    var fd = new FormData();

    // 我们定义了数据成功发送时会发生的事。
    // XHR.addEventListener("load", function (event) {
    //     alert(event.target.responseText);
    // });

    // 我们定义了失败的情形下会发生的事
    // XHR.addEventListener("error", function (event) {
    //     alert('哎呀！出了一些问题。');
    // });

    // 我们设置了我们的请求
    XHR.open('POST', 'https://api.yabobkk.com/yabo-ecp/api/v1/register', true)
    XHR.setRequestHeader('Content-type', 'multipart/form-data')

    // 
    var xxx = '???'
    // var agentid = ''
    var hash = passwordHash(userName.value, userPassword.value)
    // var pin = "123456"
    var pin = "333666"
    // var zaloID = "123456"
    var portalid = "EC_MOBILE"
    var pinhash = passwordHash(userName.value, pin)
    var mobileData = "66 " + userPhone.value;
    var im1 = 'lineid'

    // const tp = {
    //     playerid: userName.value
    // }
    // Object.keys(tp).forEach(key => {
    //     fd.append(key, tp[key]);
    // });

    fd.append('playerid', userName.value)
    fd.append('portalid', portalid)
    fd.append('password', hash)
    fd.append('mobile', mobileData)
    fd.append('verificationcode', verification.value)

    fd.append('im1', im1)
    fd.append('captcha', userCaptcha.value)
    fd.append('captchauuid', captchaUuid)
    fd.append('currency', "THB")
    fd.append('firstname', userName.value)

    fd.append('regfingerprint', Fingerprint)
    // console.log(Fingerprint);
    fd.append('language', "5")
    fd.append('agentid', xxx)
    fd.append('ulagentaccount', xxx)
    fd.append('pin', pinhash)



    // 測試是否為string
    console.log('playerid is ' + typeof (userName.value));
    console.log('portalid is ' + typeof (portalid));
    console.log('password is ' + typeof (hash));
    console.log('mobile is ' + typeof (mobileData));
    console.log('verificationcode is ' + typeof (verification.value));
    console.log('-------');
    console.log('im1 is ' + typeof (im1));
    console.log('captcha is ' + typeof (userCaptcha.value));
    console.log('captchauuid is ' + typeof (captchaUuid));
    console.log('regfingerprint is ' + typeof (Fingerprint));
    console.log('Fingerprint is ' + Fingerprint);
    console.log('-------');
    console.log('agentid is ' + typeof (xxx));
    console.log('pin is ' + typeof (pinhash));
    // console.log('language'typeof ("5"));

    // 发送的数据是由用户在表单中提供的
    XHR.send(fd);
}

// 我们需要获取表单元素
var form = document.getElementById("form");

// ...然后接管表单的提交事件
form.addEventListener("submit", function (event) {
    event.preventDefault();

    sendData();
});

sendData();

