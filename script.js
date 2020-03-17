//INITIAL CONFIGS

//CONFIG AND ACTIVATING MAIN FUNCTION

const insertLists = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'notes', 'month'];
generateLists(insertLists);

//GLOBAL VARS

const lists = document.querySelectorAll('ul');
const inputs = document.querySelectorAll('input');
const btns = document.querySelectorAll('button');
const clearbtn = document.querySelectorAll('.clear');
const darkbtn = document.querySelector('#dark');
let itens = document.querySelectorAll('li');
let idItem = 0;
let storagedItens = ['', '', '', '', '', '', '', '', ''];
let darkModeCheck = false;

//ACTIVATING ALL STARTER FUNCTIONS


function startPlanner() {
    
    getDate();
    adjustScroll();
    activeCheck();
    activeBtn();
    activeDelete();
    moveItem();
    activeClearList();
    //if (darkModeCheck) { darkMode() };
    for (i = 0; i < insertLists.length; i++) {
        progressBar(insertLists[i]);
    }
}

startPlanner();

if (localStorage.getItem('idCount')) {
    getStorageList();
}

//FUNCTIONS

//Main function - HTML Constructor

function generateLists(arrayListNames) {
    const main = document.querySelector('.main');
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
                <input type="text" name="input" autocomplete="off" data-day="${arrayListNames[i]}" placeholder="Add your To do...">
                <button type="submit" data-day="${arrayListNames[i]}"><i class="fas fa-plus"></i></button>
            </form>
            </div>`;
    }
}

//getDate Function: capture and display the month and year

function getDate() {
    let calendar = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = document.querySelector('#year');
    year.innerHTML = monthNames[calendar.getMonth()] + " &nbsp;&bull;&nbsp; " + calendar.getFullYear();
}

//adjustScroll Function: limit the overflow-y lists with scroll

function adjustScroll() {
    const daysHeight = document.querySelector('#monday').clientHeight - 110;
    const monthHeight = document.querySelector('#month').clientHeight - 105;

    if (window.innerWidth >= 600) {
        lists.forEach((list) => {
            if (list.dataset['day'] == 'month') {
                list.style.maxHeight = monthHeight + "px";
            } else {
                list.style.maxHeight = daysHeight + "px";
            }
        });
    }
}

//addTodo Function: insert a item to the respective list and active other functions to renew infos

function addTodo(day, todo, active = false) {

    let startContent = `
    <span contenteditable="true">${todo}</span>
    <span class="itemicons">`;
    let backContent = `
        <a class="back" contenteditable="false" href="#"><i class="fas fa-chevron-left"></i></a>`;
    let moveContent = `
        <a class="move" contenteditable="false" href="#"><i class="fas fa-chevron-right"></i></a>`;
    let endContent = `
        <a class="delete" contenteditable="false" href="#"><i class="fas fa-trash-alt"></i></a>
        </span>`;

    if (todo != undefined) {
        lists.forEach((list, index) => {
            if (list.dataset['day'] === day) {
                let newItem = document.createElement('li');
                newItem.classList.add('item');
                newItem.setAttribute("data-day", day);
                if (darkModeCheck) { newItem.classList.add('darkmode') };
                if (day == insertLists[0]) {
                    newItem.innerHTML = startContent + moveContent + endContent;
                    let cornerAdjustments = newItem.querySelector('.move');
                    cornerAdjustments.style.borderRadius = "8px 0 0 8px";
                } else if (day == insertLists[8]) {
                    newItem.innerHTML = startContent + backContent + endContent;
                } else {
                    newItem.innerHTML = startContent + backContent + moveContent + endContent;
                }
                if (active) { newItem.classList.add('checked'); };
                newItem.setAttribute('data-id', idItem);
                idItem++;
                list.appendChild(newItem);
                activeDelete();
                moveItem();
                activeCheck();
                progressBar(day);
                setStorageList();
            }
        });
    }
}

//activeCheck Function: add the class .checked to a clicked item

function activeCheck() {
    itens = document.querySelectorAll('li');
    Array.from(itens).forEach((item) => {
        item.addEventListener('click', handleCheck);
    });
}

//activeCheck callback

function handleCheck(e) {
    this.classList.toggle('checked');
    progressBar(this.dataset['day']);
    setStorageList();
}

//activeBtn Function: insert the input item at the respective list with click and active other functions to renew infos

function activeBtn() {
    Array.from(btns).forEach((btn) => {
        btn.addEventListener('click', handleBtn);
    });
}

//activeBtn callback

function handleBtn(e) {
    e.preventDefault();
    let tempDay = this.dataset['day'];
    let tempInput;
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

//activeDelete Function: add the functionallity to remove itens from lists

function activeDelete() {
    let deletes = document.querySelectorAll('.delete');
    Array.from(deletes).forEach((del) => {
        del.addEventListener('click', handleDel);
    });
}

//activeDelete callback

function handleDel(e) {
    e.preventDefault();
    this.parentElement.parentElement.remove();
    activeCheck();
}

//moveItem Function: add the functionallity to move to back and foward itens through lists

function moveItem() {
    let moves = document.querySelectorAll('.move');
    let backs = document.querySelectorAll('.back');
    moves.forEach((move) => {
        move.addEventListener('click', handleMove);
    });
    backs.forEach((back) => {
        back.addEventListener('click', handleMove);
    });
}

//moveItem callback

function handleMove(e) {
    e.preventDefault();
    let typeDay; //0 for back and 1 for foward

    if (this.classList.contains('move')) {
        typeDay = 1;
    } else if (this.classList.contains('back')) {
        typeday = 0;
    }

    let tempItem = this.parentElement.parentElement;
    let tempContent = tempItem.querySelector('span');
    let tempTodo = tempContent.innerText;
    let tempDay = this.parentElement.parentElement.dataset['day'];
    let isChecked = false;
    let nextDay, prevDay;

    if (tempItem.classList.contains('checked')) { isChecked = true; };

    insertLists.forEach((name, index) => {
        if (tempDay == name) {
            nextDay = insertLists[index + 1];
            prevDay = insertLists[index - 1];
        }
    });

    function removeTempItem() {
        itens.forEach((item) => {
            if (item.dataset['id'] == tempItem.dataset['id']) { item.remove(); }
        });
    }

    function addNewItem(day) {
        if (day != undefined && day) {
            removeTempItem();
            lists.forEach((list) => {
                if (list.dataset['day'] == day) {
                    isChecked ? addTodo(day, tempTodo, true) : addTodo(day, tempTodo);
                }
            });
            progressBar(tempDay);
        }
    }

    if (typeDay) {
        addNewItem(nextDay);
    } else {
        addNewItem(prevDay);
    }
}

//activeClearList Function: add the functionality to clear a list to the respective button

function activeClearList() {
    clearbtn.forEach((btn) => {
        btn.addEventListener('click', handleClear);
    });
}

//activeClearList callback

function handleClear(e) {
    let dataTemp = this.dataset['day'];
    itens.forEach((item) => {
        if (dataTemp === item.dataset['day']) {
            item.remove();
            activeCheck();
        }
        progressBar(dataTemp);
        setStorageList();
    });

}

//progressBar Function: control the progress bar of each list

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

//darkMode Function: add the class .darkmode to some itens of the HTML, changing the appearance

darkbtn.addEventListener('click', darkMode);

function darkMode() {
    
    if(localStorage.getItem('dark') != null && localStorage.getItem('dark') != undefined) {
        darkModeCheck = localStorage.getItem('dark');
    }

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
    localStorage.setItem('dark', darkModeCheck);
}

//storageList function: method that use LocalStorage to save lists in cache

function setStorageList(arrayItens = itens) {

    storagedItens = ['', '', '', '', '', '', '', '', ''];
    let newId = 0;
    insertLists.forEach((listName, i) => {
        arrayItens.forEach((item) => {
            let dataDay = item.dataset['day'];
            let checkedItem = (item.classList.contains('checked')) ? 'checked' : '';
            let content = item.innerHTML;

            if (listName == item.dataset['day']) {
                storagedItens[i] += `<li class="item ${checkedItem}" data-day="${dataDay}" data-id="${newId}"> ${content} </li>`;
                newId++;
                idItem++;
            }
        });
    });

    for (i = 0; i < insertLists.length; i++) {
        localStorage.setItem('todos' + [i], storagedItens[i]);
    }

    localStorage.setItem('idCount', idItem);
    localStorage.setItem('dark', darkModeCheck);

}

function getStorageList(arrayItens = storagedItens) {

    for (i = 0; i < lists.length; i++) {
        lists[i].innerHTML = '';
        arrayItens[i] = localStorage.getItem('todos' + i);
    }

    insertLists.forEach((listName, i) => {
        lists[i].innerHTML += arrayItens[i];
    });

    idItem = localStorage.getItem('idCount');
    startPlanner();
}
