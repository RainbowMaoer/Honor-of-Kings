const mongoose = require('mongoose')

// 用它来定义该模型的字段有哪些
const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  // 这个banner字段是背景图
  banner: { type: String },
  title: { type: String },
  // 因为一个英雄有多个分类,比如法刺,既是刺客又是法师
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  scores: {
    difficult: { type: Number },
    skills: { type: Number },
    attack: { type: Number },
    survive: { type: Number }
  },
  skills: [{
    icon: { type: String },
    name: { type: String },
    description: { type: String },
    tips: { type: String }
  }],
  items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  usageTips: { type: String },
  battleTips: { type: String },
  teamTips: { type: String },
  partners: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
    description: { type: String }
  }]
})

// 导出的是mongoose的一个模型,哪里需要用到就哪里导入 比如admin里面的index.js  
// 这里传递第三个参数集合 是因为平常不传都会自动识别然后变成模型名称的小写负数形式，但是这里不会，因为它会变成heros
module.exports = mongoose.model('Hero', schema, 'heroes')