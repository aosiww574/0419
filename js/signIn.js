const tip = document.querySelectorAll('.tip')
// 0:Player ID
// 1:Password
// 2:Confirm Password
// 3:Contact Number
// 4:SMS verification code
// 5:Captcha
tip[0].innerText = 'Please enter player id'
tip[1].innerText = 'Please must be 5~9 alphanumeric'
tip[2].innerText = 'Please re-enter your password'

// Player ID
const userName = document.querySelector('#userName')
// const regexNameCheck = /.*(?=.*\d)(?=.*[a-zA-Z]).*/
// 起碼5個字的A~z或數字0~9
const regexNameCheck = /^[a-zA-Z0-9]{5,}$/
var nameStatus = false
userName.addEventListener('blur', checkName)
function checkName() {
  // 不成立的話提出警告
  if (!regexNameCheck.test(userName.value)) {
    tip[0].innerText = 'Please must be 5~9 alphanumeric'
    tip[0].style.color = 'red'
    //
    console.log('false')
    nameStatus = false
  } else {
    tip[0].innerText = 'true'
    tip[0].style.color = 'black'
    //
    console.log('true')
    nameStatus = true
  }
}

// 密碼一
const userPassword = document.querySelector('#password')
userPassword.addEventListener('blur', checkPassword)
var passwordStatus = false
function checkPassword() {
  if (!regexNameCheck.test(userPassword.value)) {
    tip[1].innerText = 'Please must be 5~9 alphanumeric'
    tip[1].style.color = 'red'
    //
    console.log('false')
    passwordStatus = false
  } else {
    tip[1].innerText = 'true'
    tip[1].style.color = 'black'
    //
    console.log('true')
    passwordStatus = true
  }
  if (userRePassword.value !== '') {
    checkRePassword()
    //
    console.log('userRePassword')
  }
}

// 密碼二
const userRePassword = document.querySelector('#re-password')
userRePassword.addEventListener('blur', checkRePassword)
var rePasswordStatus = false
function checkRePassword() {
  if (
    userPassword.value !== userRePassword.value ||
    userRePassword.value === ''
  ) {
    tip[2].innerText =
      'Your password and Confirm Password are different please re-enter'
    tip[2].style.color = 'red'
    //
    console.log('false')
    rePasswordStatus = false
  } else {
    tip[2].innerText = 'Confirm Password is true'
    tip[2].style.color = 'black'
    //
    console.log('true')
    rePasswordStatus = true
  }
}

// Contact Number(手機號碼)
const userPhone = document.querySelector('#phone')
const sendTextButton = document.querySelector('#sendMessage')
sendTextButton.className = 'disabled'
const regexPhone = /\d{9}/
var phoneStatus = false
userPhone.addEventListener('blur', checkPhone)
function checkPhone() {
  //
  console.log(userPhone.value)
  // 是否為9個數字
  if (regexPhone.test(userPhone.value)) {
    var xhrMobile = new XMLHttpRequest()
    xhrMobile.open(
      'post',
      'https://api.yabobkk.com/yabo-ecp/api/v1/sms/mobileStatus/register',
      true
    )
    xhrMobile.setRequestHeader('Content-type', 'application/json')
    // 還沒被註冊過的
    // var mobileData = { mobile: "66 888456789" };
    // 被註冊過的
    // var mobileData = { mobile: "66 982325484" };
    // 正式用的
    var mobileData = { mobile: '66' + userPhone.value }
    var JMobileData = JSON.stringify(mobileData)
    xhrMobile.send(JMobileData)
    xhrMobile.onload = function () {
      console.log(xhrMobile)
      console.log(xhrMobile.responseText)
      var x = JSON.parse(xhrMobile.responseText)
      if (x.code === 1) {
        // 1
        // เบอร์นี้กำลังลงทะเบียนอยู่
        // mobile verifying by another player
        tip[3].innerText = 'เบอร์นี้กำลังลงทะเบียนอยู่'
        phoneNumberCanNotUse()
      } else if (x.code === 2) {
        // 2
        // เบอร์นี้ได้ลงทะเบียนแล้ว
        // mobile has been verified by another player
        tip[3].innerText = 'เบอร์นี้ได้ลงทะเบียนแล้ว'
        phoneNumberCanNotUse()
      } else if (x.code === 0) {
        tip[3].innerText = 'frontend issue'
        phoneNumberCanNotUse()
      } else {
        tip[3].innerText = 'this phone number can be use'
        phoneNumberCanBeUse()
      }
    }
    // 非9個數字
  } else {
    tip[3].innerText = '請輸入不含0的9碼手機號碼'
  }
}

