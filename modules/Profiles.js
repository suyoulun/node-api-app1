const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 个人档案 Schema
const ProfileSchema = new Schema({
  user: { // 关联用户ID
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: { // 事件
    type: String,
    required: true,
    max: 40
  },
  company: { // 公司
    type: String
  },
  website: { // 网站
    type: String
  },
  location: { // 地址
    type: String
  },
  status: { // 身份
    type: String,
    required: true
  },
  skills: { // 技能
    type: [String],
    required: true
  },
  bio: { // 个人简介
    type: String
  },
  githubusername: { // github地址
    type: String
  },
  experience: [ // 工作经历
    {
      current: { // 当前的
        type: Boolean,
        default: true
      },
      title: { // 标题
        type: String,
        required: true
      },
      company: { // 公司
        type: String,
        required: true
      },
      location: { // 地址
        type: String
      },
      from: { // 开始时间
        type: String,
        required: true
      },
      to: { // 结束时间
        type: String
      },
      description: { // 描述
        type: String
      }
    }
  ],
  education: [ // 教育经历
    {
      current: {
        type: Boolean,
        default: true
      },
      school: { // 院校
        type: String,
        required: true
      },
      degree: { // 学历
        type: String,
        required: true
      },
      fieldofstudy: { // 专业
        type: String,
        required: true
      },
      from: { // 开始时间
        type: String,
        required: true
      },
      to: { // 结束时间
        type: String
      },
      description: { // 描述
        type: String
      }
    }
  ],
  social: { // 社交
    wechat: { // 微信
      type: String
    },
    QQ: {
      type: String
    },
    tengxunkt: { // 腾讯课堂
      type: String
    },
    wangyikt: { // 网易云课堂
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);