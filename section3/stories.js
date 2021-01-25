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
      Func.setSelectable();
      me.finish();
    }
  };
  me.finish = function() {
    if (Vars.choice) {
      let idx = me.section[Vars.choice - 1];
      Func.select(0);
      Func.setSelectable(0);
      Vars.iter = Story(chapter[idx]);
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

let chapter = [
  {
    content: [
      'hello',
      'chapter0, page1',
      'chapter0, page2',
      'chapter0, page3',
    ],
    section: [1, 2, 3]
  },
  {
    content: [
      'hello',
      'chapter1, page1',
      'chapter1, page2',
      'chapter1, page3',
    ],
    section: [1, 2, 3]
  },
  {
    content: [
      'hello',
      'chapter2, page1',
      'chapter2, page2',
      'chapter2, page3',
    ],
    section: [1, 2, 3]
  },
  {
    content: [
      'hello',
      'chapter3, page1',
      'chapter3, page2',
      'chapter3, page3',
    ],
    section: [1, 2, 3]
  },
];

Vars.iter = Story(chapter[0]);
Vars.iter.start();
