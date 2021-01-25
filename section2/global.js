String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const UI = {
  main: document.getElementById('main'),
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

  battle: function(spell, eins, zwei) {
    eins[spell](zwei);
    zwei.attack(eins);
  },
};
let add_f = function(x, pos) {
  pos = pos || 'main';
  document.getElementById(pos).innerHTML += x + '<br />';
};

