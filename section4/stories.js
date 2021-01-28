let Story = function(sheet) {
  // sheet: {content: string[], section: number[]}
  let me = {};
  me.page = 0;

  me.content = sheet.content || ['blank'];
  me.section = sheet.section || [];

  me.start = function(page) {
    page = page || 0;
    Func.tell(me.content[page]);
  };
  me.next = function() {
    if (me.page < me.content.length - 1) {
      me.start(++me.page);
    } else {
      me.finish();
    }
  };
  me.finish = function() {
    if (Vars.choice) {
      let idx = me.section[Vars.choice - 1];
      if (idx >= 0) {
        Func.select();
        Vars.iter = Story(chapter[idx]);
      } else {
        Vars.flag = 0;
        Vars.iter = Action(incident[-idx]);
      }
      Vars.iter.start();
    } else {
      let str = [
        'Please select an option.',
        '请点击下方的按钮，选择一个选项',
      ];
      Func.add(Func.rand(str));
    }
  };
  return me;
};


let Action = function(scene) {
  // scene: {encounter: function, outcome: number}
  let me = {};
  me.encounter = scene.encounter || function() {
    Func.tell('无事发生');
  };
  me.outcome = scene.outcome || 0;
  me.start = function() {
    Func.setSnap();
    me.encounter();
  };
  me.next = function() {
    if (Vars.flag) {
      me.finish();
    } else {
      let str = [
        'Attack this enemy, plz',
        '请攻击敌人...',
      ];
      Func.add(Func.rand(str));
    }
  };
  me.finish = function() {
    if (Vars.flag === 1) {
      let idx = me.outcome;
      if (idx >= 0) {
        Func.select();
        Vars.iter = Story(chapter[idx]);
      } else {
        Vars.flag = 0;
        Vars.iter = Action(incident[-idx]);
      }
      Vars.iter.start();
    } else {
      Func.reSnap();
      Vars.flag = 0;
      Vars.iter.start();
      let str = [
        '重新开始战斗...',
        '战斗数据重置...'
      ];
      Func.add(Func.rand(str));
    }
  };
  return me;
};
