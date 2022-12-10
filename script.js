//                                                                                                                             ROOMS
//let menu = document.querySelector("#jatekter");
//menu.innerHTML = '<img src="images/menu.gif" style="display: block; overflow: hidden"></img><button type="button" style="display:inline-block; position:absolute; margin:525px 200px 200px 200px; border:2px solid black; padding:2px;">Play a game</button><script>let btn = document.querrySelector("button");button.addEventListener("click", start())</script>';

var E1;
var rooms = [];
var tdMatrix = [];
var areTreasurable = [];

var egyenesDb = 13; //13
var kanyarDb = 15; //15
var elagazasDb = 6; //6

const fixed = [2, 6, 6, 3, 7, 7, 6, 9, 7, 8, 9, 9, 4, 8, 8, 5];

const roomIMG = [
    {type: 0, link: "url('images/straigth1.png')", top: true, right: false, bot: true, left: false, next: 1},
    {type: 1, link: "url('images/straigth0.png')", top: false, right: true, bot: false, left: true, next: 0},
    {type: 2, link: "url('images/corner3.png')", top: false, right: true, bot: true, left: false, next: 3},
    {type: 3, link: "url('images/corner2.png')", top: false, right: false, bot: true, left: true, next: 5},
    {type: 4, link: "url('images/corner1.png')", top: true, right: true, bot: false, left: false, next: 2},
    {type: 5, link: "url('images/corner0.png')", top: true, right: false, bot: false, left: true, next: 4},
    {type: 6, link: "url('images/threeway3.png')", top: false, right: true, bot: true, left: true, next: 9},
    {type: 7, link: "url('images/threeway2.png')", top: true, right: true, bot: true, left: false, next: 6},
    {type: 8, link: "url('images/threeway1.png')", top: true, right: true, bot: false, left: true, next: 7},
    {type: 9, link: "url('images/threeway0.png')", top: true, right: false, bot: true, left: true, next: 8}
 ];

class tblRoom {
    constructor (id, x, y, treasure)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.player = false;
        this.treasure = treasure;
        this.treasureable = this.canBeTreasure();
        this.populatable = this.canBePopulated();
        this.link = this.getLink();
        this.playerLink = "url('images/player1.png')";
        this.top = this.getTop();
        this.right = this.getRight();
        this.bot = this.getBot();
        this.left = this.getLeft();
        this.next = this.getNext();
    }

    canBePopulated()
    {
        if(this.x === 1 || this.x === 7)
        {
            if (this.y === 1 || this.y === 7)
            {
                return true;
            }else{
                return false;   
            }
        }
        else
        {
            return false;
        }
    }

    canBeTreasure(){
        if(this.x === 1 || this.x === 7)
        {
            if (this.y === 1 || this.y === 7)
            {
                return false;
            }else{
                return true;   
            }
        }
        else
        {
            return true;
        }
    }
    getLink(){
        return roomIMG[this.id].link;
    }
    getTop(){
        return roomIMG[this.id].top;
    }
    getRight(){
        return roomIMG[this.id].right;
    }
    getBot(){
        return roomIMG[this.id].bot;
    }
    getLeft(){
        return roomIMG[this.id].left;
    }
    getNext(){
        return roomIMG[this.id].next;
    }

    /*
    randStraigth(){}
    randCorner(){}
    randThreeway(){}
    */
}
//                                                                                      ARROWS
const arroIMG = [
    {type: "top", link: "url('images/arro0.png')" },
    {type: "right", link: "url('images/arro1.png')"},
    {type: "bot", link: "url('images/arro2.png')"},
    {type: "left", link: "url('images/arro3.png')"},
    {type: "empty", link: "url('images/emptyTD.png')"}
];
//                                                                                     MULTICLASS
class multiClass {
    constructor(id, x, y)
    {
        this.id = id;
        this.x = x;
        this.y = y;
    }
    getArrowType(){
        return arroIMG[this.id].type;
    }
    getArrowLink(){
        return arroIMG[this.id].link;
    }
}