function phoneNumberCanBeUse() {
  tip[3].style.color = 'gray'
  sendTextButton.className = ''
  //
  console.log('true')
  phoneStatus = true
}
function phoneNumberCanNotUse() {
  tip[3].style.color = 'red'
  sendTextButton.className = 'disabled'
  //
  console.log('false')
  phoneStatus = false
}
// 網頁一開先執行一次
checkPhone()

// 網頁驗證碼
var captchaUuid = 'uuid'
const captchaImg = document.querySelector('#captcha-img')
captchaImg.addEventListener('click', getCaptchaImg)
// 換 captcha 圖片
function getCaptchaImg() {
  $.ajax({
    type: 'GET',
    url: 'https://api.yabobkk.com/yabo-ecp/api/v1/captchas/random',
    success: function (data) {
      captchaUuid = data.uuid
      captchaImg.src = data.image
    },
    error: function () {
      alert('驗證碼傳送失敗')
    },
  })
}
// 打開網頁時先呼叫第一次
getCaptchaImg()

// 驗證碼captcha
const userCaptcha = document.querySelector('#captcha')
const agreeCheckbox = document.querySelector('#agree')

// 表單傳送前的資料基本確認
function validateForm() {
  checkName()
  checkPassword()
  checkRePassword()
  checkPhone()
  // 帳號,密碼,密碼第二次輸入,手機,checkbox
  if (
    nameStatus &&
    passwordStatus &&
    rePasswordStatus &&
    phoneStatus &&
    agreeCheckbox.checked === true
  )
    return true
  return false
}

// 傳送手機驗證碼+倒數
var intervalX, interval
var afterSendMessage = document.querySelector('.afterSendMessage')

window.sendAPI = function () {
  // function sendAPI() {
  //
  console.log('sendAPI')
  clearInterval(interval)
  intervalX = 180
  interval = window.setInterval('time180()', 1000)
  sendTextButton.className = 'disabled'

  var xhrSendMessage = new XMLHttpRequest()
  xhrSendMessage.open(
    'post',
    'https://api.yabobkk.com/yabo-ecp/api/v1/sms/sendVerificationCode/register',
    true
  )
  xhrSendMessage.setRequestHeader('Content-type', 'application/json')
  // 還沒被註冊過的
  var mobileData = { mobile: '66 ' + userPhone.value }
  console.log(mobileData)
  // 被註冊過的
  // var mobileData = { mobile: "66 982325484" };
  console.log(mobileData)
  var JMobileData = JSON.stringify(mobileData)
  xhrSendMessage.send(JMobileData)
  xhrSendMessage.onload = function () {
    console.log(xhrSendMessage)
    console.log(xhrSendMessage.responseText)
    var xsm = JSON.parse(xhrSendMessage.responseText)
    if (xsm.code === 1) {
      // 1
      // เบอร์นี้กำลังลงทะเบียนอยู่
      // mobile verifying by another player
      tip[4].innerText = 'เบอร์นี้กำลังลงทะเบียนอยู่'
    } else if (xsm.code === 2) {
      // 2
      // เบอร์นี้ได้ลงทะเบียนแล้ว
      // mobile has been verified by another player
      // afterSendMessage.innerText = 'เบอร์นี้ได้ลงทะเบียนแล้ว';
      console.log('mobile ' + mobileData + ' has been verified')
      tip[4].innerText = 'mobile ' + mobileData + ' has been verified'
    } else if (xsm.code === 4) {
      console.log('PlayerOtpNotExpiredException')
      tip[4].innerText = 'PlayerOtpNotExpiredException'
    } else if (xsm.code === 5) {
      console.log('SmsNotFoundException')
      tip[4].innerText = 'SmsNotFoundException'
    } else if (xsm.code === 6) {
      console.log('SmsOutOfServiceException msg: SMS_CODE is out of service')
      tip[4].innerText =
        'SmsOutOfServiceException msg: SMS_CODE is out of service'
    } else if (xsm.code === 7) {
      console.log('The specified mobile has already been registered')
      tip[4].innerText = 'The specified mobile has already been registered'
    } else if (xsm.code === 0) {
      console.log('frontend issue')
      tip[4].innerText = 'frontend issue'
    } else {
      console.log('SMS verification code is send!')
      tip[4].innerText = 'SMS verification code is send!'
      // afterSendMessage.style.color = 'black';
    }
  }
}


