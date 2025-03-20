/**
 * 将日期字符串转换为中文格式
 * @param {string} d - 日期字符串，格式为 YYYY-MM-DD
 * @returns {string} 转换后的中文日期字符串
 */
export const parseDateFn = (d) => {
  if (!d) return ''
  
  const date = new Date(d)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}年${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`
}

/**
 * 将表单值映射为性别字符串
 * @param {string} num - 表单值
 * @returns {string} 性别字符串
 */
export const convertNumToSex = (num) => {
  switch(num) {
    case 'boy': 
      return '男孩'
    case 'girl':
      return '女孩'
    case 'unknown':
      return '不透露性别'
    default:
      break
  }
}

/**
 * 将表单值映射为模式字符串
 * @param {string} m - 表单值
 * @returns {string} 模式字符串
 */
export const convertModuleToString = (m) => {
  switch(m) {
    case 'interesting': 
      return '趣味性'
    case 'science':
      return '科普性'
    default:
      break
  }
}

/**
 * @description 本地存储数据
 * @param {*} key 本地缓存中指定的 key
 * @param {*} value 需要缓存的数据
 */
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch(e) {
    console.error(`存储指定的 ${key} 数据发生错误:`, e)
  }
}

/**
 * @description 从本地读取对应 key 的数据
 * @param {*} key
 */
export const getStorage = (key) => {
  try {
    const value = wx.getStorageSync(key)

    if (value) {
      return value
    }
  } catch(e) {
    console.error(`获取指定的 ${key} 数据发生错误:`, e)
  }
}

/**
 * @description 从本地移除指定 key 的数据
 * @param {*} key
 */
export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch(e) {
    console.error(`移除指定的 ${key} 数据发生错误:`, e)
  }
}

/**
 * @description 从本地清空全部的数据
 */
export const clearStorage = () => {
  try {
    wx.clearStorageSync()
  } catch(e) {
    console.error(`清空本地存储数据时发生错误:`, e)
  }
}

/**
 * 从字符串中提取特定键值对的值
 * @param {string} str - 包含键值对的字符串，格式为 "key1=value1,key2=value2,..."
 * @returns {Object} 包含提取结果的对象，包含 battery、volume、text、uuid 的值
 */
export const extractKeyValuePairs = (str) => {
  if (typeof str !== 'string') {
    console.error("输入的参数必须是字符串类型。");
    return null;
  }
  // 定义一个对象用于存储结果
  const result = {
    uuid: null,
    battery: null,
    volume: null,
    text: null
  };
  
  // 将字符串按逗号分割成键值对数组
  const pairs = str.split(',');

  // 遍历键值对
  for (const pair of pairs) {
    // 按等号分割键和值
    const [key, value] = pair.split('=');

    // 根据键存储对应的值
    if (key === 'uuid') {
      result.uuid = value;
    } else if (key === 'battery') {
      result.battery = value;
    } else if (key === 'volume') {
      result.volume = value;
    } else if (key === 'text') {
      result.text = value;
    }
  }

  return result;
}

/**
 * 防抖处理函数，用于限制某个函数在短时间内被频繁触发的次数
 * @param {Function} func - 需要防抖处理的函数
 * @param {number} delay - 防抖延迟时间（单位：毫秒）
 * @returns {Function} 返回防抖后的函数
 */
export const debounce = (func, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}