//                                                                                       RANDOMIZATION
const outcomes = [
    {type: "allThree", list: [0,1,2]},
    {type: "cornPstra", list: [0, 1]},
    {type: "3wayPstra", list: [0, 2]},
    {type: "3wayPcorn", list: [1, 2]},
    {type: "stra", list: [0]},
    {type: "corn", list: [1]},
    {type: "3way", list: [2]}
];

function makeP1(opt){
    var x = outcomes[opt].list.length;
    var chosen = Math.floor(Math.random() * x);
    var type = outcomes[opt].list[chosen];
    switch(type)
    {
        case 0:
            egyenesDb--;
            return Math.floor(Math.random() * 2);
        case 1:
            kanyarDb--;
            return Math.floor(Math.random() * 4 ) + 2;
        case 2:
            elagazasDb--;
            return Math.floor(Math.random() * 4 ) + 6;
    }
}

function makeTreasures(oriArray, num)
{
    let array = oriArray;
    let curId = array.length;
    while (array.length-num !== curId) 
    {
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
      rooms[array[curId].x][array[curId].y].treasure = true;
    }
}

function playerScored()
{
    if(treasuresRemaining >= 1)
    {    
        treasuresRemaining--;
    }
}

function refreshE1(id, isTreasure)
{
    let wholeBody = document.querySelector('body');
    wholeBody.oncontextmenu = function(e){e.preventDefault(); refreshE1(E1.next, E1.treasure);};

    var e1TBL = document.createElement('table'), e1TR = document.createElement('tr'), e1TD = document.createElement('td');
    e1TD.style.height = "85px";
    e1TD.style.width = "85px";
    if(isTreasure === true)
    {
        E1 = new tblRoom(id, 69, 69, true);
        e1TD.innerHTML = '<img src="images/mineral.png" border="0" style="display: block; margin-left: auto; margin-right: auto;"/>';
    }
    else
    {
        E1 = new tblRoom(id, 69, 69, false);
    }
    e1TD.style.backgroundImage = E1.link;
    e1TD.style.backgroundRepeat = "no-repeat";
    e1TD.style.backgroundSize = "cover";
    e1TR.appendChild(e1TD);
    e1TBL.appendChild(e1TR);
    e1TBL.style.border = "2px solid red"; //#2a1f19
    let container = document.getElementById('plusz1');
    container.innerHTML = "";
    container.appendChild(e1TBL);
}

function whereThePlayerIs()
{
    for(var i = 1; i < 8; i++)
    {
        for(var j = 1; j < 8; j++)
        {
            if(rooms[i][j].player === true)
            {
                return rooms[i][j];
            }
        }
    }
}

/*
function setJatekosNev(string)
{
    jatekosNev = string;
}

function setKincsekSzama(num)
{
    treasuresRemaining = num;
}
*/

function countPlayers()
{
    var darab = 0;
    for(var i = 1; i < 8; i++)
    {
        for(var j = 1; j < 8; j++)
        {
            if(rooms[i][j].player === true)
            {
                darab++;
            }
        }
    }
    return darab;
}

function whereThePlayerIs2()
{
    for(var i = 1; i < 8; i++)
    {
        for(var j = 1; j < 8; j++)
        {
            if(tdMatrix[i][j].innerHTML == '<img src="images/player1.png" border="0" style="display: block; margin-left: auto; margin-right: auto; padding: 0px;"/>')
            {
                return tdMatrix[i][j];
            }
        }
    }
}

