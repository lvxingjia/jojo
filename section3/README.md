## 故事

> History become legend, legend became myth.  
> 给每个章节编号排列，所有的故事组成了一颗树。  


本节尝试在主显示框main里讲故事。每个章节有若干页，当主框被点击时线性推进；在每章节的最后一页，可以选择3个选项，不同的选项将进入不同章节。  
```javascript
// 文件stories.js中的Story对象并不是整个故事，而是一个章节
// 章节可以看作一个故事树的节点
{
content: [          // 章节的内容，包含许多页
    'page1',
    'page2',
    'page3'
],
section: [1, 2, 3]  // 可选的下一章节编号
}
```

Story对象应该包含内容、下一章节~~的指针~~，还有一个page属性记录当前页码。  
start方法显示某页，next方法进入下一页，finish方法则进入下一章节。  
（这几个方法与Action对象相同，以使用同样的iter.next）  
```javascript
// stories.js
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
    if (me.page < me.content.length - 1) {  // 不是最后一页
      me.start(++me.page);
    } else {  // 最后一页
      this.finish();
    }
  };
  return me;
};
```

在主框下方增加选项区域  
```html
<!-- TEST.html/table -->
  <tr>
    <td colspan="2" noswap>
      <button onclick="Func.select(1)">Choosing A</button>
      <button onclick="Func.select(2)">Choosing B</button>
      <button onclick="Func.select(3)">Choosing C</button>
      You have chosen <strong id="selectTbl">none</strong>
    </td>
  </tr>
```

实现  
```javascript
// global.js/Vars
  selectable: [0, 0, 0],  // 当前选项的有效性
  choice: 0,  // 当前选择
// global.js/Func
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
    Vars.choice = x;  // 这里意味着，所谓选项有效性selectable并没有什么egg use
    // 之所以让选项任何时间都生效，是为了在最后一页切换下一章节时保持流畅
    Func.tell(selectChar, UI.selectTbl);
    Func.add(Func.rand(str));
  },
```

仅做提示用的函数  
```javascript
// global.js/Func
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
// Story.next
    } else {  // 最后一页
      Func.setSelectable();
      me.finish();
```

当前的章节存放在全局变量Vars.iter中~~啥叫迭代器？没听说过~~
```javascript
// global.js/Vars
  iter: 0,
// stories.js/Story
  me.finish = function() {
    if (Vars.choice) {
      let idx = me.section[Vars.choice - 1];  // 错位是为了留一个0判空
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
```

设置一个测试用例  
```javascript
// stories.js
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
```

点击主框，脑补一个故事吧233  
```html
<!-- TEST.html/table -->
    <td id="main" colspan="2" onclick="Vars.iter.next()">
```

只看故事未免单调，历险的过程有故事，也有战斗、有奇遇。  
Action类内容是一个函数，借此可以设计战斗或其他过程，它的编号索引被设计成负值以与Story区分，使用全局变量Vars.flag而不是Vars.choice来控制过程进行。  
Action.start和Boss.skill一样，是这个无比枯燥文字游戏中可以自由发挥想象力的舞台，have fun!  
```javascript
// stories.js
let Action = function(scene) {
  // scene: {start: function, outcome: number}
  let me = {};
  me.start = scene.start || function() {
    Func.tell('无事发生');
  };
  me.outcome = scene.outcome || [];
  // Vars.flag 0事件继续 1事件完成 -1事件失败
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
        Func.setSelectable(0);
        Vars.iter = Story(chapter[idx]);
        Vars.iter.start();
      } else {
        Func.setSelectable(0);
        Vars.iter = Story(chapter[idx]);
        Vars.iter.start();
      }
    } else {
      Func.gameOver();
    }
  };
  return me;
};
```