// 倒數
window.time180 = function () {
  if (intervalX > 0) {
    intervalX -= 1
    afterSendMessage.innerText = intervalX + 'sec'
    sendTextButton.className = 'disabled'
  } else if (intervalX === 0) {
    afterSendMessage.innerText = 'time out!'
    sendTextButton.className = ''
    clearInterval(interval)
  }
}


function passwordHash(playerid, password) {
  return CryptoJS.HmacSHA1(password, playerid).toString()
}

// 設定測試用的數據
var verification = document.querySelector('#Verification')
// userName.value = 'player1'
userPassword.value = '123456'
userRePassword.value = '123456'
userPhone.value = '888888888'
verification.value = '000111'
var hash = passwordHash(userName.value, userPassword.value)
console.log(hash)
// userPassword.value = "Aa@666666"
// userRePassword.value = "Aa@666666";
// userCaptcha.value = "1234"

// 傳送form表單
function sendData() {
  var XHR = new XMLHttpRequest()
  XHR.open('POST', 'https://api.yabobkk.com/yabo-ecp/api/v1/register', true)

  var fd = new FormData()

  var ulagentaccount = 'hunz01'
  var xxx = ''
  var hash = passwordHash(userName.value, userPassword.value)
  var portalid = 'EC_MOBILE'
  var mobileData = '66 ' + userPhone.value
  //   var im1 = 'lineid'
  //   var ulagentaccoun = ''
  //   var pin = '123456'
  // var pin = "333666"
  // var zaloID = "123456"
  //   var pinhash = passwordHash(userName.value, pin)

  fd.append('playerid', userName.value)
  fd.append('portalid', portalid)
  fd.append('password', hash)
  fd.append('mobile', mobileData)
  fd.append('verificationcode', verification.value)

  fd.append('captcha', userCaptcha.value)
  fd.append('captchauuid', captchaUuid)
  fd.append('currency', 'THB')
  fd.append('regfingerprint', Fingerprint)
  fd.append('language', '5')
  fd.append('ulagentaccount', ulagentaccount)

  // console.log(Fingerprint);
  // 不用提交的
  // fd.append('im1', im1)
  // fd.append('firstname', userName.value)
  // fd.append('agentid', xxx)
  // fd.append('pin', pinhash)

  // 測試是否為string
  console.log('playerid is ' + typeof userName.value)
  console.log('portalid is ' + typeof portalid)
  console.log('password is ' + typeof hash)
  console.log('mobile is ' + typeof mobileData)
  console.log('verificationcode is ' + typeof verification.value)
  console.log('-------')
  console.log('captcha is ' + typeof userCaptcha.value)
  console.log('captchauuid is ' + typeof captchaUuid)
  console.log('regfingerprint is ' + typeof Fingerprint)
  console.log('Fingerprint is ' + Fingerprint)
  console.log('ulagentaccount is ' + typeof xxx)
  console.log('ulagentaccount is ' + ulagentaccount)
  console.log('-------')
  //   不用提交的
  //   console.log('im1 is ' + typeof im1)
  //   console.log('agentid is ' + typeof xxx)
  //   console.log('pin is ' + typeof pinhash)
  // console.log('language'typeof ("5"));

  // 发送的数据是由用户在表单中提供的
  XHR.send(fd)
}

// 我们需要获取表单元素
var form = document.getElementById('form')

// ...然后接管表单的提交事件
form.addEventListener('submit', function (event) {
  event.preventDefault()
  if(validateForm){
    sendData()
  }
})

// sendData()