function refreshTbl()
{
    var table = document.querySelector('#jatekter > table'), tr, td, row, cell;
    table.innerHTML = "";

    table.style.background = "#bd8dfd";
    table.style.backgroundRepeat = "no-repeat";
    table.style.backgroundSize = "cover";
    table.style.border = "2px solid black";

    for(row = 0; row < 9; row++)
    {
        tr = document.createElement('tr');
        for(cell = 0; cell < 9; cell++)
        {
            td = document.createElement('td');
            tr.appendChild(td);
            td.style.height = "65px";
            td.style.width = "65px";
            td.style.padding = "1px";
            td.addEventListener("click", letsGetMoving);
            if( row > 0 && row < 8 && cell > 0 && cell < 8)
            {
        
                if(rooms[row][cell].player != true)
                {
                    if(rooms[row][cell].treasure === true)
                    {
                        td.innerHTML = '<img src="images/mineral.png" border="0" style="display: block; margin-left: auto; margin-right: auto;"/>';
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.padding = "0px";
                    }
                    td.style.backgroundImage = rooms[row][cell].link;
                    td.style.border = "1px solid black";
                    //td.addEventListener("click", letsGetMoving);
                }
                else
                {
                    td.style.backgroundImage = rooms[row][cell].link;
                    td.innerHTML = '<img src="images/player1.png" border="0" style="display: block; margin-left: auto; margin-right: auto; padding: 0px;"/>';
                }
            } 
            else
            { 
                td.style.backgroundImage = rooms[row][cell].getArrowLink();
                if(row % 2 === 0 && cell % 2 === 0)
                {
                    if(row === 0)
                    {

                        if(cell === 2)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(0, 2);
                                }
                            });
                        }
                        else if (cell == 4)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(0, 4);
                                }
                            });
                        }
                        else if (cell == 6)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(0, 6);
                                }
                            });
                        }
                        /*if(cell > 0 && cell < 8)
                        {
                            dbTop+=2;
                            td.addEventListener('click', ()=>{

                            })); //td.addEventListener('click', insertE1(rooms[row][cell]));
                            function ()=>{
                                    if(this.target.matches('td'))
                                    {
                                        insertE1(0, 2);
                                    }
                            }(e)
                            {
                                if(e.target.matches('td'))
                                {
                                    insertE1(0, dbTop);
                                }
                            }
                        }*/

                    }
                    else if (row === 8)
                    {
                        if(cell === 0)
                        {
                            td.style.backgroundImage = "url('images/base2.png')";
                        }
                        if (cell == 2)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(8, 2);
                                }
                            });

                        }
                        else if (cell == 4)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(8, 4);
                                }
                            });

                        }
                        else if (cell == 6)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(8, 6);
                                }
                            });
                        }

                    }
                    else
                    {
                        if (row === 2 && cell === 0)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(2, 0);
                                }
                            });
                        }
                        else if (row === 4 && cell === 0)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(4, 0);
                                }
                            });
                        }
                        else if (row === 6 && cell === 0)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(6, 0);
                                }
                            });
                        }
                        else if(row === 2 && cell === 8)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(2, 8);
                                }
                            });
                        }
                        else if(row === 4 && cell === 8)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(4, 8);
                                }
                            });
                        }
                        else if(row === 6 && cell === 8)
                        {
                            td.addEventListener('click', (e)=>{
                                if(e.target.matches('td'))
                                {
                                    insertE1(6, 8);
                                }
                            });
                        }
                    }
                }
            }
        }
        table.appendChild(tr);
    }
    refreshTdMatrix();
}

function insertE1(row, cell)
{
    let obj = rooms[row][cell];

    //console.log(obj.getArrowType());
    if (obj.getArrowType() === "top")
    {
        var temp = new tblRoom(E1.id, 1, cell, E1.treasure);
        if(rooms[7][cell].player === true)
        {
            temp.player = true;
        }
        refreshE1(rooms[obj.x+7][obj.y].id, rooms[obj.x+7][obj.y].treasure);
        for(var i = 6; i > 0; i--)
        {
            rooms[i+1][cell] = rooms[i][cell];
        }
        rooms[1][cell] = temp;
        refreshTbl();
    }
    else if (obj.getArrowType() === "right")
    {
        var temp = new tblRoom(E1.id, row, 7, E1.treasure);
        if(rooms[row][1].player === true)
        {
            temp.player = true;
        }
        refreshE1(rooms[obj.x][obj.y-7].id, rooms[obj.x][obj.y-7].treasure);
        for(var i = 1; i < 7; i++)
        {
            rooms[row][i] = rooms[row][i+1];
        }
        rooms[row][7] = temp;
        refreshTbl();
    }
    else if (obj.getArrowType() === "bot")
    {
        var temp = new tblRoom(E1.id, 7, cell, E1.treasure);
        if(rooms[1][cell].player === true)
        {
            temp.player = true;
        }
        refreshE1(rooms[obj.x-7][obj.y].id, rooms[obj.x-7][obj.y].treasure);
        for(var i = 1; i < 7; i++)
        {
            rooms[i][cell] = rooms[i+1][cell];
        }
        rooms[7][cell] = temp;
        refreshTbl();
    }
    else if (obj.getArrowType() === "left")
    {
        var temp = new tblRoom(E1.id, row, 1, E1.treasure);
        if(rooms[row][7].player === true)
        {
            temp.player = true;
        }
        refreshE1(rooms[obj.x][obj.y+7].id, rooms[obj.x][obj.y+7].treasure);
        for(var i = 6; i > 0; i--)
        {
            rooms[row][i+1] = rooms[row][i];
        }
        rooms[row][1] = temp;
        refreshTbl();
    }
}

