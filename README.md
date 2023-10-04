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

```javascript
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

```javascript
const source = {
  cool: true
}

const rule = {
  cool: { required: true, type: 'boolean', message: 'super cool!' },
}
```

#### Array | Object

```javascript
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

```javascript
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
