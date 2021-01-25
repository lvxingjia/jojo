## 人物

> JavaScript是一种非常随意的语言。  
> 重要的是一个对象能做什么，而不是它从何而来。  


本节设计了游戏中产生角色的模版。  
文件名为character.js  
- “抽象类”：Character
- 主人公Hero：拥有多种属性、装备、主动施放的技能
- 杂兵Enemy：只有最基本的属性
- 坏人首领Boss：使用技能替换基本攻击，可为每个实例编写不同的技能

首先制作一个人物类，使用的是“函数化”的创建方式  
1. 创建对象
2. 添加私有变量
3. 添加其他属性和方法
4. 返回对象
```javascript
let Character = function(spec) {
  // spec是一个对象，类似{name: 'jojo', hp: 100, ap: 10}
  // 之所以不直接使用name, hp, ap作为参数，是为了属性变多时易于维护
  let me = {};
  me.name = spec.name;
  me.hp = spec.hp;  // 生命值
  me.ap = spec.ap;  // 攻击力
  me.show =function() {  // 暂时先用这个将就一下，之后会使用HTML元素来展示
    console.log(me.name);
    console.log(me.hp);
    console.log(me.ap);
  }
  return me;
};

let jojo = Character({name: 'JOJO', hp: 10});
jojo.show();

/* * * * *
结果如下
JOJO
10
undefined
 * * * * */
```

改进一下show方法，按一个指定的人物属性数组显示  
```javascript
// Character
  let attrs = ['hp', 'ap'];
  me.show =function() {
    console.log(me.name);
    let showStr = ''
    for (let i = 0; i < attrs.length; ++i) {
      showStr += attrs[i] + ': ' + me[attrs[i]] + '\n';
    }
    console.log(showStr);
  };
```

用中文显示属性  
```javascript
// Character.show
  let attrsCN = ['生命', '攻击'];
// Character.show for循环内
      showStr += attrsCN[i] + ': ' + me[attrs[i]] + '\n';
```

增加attack方法，让人物可以攻击。这里额外设置了两个辅助方法check和fail，后有他用  
```javascript
// Character
  me.attack = function(target) {
    if (!this.hp || !target.hp) return;  //活着才有dps
    target.hp -= me.ap;
    target.check();  // 检查一下目标是否存活
  };
  me.check = function() {
    if (me.hp <= 0) {
      me.fail();
    } else {
      me.show();  // 刷新角色属性
    }
  };
  me.fail = function() {
    me.hp = 0;
    me.ap = 0;
    console.log(me.name + ' is failed');
  }
```

好了，现在建立两个角色互殴一波^_^  
```javascript
while(jojo.hp && dio.hp) {
  jojo.attack(dio);
  dio.attack(jojo);
}
```

不过我们的主人公显然不应该只有生命值、攻击力这两种属性的，要不也太无聊了
有魔法值、有法术强度、有装备和技能，才算一个合格的脚男- -|||
建立一个新的Hero类，“继承”自Character  
```javascript
let Hero = function(spec) {
  let me = Character(spec);
  me.attrs = ['hp', 'mp', 'ap', 'sp', 'wp'];
  me.attrsCN = ['生命', '法力', '攻击', '法术', '武器'];
  me.mp = spec.mp;  // 魔法值
  me.sp = spec.sp;  // 法术强度
  me.wp = spec.wp || '超级无敌破坏拳';  // weapon武器
  me.sl = spec.sl || [0, 0, 0];  // skill level技能等级，为0时该技能不可用
  return me;
};

// 先做一个Enemy放这里
let Enemy = function(spec) {
  let me = Character(spec);
  return me;
};
```

DIO说，他也想要专门的模版^_^
Boss拥有技能，并使用skill替换掉普通攻击  
```javascript
let Boss = function(spec) {
  let me = Character(spec);
  me.attrs = ['hp', 'mp', 'ap', 'sp', 'sk'];
  me.attrsCN = ['生命', '法力', '攻击', '法术', '技能'];
  me.mp = spec.mp;
  me.sp = spec.sp;
  me.skill = function(name, func) {
    this.sk = name;
    this.attack = func;
  };
  return me;
};
```

现在又可以对打一下啦，在实例化一个boss后，记得给他/她/它做上技能，不然boss只会平砍...囧rz  
```javascript
let jojo = Hero({name: 'JOJO', hp: 20, ap: 30});
let dio = Boss({name: 'DIO', hp: 50, ap: 10});
dio.skill('BOOOOOM!', function(target) {
  if (!this.hp || !target.hp) return;
  target.hp -= 100;
  console.log('BOOOOOM!');
  target.check();
});
while(jojo.hp && dio.hp) {
  jojo.attack(dio);
  dio.attack(jojo);
}
```