//                                                                                                         GENERATION

function mkTdMatrix()
{
    let tdData = document.querySelectorAll('#jatekter > table > tr > td');
    var TDB = 0;
    for(var MI=0; MI<9; MI++) {
        tdMatrix[MI] = new Array(7); 
        for(var MJ=0; MJ<9; MJ++)
        {
            tdMatrix[MI][MJ] = tdData[TDB];
            TDB++;
        }
    }
}

function removeEventlisteners()
{
    let tdData = document.querySelectorAll('#jatekter > table > tr > td');
    var TDB = 0;
    for(var MI=0; MI<9; MI++) {
        tdMatrix[MI] = new Array(7); 
        for(var MJ=0; MJ<9; MJ++)
        {
            tdData[TDB].removeEventListener("click", letsGetMoving);
            tdMatrix[MI][MJ] = tdData[TDB];
            TDB++;
        }
    }
}

function refreshTdMatrix()
{
    let tdData = document.querySelectorAll('#jatekter > table > tr > td');
    var TDB = 0;
    for(var MI=0; MI<9; MI++) {
        tdMatrix[MI] = new Array(7); 
        for(var MJ=0; MJ<9; MJ++)
        {
            tdData[TDB].addEventListener("click", letsGetMoving);
            tdMatrix[MI][MJ] = tdData[TDB];
            TDB++;
        }
    }
}

function setPlayerPos(obj)
{
    for(var i = 1; i < 8; i++)
    {
        for(var j = 1; j < 8; j++)
        {
            rooms[i][j].player = false;
            if(rooms[i][j].treasure === false)
            {
                tdMatrix[i][j].innerHTML = "";
            }
            else
            {
                tdMatrix[i][j].innerHTML = '<img src="images/mineral.png" border="0" style="display: block; margin-left: auto; margin-right: auto;"/>';
            }
        }
    }
    if(obj.treasure===true)
    {
        obj.treasure = false;
        playerScored(false);
    }
    obj.player = true;
    tdMatrix[obj.x][obj.y].innerHTML = '<img src="images/player1.png" border="0" style="display: block; margin-left: auto; margin-right: auto; padding: 0px;"/>';
    if(obj === rooms[7][1] && obj.player === true && treasuresRemaining === 0)
    {
        var wholePage = document.querySelector('body');
        wholePage.innerHTML = "";
        var daDiv = document.createElement('div');
        daDiv.style.display = "flex";
        daDiv.style.alignItems = "center";
        daDiv.style.justifyContent = "center";
        daDiv.style.textAlign = "center";
        daDiv.style.minHeight = "99.7vh";

        let winGif = document.createElement('img');
        winGif.src = "images/win.gif";
        winGif.style.overflow = "hidden";
        winGif.style.marginLeft = "auto";
        winGif.style.marginRight = "auto";
        winGif.style.border = "2px solid black"
    
        var memeText1 = document.createElement('p');
        memeText1.style.position = "absolute";
        memeText1.style.fontWeight = "999";
        memeText1.style.color = "red";
        memeText1.style.marginBottom= "50px";
        memeText1.style.marginRight = "250px";
        memeText1.innerText = `lö: ${nameOfThePlayer} nyer`; 

        var memeText2 = document.createElement('p');
        memeText2.style.position = "absolute";
        memeText2.style.fontWeight = "999";
        memeText2.style.color = "red";
        memeText2.style.marginLeft = "240px";
        memeText2.style.marginBottom = "300px";
        memeText2.innerText = "reakcióm:"; 

        var replayBtn = document.createElement('input');
        replayBtn.type = "button"
        replayBtn.value = "Replay?"
        replayBtn.style.position = "absolute"
        replayBtn.style.padding = "2px"
        replayBtn.style.margin = "400px 0px 0px 0px";
        replayBtn.style.border = "2px solid black";
        replayBtn.onclick = function(){window.location.reload(true)};
        
        daDiv.appendChild(winGif);
        daDiv.appendChild(replayBtn);
        daDiv.appendChild(memeText1);
        daDiv.appendChild(memeText2);
        wholePage.appendChild(daDiv);
    }
}

