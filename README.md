預覽畫面
https://aosiww574.github.io/0419/signIn.html

還沒做完的部分為:註冊 API 的傳送 formData\
[Register API(Verify SMS)]\
我已經照文件上的上傳資料，但不知為什麼上傳總是失敗\
從 singIn.js 的 300 行開始

然後 hash 值和 pin 值可以做出跟範例一樣\
playerid: player1\
pin: 123456\
hash should be: f5ea1104ea74d5d96076b06e1f77b50a173f7692


要測試的話，請按註冊，就可以看到各種console.log\
一定要先按過一次，一開始網頁重新更新時 Fingerprint 還沒抓完資料，console.log 出來一定是 undefined
