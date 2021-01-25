## 网页

> 据说真正的大佬看HTML文本就如同看浏览器一样...  
> 然而我等凡人只能先在各元素上作小记号，等调试完了再抹掉>_<  


本节将角色放置在一个简陋的网页上，使用几个按钮来实现角色的战斗。  
新建了一个js文件，用于放置全局变量和函数。  
组织结构如下：  
- character.js: 角色文件，最主要在实现都在这里
- global.js: 全局变量和函数
  + UI对象: 网页元素
  + Vars对象: 全局变量
  + Func对象: 全局函数
- TEST.html: 一个简单的网页，使用表格作为框架
- style.css: 调整网页的布局

先建立一个HTML  
```html
<!-- TEST.html -->
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<!-- 网页自动缩放 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>JOJO</title>
</head>
<body>
</body>
</html>
<script src="./global.js"></script>
<script src="./characters.js"></script>
```

手搓一个表格来作为游戏的主要部分  
```html
<!-- TEST.html/body -->
<table border="1">
  <tr>
    <th id="title" colspan="2">JOJO</th>
  </tr>
  <tr>
    <td id="main" colspan="2">  <!-- 战斗信息，剧情（后续内容）都在这里显示-->
    </td>
  </tr>
  <tr><!-- 为了方便固定在网页上，统一用eins来指代主人公，zwei指代所有敌对角色-->
    <td id="einsNameTbl" class="name">11</td><!--主人公的名字，显示在左侧-->
    <td id="zweiNameTbl" class="name">12</td><!--敌对角色的名字，显示在右侧-->
  </tr>
  <tr>
    <td id="einsAttrsTbl" class="attrs">21</td><!--主人公的属性，在其名字下方-->
    <td id="zweiAttrsTbl" class="attrs">22</td><!--敌对角色的属性，在其名字下方-->
  </tr>
</table>
```

使用CSS来固定网页大小、字体  
```css
/* style.css */
body
{
  font-size:100%;
}
table
{
  width:100%;
  height:20em;
}
.name
{
  width:50%;
  text-align:center;
  font-size:1.5em;
}
.attrs
{
  width:50%;
  font-size:1.2em;
}
#main
{
  width:200%;
  height:20em;
  float:inline-start;
  font-size:1em;
}
```

设计几个函数，可以在网页上打印内容  
```javascript
// tell直接更改内容，add在原有基础上添加
let addCnt=0;  // add在主显示main上的打印行数计数，当addCnt大于10时刷新main
let tell = function(x, pos) {
  pos = pos || 'main';  // pos缺省时默认为main
  document.getElementById(pos).innerHTML = x + '<br />';
  if (pos === 'main') {
    addCnt = 0;
  }
};
let add = function(x, pos) {
  pos = pos || 'main';
  if (addCnt < 10) {
    document.getElementById(pos).innerHTML += x + '<br />';
    ++addCnt;
  } else {
    tell(x);
  }
};
```

为了简化全局变量管理，新建一个global.js文件，定义UI、Vars、Func三个对象。  
```javascript
// global.js
const UI = {
  main: document.getElementById('main'),
  einsNameTbl: document.getElementById('einsNameTbl'),
  zweiNameTbl: document.getElementById('zweiNameTbl'),
  einsAttrsTbl: document.getElementById('einsAttrsTbl'),
  zweiAttrsTbl: document.getElementById('zweiAttrsTbl'),
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
};
```

更新一下character.js中的方法，令输出在网页上而不是控制台进行。
```javascript
// 例如，将console.log('BOOOOOM!');
// 更改为Func.add('BOOOOOM!');

// character.js/Character
  me.pos = [UI.einsNameTbl, UI.einsAttrsTbl];  // 增加pos属性，角色show的位置
  me.show =function() {
    Func.tell(me.name, me.pos[0]);
    let showStr = me.attrsCN[0] + ': ' + me[me.attrs[0]];  // 不想在最后留一空行了- -||
    for (let i = 1; i < me.attrs.length; ++i) {
      showStr += '<br />' + me.attrsCN[i] + ': ' + me[me.attrs[i]];
    }
    Func.tell(showStr, me.pos[1]);
  };

// character.js/Character.fail 失败时将不显示属性信息，以failed替之
  Func.tell('failed', me.pos[1]);
```

表格下方增加一行，实现主动攻击、施放技能  
```html
<!-- TEST.html/table -->
  <tr>
    <td id="spell" colspan="2">
      你的技能：<br />攻击：
      <button id="s0" onclick="Func.battle('attack', eins, zwei)">攻击</button>法术：
      <button id="s1" onclick="Func.battle('oula', eins, zwei)">OuLa~</button>
      <button id="s2" onclick="Func.battle('fire', eins, zwei)">🔥Fire🔥</button>
    </td>
  </tr>
```

函数实现  
```javascript
  // global.js/Func
  battle: function(spell, eins, zwei) {
    eins[spell](zwei);
    zwei.attack(eins);
  },
```

Hero的每个技能是有等级的(sl属性，它是一个数组)，在等级为0时，主人公无法使用该技能，自然也不应该在技能栏显示。在网页中，这些元素默认是隐藏的，调用Hero的show方法时，令其显现  
```html
<!-- TEST.html/table -->
      <button id="s0" style="display: none" onclick="Func.battle('attack', eins, zwei)">攻击</button>法术：
```
```javascript
// global.js/UI
  s0: document.getElementById('s0'),
  s1: document.getElementById('s1'),
  s2: document.getElementById('s2'),

// character.js/Hero 重写show方法
  let superShow = me.show;
  me.show = function() {
    superShow();
    let sid = ['s0', 's1', 's2'];
    for (let i = 0; i < sid.length; ++i) {
      if (me.sl[i]) {
        UI[sid[i]].style.display = 'inline';
      }
    }
  };
```

江湖险恶，难免有打打杀杀；而风云变幻之下，更多的是人情冷暖。下一节我们将看见故事。
