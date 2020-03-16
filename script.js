const main = document.querySelector('.main');
const insertLists = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'notes', 'month'];

function generateLists(arrayListNames) {
    for (i = 0; i < arrayListNames.length; i++) {
        main.innerHTML += `<div class="wrap" id="${arrayListNames[i]}">
            <div class="content">
                <h2>${arrayListNames[i]}<span class="clear" contenteditable="false" data-day="${arrayListNames[i]}">Clear</span></h2>
                <div class="wrapbar">
                    <div class="progressbar" data-day="${arrayListNames[i]}"></div>
                </div>
                <ul class="list" data-day="${arrayListNames[i]}">
                </ul>
            </div>
            <form action="todo" data-day="${arrayListNames[i]}">
                <input type="text" name="input" data-day="${arrayListNames[i]}" placeholder="Add your To do...">
                <button type="submit" data-day="${arrayListNames[i]}"><i class="fas fa-plus"></i></button>
            </form>
            </div>`;
    }
}
generateLists(insertLists);

const lists = document.querySelectorAll('ul');
let itens = document.querySelectorAll('li');
const btns = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
let deletes = document.querySelectorAll('.delete');
let moves = document.querySelectorAll('.move');
const year = document.querySelector('#year');
const clearbtn = document.querySelectorAll('.clear');
const darkbtn = document.querySelector('#dark');

let calendar = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
year.innerHTML = monthNames[calendar.getMonth()] + " &nbsp;&bull;&nbsp; " + calendar.getFullYear();

let tempDay;
let tempInput;
let darkModeCheck = false;

function adjustScroll() {
    const daysHeight = document.querySelector('#monday').clientHeight - 110;
    const monthHeight = document.querySelector('#month').clientHeight - 105;
    console.log(monthHeight);
    lists.forEach((list) => {
        if (list.dataset['day'] == 'month') {
            list.style.maxHeight = monthHeight + "px";
        } else {
            list.style.maxHeight = daysHeight + "px";
        }
    });
}
adjustScroll();

function activeCheck() {
    itens = document.querySelectorAll('li');
    Array.from(itens).forEach((item) => {
        item.addEventListener('click', check);
    });
}

function check(e) {
    this.classList.toggle('checked');
    progressBar(this.dataset['day']);
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
                newItem.setAttribute("data-day", day);
                if (darkModeCheck) { newItem.classList.add('darkmode') }
                newItem.innerHTML = `
                <span contenteditable="true">${todo}</span>
                <span class="itemicons">
                    <a class="back" contenteditable="false" href="#"><i class="fas fa-chevron-left"></i></a>
                    <a class="move" contenteditable="false" href="#"><i class="fas fa-chevron-right"></i></a>
                    <a class="delete" contenteditable="false" href="#"><i class="fas fa-trash-alt"></i></a>
                </span>`;
                list.appendChild(newItem);
                activeDelete();
                moveItem();
                backItem();
                activeCheck();
                progressBar(day);
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
    this.parentElement.parentElement.remove();
    activeCheck();
}


function moveItem() {
    moves = document.querySelectorAll('.move');
    moves.forEach((move) => {
        move.addEventListener('click', handleMove);
    });
}
moveItem();

function handleMove(e) {
    e.preventDefault();
    let tempItem = this.parentElement.parentElement;
    let tempContent = tempItem.querySelector('span');
    let tempTodo = tempContent.innerText;
    let tempDay = this.parentElement.parentElement.dataset['day'];
    let nextDay;
    let okay = true;
    insertLists.forEach((name, index) => {
        if (tempDay == name)
            nextDay = insertLists[index + 1];
    });
    if (nextDay != undefined) {
        itens.forEach((item) => {
            let itemContent = item.querySelector('span').innerText;
            if (item.dataset['day'] == tempDay && itemContent == tempTodo && okay) {
                item.remove();
                okay = false;
            }
        });
        lists.forEach((list) => {
            if (list.dataset['day'] == nextDay) {
                addTodo(nextDay, tempTodo);
            }
        });
        progressBar(tempDay);
    }
}


function backItem() {
    moves = document.querySelectorAll('.back');
    moves.forEach((move) => {
        move.addEventListener('click', handleBack);
    });
}
backItem();

function handleBack(e) {
    e.preventDefault();
    let tempItem = this.parentElement.parentElement;
    let tempContent = tempItem.querySelector('span');
    let tempTodo = tempContent.innerText;
    let tempDay = this.parentElement.parentElement.dataset['day'];
    let beforeDay;
    let okay = true;
    insertLists.forEach((name, index) => {
        if (tempDay == name)
            beforeDay = insertLists[index - 1];
    });
    if (beforeDay != undefined) {
        itens.forEach((item) => {
            let itemContent = item.querySelector('span').innerText;
            if (item.dataset['day'] == tempDay && itemContent == tempTodo && okay) {
                item.remove();
                okay = false;
            }
        });
        lists.forEach((list) => {
            if (list.dataset['day'] == beforeDay) {
                addTodo(beforeDay, tempTodo);
            }
        });
        progressBar(tempDay);
    }
}


function activeClearList() {
    clearbtn.forEach((btn) => {
        btn.addEventListener('click', handleClear);
    });
}
activeClearList();

function handleClear(e) {
    let dataTemp = this.dataset['day'];
    itens.forEach((item) => {
        if (dataTemp === item.dataset['day']) {
            item.remove();
            activeCheck();
        }
        progressBar(dataTemp);
    });

}


function progressBar(day) {
    let progressbar = document.querySelectorAll('.progressbar');
    let totalItens = 0;
    let checkedItens = 0;

    itens.forEach((item) => {
        if (item.dataset['day'] == day) {
            totalItens++;
        }
        if (item.dataset['day'] == day && item.classList.contains('checked')) {
            checkedItens++;
        }
    });

    let progress = (checkedItens / totalItens) * 100;

    progressbar.forEach((bar) => {
        if (bar.dataset['day'] == day) {
            if (totalItens !== 0) {
                bar.style.width = `${progress}%`;
            } else {
                bar.style.width = "0%";
            }
        }
    });
}

darkbtn.addEventListener('click', darkMode);

function darkMode() {

    darkbtn.classList.toggle('darkmode-active');
    let body = document.querySelector('body');
    let containerTitle = document.querySelector('.container-title');
    let wrap = document.querySelectorAll('.wrap');
    let linkCredits = document.querySelector('.container-credits a');
    let valueDarkBtn = darkbtn.classList.value;
    let wrapbar = document.querySelectorAll('.wrapbar');

    if (valueDarkBtn == 'darkmode-active') {
        darkbtn.innerHTML = '<i class="fas fa-lightbulb"></i> Light Mode';
        darkModeCheck = true;
    } else {
        darkbtn.innerHTML = '<i class="far fa-lightbulb"></i> Dark Mode';
        darkModeCheck = false;
    }

    function addDark(elements) {
        elements.forEach((element) => {
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

    addDark([body, containerTitle, wrap, itens, inputs, btns, clearbtn, linkCredits, darkbtn, wrapbar]);

}