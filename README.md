# VeriFy

<p>
  <a href="https://www.npmjs.com/package/@skiyee/verify" target="__blank"><img src="https://img.shields.io/npm/v/@skiyee/verify?color=42c02e" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/@skiyee/verify" target="__blank"><img src="https://img.shields.io/npm/dm/@skiyee/verify?color=42c02e" alt="NPM Downloads"></a>
</p>

一个支持多类型即时串行校验器(基于async-validtor重构拓展)

## 🚀 功能

- ⚡️ 实现即时快捷的串行校验，降低冗余校验操作

- 🦾 在基础数据类型的基础上，拓展多样化的校验选项

- 😃 [采用符合直觉的校验规则书写方式](#-依赖属性)

- ☁️ 提供客户端和云端双重支持，实现全方位的校验功能

- 🎈 [支持 VK-Router 云端框架](#%EF%B8%8F-配合vk云端路由做全局检验)

## 📦 安装

您可以通过 [npm](https://www.npmjs.com/package/@skiyee/verify) 安装 VeriFY：

```bash
npm i @skiyee/verify
```

> VK-Router框架直接在router路径下，打开终端并输入以上命令安装即可

## 📖 使用

配合[示例使用](https://github.com/Skiyee/VeriFY/tree/main/example)更舒服哦!

```JavaScript
import VeriFY from '@skiyee/verify'
// const VeriFY = required('@skiyee/verify')

const rules = {
  // 填充验证规则
}

// new一个该验证规则的实例
const validator = new VeriFY(rules)

const source = {
  // 与规则相对应的数据源
}

// 填入数据源给其验证
validator.validate(source, (error)=>{
  /** 
   * error有两种返回格式：
   * - 验证通过返回 null
   * - 验证失败返回 Array<object>
   */
})
```

## ⚙️ 属性

**简介: 最基础的属性，几乎每个规则体都需要用到**

### 是否必填

- required: Boolean

- value: 
  - true: 必填
  - false: 非必填

```JavaScript
name: { required: true, message: '姓名不能为空' }
```

### 校验类型

- type: String

- value: 
  - [string: 字符串类型](https://github.com/Skiyee/VeriFY/blob/main/example/string.js)
  - [number: 数字类型](https://github.com/Skiyee/VeriFY/blob/main/example/number.js)
  - [array: 数组类型](https://github.com/Skiyee/VeriFY/blob/main/example/array.js)
  - [object: 对象类型](https://github.com/Skiyee/VeriFY/blob/main/example/object.js)
  - [boolean: 布尔值类型](https://github.com/Skiyee/VeriFY/blob/main/example/boolean.js)
  - [enum: 枚举类型](https://github.com/Skiyee/VeriFY/blob/main/example/enum.js)

```JavaScript
age: { type: 'number', message: '年龄必须为数字' }
```

## 🪝 依赖属性

**简介: 依赖于[基础属性](#%EF%B8%8F-属性)，需要根据基础属性[校验类型]来使用**

> 拓展类型编写思想：即根据实际存储的数据类型来制定相应的基础类型拓展

### 枚举依赖

- enums: String | Array

- value: 枚举内容

```JavaScript
colors: {
  required: true,
  type: 'enum',
  enums: 'blue' // enums: ['green', 'red']
}
```

### 对象依赖

- fields: Object

- value: 子项规则体

```JavaScript
address: {
  type: 'object',
  fields: {
    city: { type: 'string', message: '城市不能为空' },
    // ...其他地址字段规则
  }
}
```

### 数组依赖

- fields: Object

- value: 子项规则体

```JavaScript
// Array<值类型的校验类型>: Array<string|number|...type>
grades: {
  type: 'array',
  allField: {
    type: 'number', min: 0, max: 100, message: '成绩必须是介于0到100之间的数字'
  }
}
// Array<引用类型的校验类型>: Array<object|array>
sku_list: {
  type: 'array',
  allField: {
    type: 'object',
    fields: {
      id: { type: 'number', message: 'ID必须是数字' },
      name: { type: 'string', message: '名称必须是字符串' },
    }
  }
}
```

### 指定范围

**注意：目前指定范围的校验类型有：string & number & array**

- min: Number

- max: Number

- len: Number

```JavaScript
score: { type: 'number', min: 0, max: 100, message: '成绩必须是介于0到100之间的数字' }

name: { type: 'string', len: 4, message: '名字长度必须为4个字符' }

measurements: { type: 'array', len: 10, message: '测量值数组长度必须为10' }
```

### 字符串类拓展类型

- extend: String

- value: 
  - pattern: 正则校验
  - mobile: 手机号校验

```JavaScript
name: { type: 'string', extend:'pattern', pattern: /^[A-Z]+$/, message: '姓名必须由大写字母组成' }
usermobile: { type: 'string', extend:'mobile', message: '必须是手机号码' }
```

### 数字类拓展类型

> tip: 该拓展类型配合[指定范围](#指定范围)使用

> 注意：校验的金额值必须是乘100的(即1元=100)，校验的比例值必须是除100的(即10%=0.01)

- extend: String

- value: 
  - money: 金额校验
  - ratio: 比例校验

```JavaScript
amount: { type: 'number', extend:'money', min: 50, max: 100, message: '金额必须介于50和100之间' }
percentage: { type: 'number', extend:'ratio', min: 0, max: 100, message: '任务完成百分比必须介于0%和100%之间' }
```

## ☁️ 配合VK云端路由做全局检验

### 创建校验文件

1. 在云函数(对象)同级目录下创建rules文件夹

2. 根据云函数/云对象创建文件名(二者有区别，请看以下示例)

#### 云函数下创建

云函数路径：user/sys/add.js
验证规则路径：user/rules/index.js

> 校验文件名只能是index，**多个**云函数对应**一个**校验文件

#### 云对象下创建

云对象路径：user/sys/user.js
验证规则路径：user/rules/user.js

> 校验文件与云对象文件同名，**一个**云对象对应**一个**校验文件

### 添加校验规则

在已创建的校验文件里放以下代码

> 若是云函数该文件路径为: xxx/rules/index.js, 云对象: xxx/rules/xxx.js

```JavaScript
const rules = {}

// 当调用某个云函数(对象)名为 add 时就触发该校验
rules.add = { 
  // 校验规则 
}
```

### 编写校验工具

> 这是一个全局的校验，其只会校验已添加规则的云函数(对象)

```JavaScript
// 路径：云端->router->util->pubFunction.js

// !!! 不要忘记安装VeriFY了, npm i @skiyee/verify
const Verify = require('@skiyee/verify')

pubFun.validate = function (url, sourceData) {
  // 这一句是关键，code为0时才会通过校验
  let res = { code: 0, msg: '通过验证' }

  if (typeof url !== 'string'){
    return { code: 50, msg: '规则路径参数错误' }
  }

  const splitType = url.includes('.') ? '.' : '/'
  const urlArr = url.replace(/sys|kh|pub\b/g, 'rules').split(splitType)
  const ruleName = urlArr.pop()
  const rulePathStr = `service/${urlArr.join('/')}`

  let rule = null

  try {
    rule = (vk.require(rulePathStr) || {})[ruleName]
  }
  catch (err) {
    return res
  }

  if (!rule)
    return res

  const Verify = new Verify(rule)

  Verify.validate(source, (err) => {
    if (err !== null){
      res = { code: 100, msg: err }
    }
  })

  return res
}
```

### 拦截并调用工具

创建前置过滤器

```JavaScript
// 路径：云端->router->middleware->modules->verifyFilter.js

module.exports = [
	{
		id: "globalValidate",
		regExp: "^admin",
		description: "全局校验器",
		index: 310,
		mode:"onActionExecuting", 
		main: async function(event) {
			let { data = {}, url,  util } = event;
			let { vk } = util;

      return vk.pubFun.validate(url, data)
		}
	}
]

```

Hope you enjoy 💜