制作一个Boss类是为了生成更多的坏蛋，而他们的技能并不一定只是攻击特化，还要受到伤害减少、有魔法值抵挡伤害等  
所以有必要更新一下Character类，增加一个defend方法，令角色在受到攻击时作出防御--
```javascript
// Character
  me.attack = function(target) {
    if (!this.hp || !target.hp) return;
    let damage = target.defend(me.ap);
    target.hp -= damage;
    console.log(me.name + ' attack ' + target.name + ' ' + damege + 'damage');
    target.check();
  };
  me.defend = function(damage){
    return damage;  // 当然，最大众的方法是没有防御- -
  };

// Boss
  me.skill = function(name, attack, defend) {
    this.sk = name;
    this.attack = attack || this.attack;  // 如果没有特殊的attack/defed方法，就沿用原来的
    this.defend = defend || this.defend;
  };

// 测试一下
dio.skill('BOOOOOM!',
  function(target) {
  if (!this.hp || !target.hp) return;
  target.hp -= 100;
  console.log('BOOOOOM!');
  target.check();
  },
  function(damage){
    return 0;
  }
);
/* * * * *
JOJO attack DIO 30damage
DIO
生命: 50
法力: undefined
攻击: 10
法术: undefined
技能: BOOOOOM!
BOOOOOM!
JOJO is failed
 * * * * */
```

多样化的战斗显示：设置一个数组，放上多条战斗提示文字（含占位字符），随机播放  
```javascript
// Character.attack
    let str =[
      'eins攻击了zwei，造成了xxx点伤害',
      'eins殴打了zwei，zwei流了xxx滴血'
    ];
    str = rand(str);
    str = str.replaceAll('eins', me.name);
    str = str.replaceAll('zwei', target.name);
    str = str.replaceAll('xxx', damage);
    console.log(str);

// 在String上自定义一个方法
String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
// 取数组中随机项
let rand = function(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
};
```

到这里，肯定有人要问为什么主角没有技能：）  
主角的技能自然要手动施放，这里先做上，网页中才可以完全发挥它们的威力。  
```javascript
  me.spell = function(mana, factor){
    // 辅助方法 检查法力是否足以施放法术，返回法术的基础伤害
    mana = mana || 0; // 消耗法力值
    factor = factor || 1;  // 法术因子
    if (me.mp < mana) {
      let str = ['你无法施放这个法术', '法力值不足', '你需要更多法力', '法术需要法力才可以施放'];
      console.log(rand(str));
      return 0;
    }
    me.mp -= mana;
    me.show();
    return me.sp * factor;
  };
  me.fire = function(target){
    // 这是一个标准的法术
    if (!me.hp || !target.hp) return;
    if (!me.sl[2]) {  // 检查法术是否已学会
      let str = ['你无法施放这个法术', '你还木有学会这个技能', '这个技能点是0'];
      console.log(rand(str));
      return;
    }
    let damage = me.spell(3, 1) * me.sl[2] * 0.5;  // 基础伤害、技能等级都会影响最终伤害
    if (damage) {
      target.hp -= damage;
      let str =[
        'eins对zwei使用了skl，造成了xxx点伤害',
        'skl！zwei受到了xxx点伤害'
      ];
      str = rand(str);
      str = str.replaceAll('eins', me.name);
      str = str.replaceAll('zwei', target.name);
      str = str.replaceAll('xxx', damage);
      str = str.replaceAll('skl', 'fire');
      console.log(str);
      target.check();
    }
  };

// 测试一下
let jojo = Hero({name: 'JOJO', hp: 20, ap: 30, sp: 70, mp: 100});
jojo.sl = [1, 1, 1];
/* * * * *
JOJO
生命: 20
法力: 97
攻击: 30
法术: 70
武器: 超级无敌破坏拳
fire！DIO受到了70点伤害
DIO is failed
 * * * * */
```

下面是一个非常规技能的例子，它以攻击强度(ap)而不是法术强度(sp)结算伤害  
```javascript
  me.oula = function(target){
    if (!me.hp || !target.hp) return;
    let casted = me.spell(1);
    if (casted) {
      let damage = me.ap * (2 + me.sl[1]);
      target.hp -= damage;
      console.log('oulaoulaoulaoula');
      target.check();
    }
  };
```

人物模版现已做好。下一节，会制作一个简陋的网页，实现我们紧张刺激的battle。
