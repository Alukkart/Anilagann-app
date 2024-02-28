'use strict';

const email = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const uname = /^[a-zA-Z](.[a-zA-Z0-9]*)[^\s(),.?=!@#$%^_&*ㅤ-]*$/;
const pass  = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{0,32}^[^\s(),.?=!@#$%^_&*ㅤ-]*$/


var password  = document.getElementById('InpPassword')
var password2 = document.getElementById('InpPassword2')
var Uname     = document.getElementById('InpUname')
var Email     = document.getElementById('InpEmail')
var check     = document.getElementById('flexSwitchCheckDefault')

// async function SubmitPass() {
//     if(pass.test(password.value) && (password.value == password2.value) && password.value.length >= 5 && password.value.length <= 33){
//         let res = await fetch('/account/passchangeforce', {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 newPass: password.value
//             })
//           });
//         try{
//             res = await res.json()
//             if(res == true){
//                 document.getElementById('CoincAlert').innerHTML = `
//                 <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
//                     Пароль успешно изменён.
//                 </div>`
//                 document.getElementById('PassModalBtns').innerHTML = `
//                 <a type="button" class="btn btn-danger" href='/'">Ok</a>`
//             }
//         }catch{}
// }}

async function SubmitPass() {
    let res = await fetch('/account/profile/passchange', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            newPass: password.value
        })
        });
    try{
        res = await res.json()
        if(res == true){
            document.getElementById('forms').remove()
            document.getElementById('finalyAlert').innerHTML = `
            <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
                На вашу новую почту было отправленно сообщение для подтверждения.
            </div>`
            document.getElementById('PassModalBtns').innerHTML = `
            <button type="button" class="btn btn-secondary btn-p" data-bs-dismiss="modal">Ок</button>`
        }
    }catch{}
}

async function SubmitEmail() {
    if(email.test(Email.value)){
        let res = await fetch('/account/emailChange', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newEmail: Email.value
            })
          });
        try{
            res = await res.json()
            if(res != false){
                document.getElementById('EmailAlert').innerHTML = `
                <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
                    На вашу новую почту было отправленно сообщение для подтверждения.
                </div>`
            }else{
                document.getElementById('EmailAlert').innerHTML = `
                <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
                    Адрес почты занят.
                </div>`
            }
        }catch{}
}}

async function SubmitUname() {
    if(uname.test(Uname.value) && Uname.value.length > 6 && Uname.value.length< 32){
        let res = await fetch('/account/unameChange', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newUname: Uname.value
            })
          });
        try{
            res = await res.json()
            if(res == true){
                document.location.reload()
            }else{
                document.getElementById('UnameAlert').innerHTML = `
                <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
                    Имя пользователя занято.
                </div>`
            }
        }catch{}
}}

function passview() {
    var pass = password
    var pass2 = password2
    if(check.checked == true){
        pass.setAttribute('type', 'text')
        pass2.setAttribute('type', 'text')
    }
    if(check.checked == false){
        pass.setAttribute('type', 'password')
        pass2.setAttribute('type', 'password')
    }
}

function UsernameCheck(){
    if(uname.test(Uname.value) == false && Uname.value.length != 0 || Uname.value.length < 6 || Uname.value.length > 32){
        document.getElementById('UnameAlert').innerHTML = `
        <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
            Требования к имени пользователя:
            Длинна от 6 до 32 символов.
            Должно начинаться с буквы([a-z][A-Z]).
            Не допускаются спец символы.
        </div>`
        
    }else{document.getElementById('UnameAlert').innerHTML = ''}
}


function PassCheck(){
    if(password.value.length != 0){
        if(pass.test(password.value) == false || 5 >= password.value.length == true || password.value.length >= 33 == true){
            document.getElementById('PassAlert').innerHTML = `
            <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
                Требования к паролю:
                Длинна от 6 символов
                Должен содержать буквы верхнего и нижнего регистра
            </div>`
        }else{document.getElementById('PassAlert').innerHTML = ''}
    }else{document.getElementById('PassAlert').innerHTML = ''}
}

function PassIdCheck(){
    if(password.value == password2.value == false && password.value.length != 0){
        document.getElementById('CoincAlert').innerHTML = `
        <div class="alert alert-primary d-flex align-items-center m-2" role="alert">
            Пароли должны совпадать.
        </div>`
    }else{document.getElementById('CoincAlert').innerHTML = ''}
}

document.getElementById('InpUname').addEventListener('input', UsernameCheck);
document.getElementById('InpPassword').addEventListener('input', PassCheck);
document.getElementById('InpPassword2').addEventListener('input', PassIdCheck);