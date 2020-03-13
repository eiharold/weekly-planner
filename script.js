const lists = document.querySelectorAll('ul');
let itens = document.querySelectorAll('li');
const btns = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
let deletes = document.querySelectorAll('.delete');
const year = document.querySelector('#year');
const clearbtn = document.querySelectorAll('h2 span');

let calendar = new Date();
year.innerHTML = calendar.getFullYear();

// let lista = localStorage.getItem('list') || "";
// let backupList = [];
// let listasSalvas = backup(lista);

// lists.forEach( (item, index) => {
//     item.innerHTML = listasSalvas[index];
// });



let tempDay;
let tempInput;

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

// function attLists() {
//     lista = "";
//     lists = document.querySelectorAll('ul');
//     lists.forEach((item) => {
//        lista += item.innerHTML;
//     });
//     localStorage.setItem('list', lista);
// }

// attLists();

// function backup(data) {
//     backupList = data.split("li>\n");
//     backupList.forEach( (item, index, array) => {
//         if (index !== array.length - 1) {
//             item += "li>";
//         }
//         array.pop(); 
//     });
//     return backupList;
// }