function generateE1(x){

    /*
    var E1 = new tblRoom(makeP1(0), 69, 69);
    document.getElementById('plusz1').style.backgroundImage = E1.link;
    */
    let wholeBody = document.querySelector('body');
    wholeBody.oncontextmenu = function(e){e.preventDefault(); refreshE1(E1.next);};

    var e1TBL = document.createElement('table'), e1TR = document.createElement('tr'), e1TD = document.createElement('td');
    e1TD.style.height = "85px";
    e1TD.style.width = "85px";
    E1 = new tblRoom(makeP1(x), 69, 69, false);
    e1TD.style.backgroundImage = E1.link;
    e1TD.style.backgroundRepeat = "no-repeat";
    e1TD.style.backgroundSize = "cover";
    e1TR.appendChild(e1TD);
    e1TBL.appendChild(e1TR);
    e1TBL.style.border = "2px solid red"; //#2a1f19
    document.getElementById('plusz1').appendChild(e1TBL);
    return E1;
    
}

function generateTbl(){

    var ind = 0;
    var table = document.querySelector('#jatekter > table'), tr, td, row, cell;
    //table.style.margin = "1px";
    //table.style.padding = "1px";
    table.style.background = "#bd8dfd";
    table.style.backgroundRepeat = "no-repeat";
    table.style.backgroundSize = "cover";
    table.style.border = "2px solid black";


    for (row = 0; row < 9; row++) 
    {
        tr = document.createElement('tr');
        rooms.push([]);
        

        for (cell = 0; cell < 9; cell++) 
        {
            
            td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = `(${row},${cell})`;
            td.style.height = "65px";
            td.style.width = "65px";
            td.style.padding = "1px";

            if( row > 0 && row < 8 && cell > 0 && cell < 8)
            {
                if(row % 2 != 0 && cell % 2 != 0)
                {
                    rooms[row][cell] = new tblRoom(fixed[ind], row, cell, false);
                    td.style.backgroundImage = rooms[row][cell].link;
                    td.style.border = "1px solid black";
                    ind++;
                }
                else
                {
                    
                    if(elagazasDb > 0 && kanyarDb > 0 && egyenesDb > 0)
                    {
                        rooms[row][cell] = new tblRoom(makeP1(0), row, cell, false);
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.border = "1px solid black";
                    }
                    else if(elagazasDb === 0 && kanyarDb > 0 && egyenesDb > 0)
                    {
                        rooms[row][cell] = new tblRoom(makeP1(1), row, cell, false);
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.border = "1px solid black";
                    }
                    else if(elagazasDb > 0 && kanyarDb === 0 && egyenesDb > 0)
                    {
                        rooms[row][cell] = new tblRoom(makeP1(2), row, cell, false);
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.border = "1px solid black";
                    }
                    else if(elagazasDb > 0  && kanyarDb > 0 && egyenesDb === 0)
                    {
                        rooms[row][cell] = new tblRoom(makeP1(3), row, cell, false);
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.border = "1px solid black";
                    }
                    else if(elagazasDb === 0 && kanyarDb === 0 && egyenesDb > 0)
                    {  
                        rooms[row][cell] = new tblRoom((makeP1(4)), row, cell, false);
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.border = "1px solid black";
                    }
                    else if(elagazasDb === 0 && kanyarDb > 0 && egyenesDb === 0)
                    {
                        rooms[row][cell] = new tblRoom(makeP1(5), row, cell, false);
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.border = "1px solid black";
                    }
                    else if(elagazasDb > 0 && kanyarDb === 0 && egyenesDb === 0)
                    {
                        rooms[row][cell] = new tblRoom(makeP1(6), row, cell, false);
                        td.style.backgroundImage = rooms[row][cell].link;
                        td.style.border = "1px solid black";
                    }
                    /*else if(elagazasDb < 0 || kanyarDb < 0 || egyenesDb < 0)
                    {
                        console.log("Hibas szobaszamok");
                    }*/
            
                }
                if(rooms[row][cell].treasureable === true)
                {
                    areTreasurable.push(rooms[row][cell]);
                }
            }
            else
            {
                if(row % 2 === 0 && cell % 2 === 0)
                {
                    if(row === 0 && cell === 0)
                    {
                        rooms[row][cell] = new multiClass(4, row, cell);
                    }
                    else if (row === 0 && cell == 8)
                    {
                        rooms[row][cell] = new multiClass(4, row, cell);
                    }
                    else if (row === 8 && cell == 0)
                    {
                        rooms[row][cell] = new multiClass(4, row, cell);
                    }
                    else if (row === 8 && cell === 8)
                    {
                        rooms[row][cell] = new multiClass(4, row, cell);
                    }
                    else
                    {
                 
                        if(row === 0)
                        {
                            rooms[row][cell] = new multiClass(0, row, cell);
                            td.style.backgroundImage = rooms[row][cell].getArrowLink();
                            //td.addEventListener('click', function(){insertE1(row, cell);});//td.addEventListener('click', insertE1(rooms[row][cell]));
                        }
                        else if(cell === 8)
                        {
                            rooms[row][cell] = new multiClass(1, row, cell);
                            td.style.backgroundImage = rooms[row][cell].getArrowLink();
                            //td.addEventListener('click', function(){insertE1(row, cell);});
                        }
                        else if (row === 8)
                        {
                            rooms[row][cell] = new multiClass(2, row, cell);
                            td.style.backgroundImage = rooms[row][cell].getArrowLink();
                            //td.addEventListener('click', function(){insertE1(row, cell);});
                        }
                        else if (cell === 0)
                        {
                            rooms[row][cell] = new multiClass(3, row, cell);
                            td.style.backgroundImage = rooms[row][cell].getArrowLink();
                            //td.addEventListener('click', function(){insertE1(row, cell);});
                        }
                    }
                }
                else
                {
                    rooms[row][cell] = new multiClass(4, row, cell);
                }

            }
        }
        table.appendChild(tr);
    }
    refreshTdMatrix();
}

