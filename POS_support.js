/************ 필요한 기능들 ***********

* 메뉴를 누르면 옆에 리스트에 추가가 되어야 함
* 수량에 +- 버튼이 있고, 그 버튼을 누르면 수량과 가격이 변해야 함
* 하단에 결제해야할 총 금액이 표시되어야 함
* 결제버튼을 누르면 팝업창으로 '결제되었습니다'라는 알림창을 띄워보자
*/

var event_btn_menu = document.querySelectorAll(".btn_menu");

//(!!! 변경되면 안됨 !!!) 각 메뉴의 단가를 모아놓은 Object  
const price = {
    btn_1: 6000,  //떡볶이
    btn_2: 3000,  //튀김
    btn_3: 4000,  //순대
    btn_4: 2000,  //어묵
    btn_5: 3500,  //김밥
    btn_6: 5500   //볶음밥
}

//선택한 메뉴의 수량, 가격이 반영되는 Object
var selectedItem = {
   btn_1 : {name: '떡볶이', amount: 0, price: 0}, //떡볶이
   btn_2 : {name: '튀김', amount: 0, price: 0}, //튀김
   btn_3 : {name: '순대', amount: 0, price: 0}, //순대
   btn_4 : {name: '어묵', amount: 0, price: 0}, //어묵
   btn_5 : {name: '김밥', amount: 0, price: 0}, //김밥
   btn_6 : {name: '볶음밥', amount: 0, price: 0}, //볶음밥
}

//선택한 메뉴를 #box-list 에 li 태그로 추가하는 함수
function pushItem(el){
    var selectedElement = el.target;

    for (var i=1; i<=6; i+=1) {
        //선택한 Element의 className이 menuimg일 경우(버튼이 아닌 떡볶이/순대 등 이미지를 선택할 수 있으므로),
        //선택한 Element의 id가 btn_1 ~ btn_6 사이일 경우 li태그로 주문한 메뉴로 표시하기
        if (selectedElement.className === "menuimg") {
            if (selectedElement.parentElement.id === ("btn_"+i)) {
                takingOrder(i);
                li_append(i);
            }   
        } else if (selectedElement.id === ("btn_"+i)) {
            takingOrder(i);
            li_append(i);
        }
    }
    totalAmount()    
}

//selectedItem Object에 수량, 가격을 계산해서 넣어주는 함수
function takingOrder(i){
    var btn_Num = "btn_"+i
    selectedItem[btn_Num].amount += 1;
    selectedItem[btn_Num].price = (selectedItem[btn_Num].amount) * (price[btn_Num]);
}

