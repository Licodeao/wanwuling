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
 * 将数字映射为性别字符串
 * @param {string} num - 数字
 * @returns {string} 性别字符串
 */
export const convertNumToSex = (num) => {
  switch(num) {
    case '1': 
      return '男孩'
    case '2':
      return '女孩'
    case '3':
      return '不透露性别'
    default:
      break
  }
}

/**
 * 将数字映射为模式字符串
 * @param {string} m - 数字
 * @returns {string} 模式字符串
 */
export const convertModuleToString = (m) => {
  switch(m) {
    case '1': 
      return '趣味性'
    case '2':
      return '科普性'
    default:
      break
  }
}