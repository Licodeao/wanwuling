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
    case 'no_gender':
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