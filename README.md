# VeriFY

**VeriFY**(Verify **F**or **Y**ou) 是一个支持多类型即时串行校验器

> 该校验器是在async-validtor的基础上重构的，目的是为了适应自己的项目

## 特点

- **数据验证**：VeriFY 支持基础类型，并且拓展常见的类型

- **轻松集成**：VeriFY 支持多种引入方式

- **双端支持**：VeriFY 支持云端和本地端

## 入门指南

按照以下简单的步骤开始使用 VeriFY：

1. **安装**：详细的安装说明可以在 [安装指南](#安装) 中找到。

2. **使用**：详细的使用说明可以在 [使用指南](#使用) 中找到。

3. **示例**：待添加

4. **配合VK框架**: 详细的使用说明可以在 [配合VK框架](#如何配合VK框架做全局检验)中找到


## 安装

您可以通过 [npm](https://www.npmjs.com/package/@skiyee/verify) 安装 VeriFY：

```bash
npm i @skiyee/verify
```

## 使用

### 基本语法

> 支持对象和数组类型，数组是有多少数据就验证多长
>
> 假设array.length === 10, 那么 VeriFY 就会校验10次

#### 必填: 

- required: boolean

#### 类型: 

- type: string
- value: 'string' | 'number' | 'boolean' | 'array' | 'object'

#### 对象下不同字段: 

- fields: { ...rule }

#### 数组下相同字段:

- allField: { ...rule } 

### 类型语法

#### String | Number

这三者都有相同的验证规则语法

```JavaScript
const source = {
  name: 'xQc',
  age: 27
}

const rule_easy = {
  name: { required: true, type: 'string', message: 'XQCL' },
  age: { required: true, type: 'number', message: 'o7' }
}

const rule_limit = {
  name: [
    { required: true, type: 'string', message: 'XQCL' },
    { len: 3, message: 'wrong dud' }
  ],
  age: [
    { required: true, type: 'number', message: 'o7' },
    { min: 0, max: 100, message: 'cuz o7' }
  ]
}
```

#### Boolean 

```JavaScript
const source = {
  cool: true
}

const rule = {
  cool: { required: true, type: 'boolean', message: 'super cool!' },
}
```

#### Array | Object

```JavaScript
const sourceObject = {
  spec_list: {
    name: 'first goods',
  }
}

const ruleObject = {
  spec_list: {
    required: true,
    type: 'object',
    fields: {
      name: { required: true, type: 'string' },
    }
  }
}

const sourceObjectOfArray = {
  sku_list: [
    { id: 1, name: 'first goods' },
    { id: 2, name: 'second goods' },
  ],
}

const ruleObjectOfArray = {
  sku_list: {
    required: true,
    type: 'array',
    allField: {
      required: true,
      type: 'object',
      fields: {
        id: { required: true, type: 'number' },
        name: { required: true, type: 'string' },
      }
    }
  }
}
```


### 使用流程

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
   * - 验证通过返回 Array<object>
   */
})
```

## 如何配合VK框架做全局检验

> 同时这也是VeriFY创造的动机

### 创建校验文件

1. 在云函数(对象)同级目录下创建rules文件夹

2. 根据云函数/云对象创建文件名(二者有区别，请看以下示例)

#### 云函数

云函数路径：user/sys/add.js
验证规则路径：user/rules/index.js

> 校验文件名只能是index，多个云函数对应一个校验文件

#### 云对象

云对象路径：user/sys/user.js
验证规则路径：user/sys/user.js

> 校验文件与云对象文件同名，一个云对象对应一个校验文件

### 添加校验规则

在已创建的校验文件里放以下代码

```JavaScript
const rules = {}

// 当调用某个云函数(对象)名为 add 时就触发
rules.add = { 
  // 校验规则 
}
```

### 校验函数工具

> 这是一个全局的校验，其只会校验已添加规则的云函数(对象)

```JavaScript
// 路径：云端->router->util->pubFunction

// !!! 不要忘记安装VeriFY了, npm i @skiyee/verify
const Verify = require('@skiyee/verify')

pubFun.validate = function (url, source) {
  let res = { code: 0, msg: '通过验证' }

  if (typeof url !== 'string'){
    return { code: 50, msg: '索引参数错误' }
  }

  const splitType = url.includes('.') ? '.' : '/'

  const mainPath = url.replace(/sys|kh|pub\b/g, 'rules').split(splitType)

  const methodName = mainPath.pop()

  const mainPathStr = `service/${mainPath.join('/')}`

  let rule = null

  try {
    rule = vk.require(mainPathStr)?.[methodName]
  }
  catch (err) {
    return res
  }

  if (!rule)
    return res

  const validtor = new Verify(rule)

  validtor.validate(source, (err) => {
    if (err !== null){
      // 校验通过的result，只要code等于0即可
      res = { code: 100, msg: err }
    }
  })

  return res
}
```

### 拦截并调用工具

创建前置拦截器

```JavaScript
// 路径：router/middleware/modules

module.exports = [
	{
		id: "globalValidate",
		regExp: "^admin", // 正则匹配规则，这个是以^admin开头的云函数会被拦截
		description: "全局校验器",
		index: 310,
		mode:"onActionExecuting", 
		main: async function(event) {
			// 这里是拦截规则，可以查数据库，最终code:0 代表通过，其他均为未通过，msg是被拦截的原因
			let { data = {}, url,  util } = event;
			let { vk } = util;

      return vk.pubFun.validate(url, data)
		}
	}
]

```

Hope you enjoy 💜
