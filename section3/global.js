String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const UI = {
  main: document.getElementById('main'),

  selectTbl: document.getElementById('selectTbl'),

  einsNameTbl: document.getElementById('einsNameTbl'),
  zweiNameTbl: document.getElementById('zweiNameTbl'),
  einsAttrsTbl: document.getElementById('einsAttrsTbl'),
  zweiAttrsTbl: document.getElementById('zweiAttrsTbl'),

  s0: document.getElementById('s0'),
  s1: document.getElementById('s1'),
  s2: document.getElementById('s2'),
};

const Vars =  {
  addCnt: 0,

  selectable: [0, 0, 0],
  choice: 0,

  iter: {},
  flag: 0,
};

const Func =  {
  rand: function(array) {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
  },

  tell: function(x, pos) {
    pos = pos || UI.main;
    pos.innerHTML = x + '<br />';
    if (pos === UI.main) {
      Vars.addCnt = 0;
    }
  },
  add: function(x, pos) {
    pos = pos || UI.main;
    if (Vars.addCnt < 10) {
      pos.innerHTML += x + '<br />';
      ++Vars.addCnt;
    } else {
      Func.tell(x);
    }
  },
  //addF

  battle: function(spell, eins, zwei) {
    eins[spell](zwei);
    zwei.attack(eins);
  },

  select: function(x) {
    let selectChar, str;
    switch (x) {
      case 1:
        selectChar = 'A';
        break;
      case 2:
        selectChar = 'B';
        break;
      case 3:
        selectChar = 'C';
        break;
      default:
        selectChar = 'none';
    }
    if (Vars.selectable[x - 1]) {
      str = [
        'You have chosen ' + selectChar,
        '你选择了' + selectChar + '选项'
        ];
    } else {
      str =[
        'You have chosen ' + selectChar + '. <em>But there is no egg to use</em> :)',
        '你选择了' + selectChar + '选项，<em>然而这并没有什么卵用</em>- -|||'
        ];
    }
    Vars.choice = x;
    Func.tell(selectChar, UI.selectTbl);
    Func.add(Func.rand(str));
  },
  setSelectable: function(x) {
    x = x === 0 ? 0 : x || 1;
    switch (x) {
      case 0:
        Vars.selectable = [0, 0, 0];
        break;
      case 1:
        Vars.selectable = [1, 1, 1];
        break;
      default:
        Vars.selectable = [1, 1, 0];
    }
  },
};

let add_f = function(x, pos) {
  pos = pos || 'main';
  document.getElementById(pos).innerHTML += x + '<br />';
};

