const main = document.querySelector('.main');

function generateLists(arrayListNames) {
    for (i = 0; i < arrayListNames.length; i++) {
        main.innerHTML += `<div class="wrap" id="${arrayListNames[i]}">
            <div class="content">
                <h2>${arrayListNames[i]}<span class="clear" contenteditable="false" data-day="${arrayListNames[i]}">Clear</span></h2>
                <ul class="list" data-day="${arrayListNames[i]}">
                </ul>
            </div>
            <form action="todo" data-day="${arrayListNames[i]}">
                <input type="text" name="input" data-day="${arrayListNames[i]}" placeholder="Add your To do...">
                <button type="submit" data-day="${arrayListNames[i]}">+</button>
            </form>
            </div>`;
    }
}
generateLists(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'notes', 'month']);

const lists = document.querySelectorAll('ul');
let itens = document.querySelectorAll('li');
const btns = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
let deletes = document.querySelectorAll('.delete');
const year = document.querySelector('#year');
const clearbtn = document.querySelectorAll('.clear');
const darkbtn = document.querySelector('#dark');

let calendar = new Date();
year.innerHTML = calendar.getFullYear();

let tempDay;
let tempInput;
let darkModeCheck = false;


function activeCheck() {
    itens = document.querySelectorAll('li');
    Array.from(itens).forEach((item) => {
        item.addEventListener('click', check);
    });
}

function check(e) {
    this.classList.toggle('checked');
}

activeCheck();


function activeBtn() {
    Array.from(btns).forEach((btn) => {
        btn.addEventListener('click', handleBtn);
    });
}

activeBtn();

function handleBtn(e) {
    e.preventDefault();
    tempDay = this.dataset['day'];
    inputs.forEach((item) => {
        if (item.dataset['day'] === tempDay) {
            tempInput = item.value;
            item.value = "";
        }
    });
    if (tempInput != "") {
        addTodo(tempDay, tempInput);
    }
}


function addTodo(day, todo) {

    if (todo != undefined) {
        lists.forEach((list, index) => {
            if (list.dataset['day'] === day) {
                let newItem = document.createElement('li');
                newItem.classList.add('item');
                if (darkModeCheck) { newItem.classList.add('darkmode') }
                newItem.innerHTML = `<span contenteditable="true">${todo}</span><a class="delete" contenteditable="false" href="#">Delete</a>`;
                list.appendChild(newItem);
                activeDelete();
                activeCheck();
                // attLists();
                // backup(lista);
            }
        });
    }
}

function activeDelete() {
    deletes = document.querySelectorAll('.delete');
    Array.from(deletes).forEach((del) => {
        del.addEventListener('click', handleDel);
    });
}
activeDelete();

function handleDel(e) {
    e.preventDefault();
    this.parentElement.remove();
}


function activeClearList() {
    clearbtn.forEach((btn) => {
        btn.addEventListener('click', handleClear);
    });
}
activeClearList();

function handleClear(e) {
    let dataTemp = this.dataset['day'];
    lists.forEach((list) => {
        if (dataTemp === list.dataset['day']) {
            list.innerHTML = "";
        }
    })
}

darkbtn.addEventListener('click', darkMode);

function darkMode() {

    darkbtn.classList.toggle('darkmode-active');
    let body = document.querySelector('body');
    let containerTitle = document.querySelector('.container-title');
    let wrap = document.querySelectorAll('.wrap');
    let linkCredits = document.querySelector('.container-credits a');
    let valueDarkBtn = darkbtn.classList.value;

    if (valueDarkBtn == 'darkmode-active') {
        darkbtn.innerHTML = "Light Mode";
        darkModeCheck = true;
    } else {
        darkbtn.innerHTML = "Dark Mode";
        darkModeCheck = false;
    }

    function addDark(elements) {
        elements.forEach((element) => {
            console.log(element.length);
            if (element.length && element.length != 0) {
                element.forEach((item) => {
                    item.classList.toggle('darkmode');
                });
            } else if (element.length == 0) {
                return;
            } else {
                element.classList.toggle('darkmode');
            }
        });
    }

    addDark([body, containerTitle, wrap, itens, inputs, btns, clearbtn, linkCredits, darkbtn]);

}