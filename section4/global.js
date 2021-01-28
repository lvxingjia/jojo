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

  iter: {},
  flag: 0,
  choice: 0,

  eins: {},
  zwei: {},
  snapshot: {},
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
  addF: function(x, pos) {
    pos = pos || UI.main;
    pos.innerHTML += x + '<br />';
  },

  battle: function(spell, eins, zwei) {
    eins[spell](zwei);
    zwei.attack(eins);
  },

  select: function(x) {
    let selectChar;
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
        Vars.choice = 0;
        Func.tell('none', UI.selectTbl);
        return;
    }
    let str = [
        'You have chosen ' + selectChar,
        '你选择了' + selectChar + '选项'
        ];
    Vars.choice = x;
    Func.tell(selectChar, UI.selectTbl);
    Func.add(Func.rand(str));
  },

  setSnap: function() {
    let attrs = ['name', 'hp', 'ap', 'mp', 'sp', 'wp', 'sl'];
    for (let i = 0; i < attrs.length; ++i) {
      Vars.snapshot[attrs[i]] = Vars.eins[attrs[i]];
    }
  },
  reSnap: function() {
    Vars.eins = Hero(Vars.snapshot);
    Vars.eins.show();
  },

  gameStart: function() {
    let heroName = document.getElementById('heorName').value || 'JOJO';
    Vars.iter = Story(chapter[0]);
    Vars.iter.start();
    Vars.eins = Hero({name: heroName, hp: 20, ap: 30, sp: 70, mp: 100});
    Vars.eins.sl = [1, 1, 1];
    Vars.eins.show();
    UI.main.addEventListener('click', Func.mainClick);
  },
  mainClick: function() {
    Vars.iter.next();
  },
};