//<li> 태그를 만들어서 <ul> 밑에 추가하는 함수
function li_append(i){
    
    //버튼눌럿을때 같은 id값이 있으면 실행안됨
    // for(let i = 0; i<document.getElementById('box-list').children[0].children.length; i++){
    //     if(document.getElementById('box-list').children[0].children[i].id !== array[0].name){
    //     } else {
    //         return;
    //     }
    // }
    var btn_Num = "btn_"+i
    var parentElement = document.querySelectorAll("ul")[1];
    var alreadyOrdered = (document.getElementById(btn_Num+"_ordered")!==null)

    var li = document.createElement('li');
    var plusBtn = document.createElement('button'); // + 버튼 : 수량을 증가시킴
    var minusBtn = document.createElement('button'); // - 버튼 : 수량을 감소시킴
    var deleteBtn = document.createElement('button'); // 삭제버튼
    var nameSpan = document.createElement('span'); // 메뉴명(떡볶이 등)
    var amountSpan = document.createElement('span'); // 주문수량
    var priceSpan = document.createElement('span'); // 주문수량*단가

    if (!alreadyOrdered) {
    //해당 메뉴(떡볶이 등)를 처음 주문하는 것임
        li.id = btn_Num+"_ordered";
        li.classList.add("ordered");
        plusBtn.classList.add("plus");
        minusBtn.classList.add("minus");
        deleteBtn.classList.add("delete");
        priceSpan.classList.add("priceSpan");

        plusBtn.appendChild(document.createTextNode("+"));
        minusBtn.appendChild(document.createTextNode("-"));
        deleteBtn.appendChild(document.createTextNode("삭제"));
        nameSpan.appendChild(document.createTextNode(selectedItem[btn_Num].name+"    "));
        amountSpan.appendChild(document.createTextNode(inputComma(selectedItem[btn_Num].amount)+"개    "));
        priceSpan.appendChild(document.createTextNode(inputComma(selectedItem[btn_Num].price)+"원"));

        li.appendChild(nameSpan);
        li.appendChild(amountSpan);
        li.appendChild(priceSpan);
        li.appendChild(plusBtn);
        li.appendChild(minusBtn);
        li.appendChild(deleteBtn);
        // li.appendChild(document.createTextNode(selectedItem[btn_Num].name+'  '));
        // li.appendChild(document.createTextNode(selectedItem[btn_Num].amount+'  개'+'  '));
        // li.appendChild(document.createTextNode(selectedItem[btn_Num].price+'원'));
        // li.appendChild('<button class="plus"> + </button>' +' '+ '<button class="minus"> - </button>')
        parentElement.appendChild(li);

    } else {
    //해당 메뉴(떡볶이 등)를 이미 주문했던 것이어서 수량/가격을 변동하는 것임
        document.getElementById(btn_Num+"_ordered").childNodes[1].innerText = inputComma(selectedItem[btn_Num].amount)+"개    ";
        document.getElementById(btn_Num+"_ordered").childNodes[2].innerText = inputComma(selectedItem[btn_Num].price)+"원";
        
    }
    
    totalAmount()
}

function plusMinusDelete(el){
    var clicked = el.target;
    var parent = clicked.parentElement;
    var text = clicked.innerText;
    var btn_Num = parent.id.slice(0,5);
    // + 기능
    if(clicked.tagName==="BUTTON"&&text==="+"){
        selectedItem[btn_Num].amount += 1;
    // - 기능
    } else if(clicked.tagName==="BUTTON"&&text==="-"){
        selectedItem[btn_Num].amount -= 1;
    }
    selectedItem[btn_Num].price = (selectedItem[btn_Num].amount) * (price[btn_Num]);
    parent.childNodes[1].innerText = inputComma(selectedItem[btn_Num].amount)+"개    ";
    parent.childNodes[2].innerText = inputComma(selectedItem[btn_Num].price)+"원";
    
    // 삭제 기능
    if(selectedItem[btn_Num].amount===0||(clicked.tagName==="BUTTON"&&text==="삭제")){
        parent.parentElement.removeChild(parent);
        selectedItem[btn_Num].amount = 0;
        selectedItem[btn_Num].price = 0; 
    }
    totalAmount()
};

function totalAmount(){
    var total = document.getElementById("total").querySelector('span');

    var sum = 
      selectedItem.btn_1.price
    + selectedItem.btn_2.price
    + selectedItem.btn_3.price
    + selectedItem.btn_4.price
    + selectedItem.btn_5.price
    + selectedItem.btn_6.price;

    total.innerText = inputComma(sum)
};

function test(){
    var cost = document.getElementById("total").querySelector('span').innerText;

    alert('결제하시겠습니까? \n금액은 ' + cost + '원입니다!');
}


function inputComma(number){
    var numToStr = number.toString().split(''); 
    var result = [];
    var count = 0;
    var cache = 0;
    var lastN = 0;
    if (numToStr.length<=3) {
        return number;
    } else {
        if (count===0) {
            result.unshift(numToStr.slice(-3).join(''));
            cache = -3;
            count +=1;
            lastN = -3;
        } 
        for (let n=6; n<numToStr.length; n+=3){
            result.unshift(numToStr.slice(-1*n,cache).join(''));
            cache = -1*n;
            lastN = n;
        }
        result.unshift(numToStr.slice(-1*(lastN+3),cache).join(''));
        return result.join(',');
    }
}