/*
let tdData = document.querySelectorAll('#jatekter > table > tr > td')
let tdArray = Array.from(tdData);
let tdMatrix = new Array;
while(tdArray.length) 
{
    tdMatrix.push(tdArray.splice(0,9));
}
*/

function letsGetMoving()
{
    var pPoz = whereThePlayerIs();
    if(this.matches('td') || this.matches('img'))
    {
        var topNeigh = rooms[pPoz.x-1][pPoz.y];
        var botNeigh = rooms[pPoz.x+1][pPoz.y];
        var leftNeigh = rooms[pPoz.x][pPoz.y-1];
        var rightNeigh = rooms[pPoz.x][pPoz.y+1];

        if(this == tdMatrix[rightNeigh.x][rightNeigh.y])
        {
            if(rightNeigh.left == true && pPoz.right == true)
            {
                setPlayerPos(rightNeigh);
            }
        }
        else if(this == tdMatrix[topNeigh.x][topNeigh.y])
        {
            if(topNeigh.bot == true && pPoz.top == true)
            {
                setPlayerPos(topNeigh);
            }
        }
        else if(this == tdMatrix[leftNeigh.x][leftNeigh.y])
        {
            if(leftNeigh.right == true && pPoz.left == true)
            {
                setPlayerPos(leftNeigh);
            } 
        }
        else if(this == tdMatrix[botNeigh.x][botNeigh.y])
        {
            if(botNeigh.top == true && pPoz.bot == true)
            {
                setPlayerPos(botNeigh);
            }
        }
    }
    refreshTbl();
}
