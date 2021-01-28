const chapter = [
  {
    content: [
      'hello',
      'chapter0',
      'Choose a item:<br />A=>chapter1<br />B=>chapter2<br />C=>chapter3'
    ],
    section: [1, 2, 3]
  },
  {
    content: [
      'chapter1',
      'Choose a item:<br />A=>incident1<br />B=>chapter2<br />C=>chapter1'
    ],
    section: [-1, 2, 1]
  },
  {
    content: [
      'chapter2',
      'Choose a item:<br />A=>incident2<br />B=>chapter3<br />C=>chapter2'
    ],
    section: [-2, 3, 2]
  },
  {
    content: [
      'chapter3',
      'Choose a item:<br />A=>incident3<br />B=>chapter1<br />C=>chapter3'
    ],
    section: [-3, 1, 3]
  }
];

const incident = [
  {
    encounter: function() {
      Func.tell('nothing happend');
      Vars.iter = Story(chapter[0]);
    },
    outcome: 0
  },
  {
    encounter: function() {
      Func.tell('incident1');
      Func.add('level up');
      Vars.eins.hp += 10;
      Vars.eins.ap += 5;
      Vars.eins.show();
      Vars.flag = 1;
    },
    outcome: 0
  },
  {
    encounter: function() {
      Func.tell('incident2');
      Func.add('enemy appears');
      Vars.zwei = Enemy({name: 'ice cream', hp: 20, ap: 1});
      Vars.zwei.show();
    },
    outcome: 1
  },
  {
    encounter: function() {
      Func.tell('incident3');
      Func.add('boss appears');
      Vars.zwei = Boss({name: 'DIO', hp: 100, mp: 100, ap: 20, sp: 20});
      Vars.zwei.skill('BOOOOOM!',
        function(target) {
        if (!this.hp || !target.hp) return;
        target.hp -= 100;
        Func.add('BOOOOOM!');
        target.check();
        },
        function(damage){
          return 0;
        }
      );
      Vars.zwei.show();
    },
    outcome: 1
  },
];

