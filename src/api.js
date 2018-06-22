import axios from 'axios'

/**
 * 获取行政区域的子行政区域信息
 * @param {String} areaName 父行政区域名称或者adcode
 * @param {String} type 要展示的类型 province || city || district
 */
export default async function fetchArea(url, areaName = '', type) {
  const typeArr = ['province', 'city', 'district']
  const index = typeArr.indexOf(type)

  const params = { type }

  // 推测areaName属于哪一级，如果type为district则areaName指的是city名字
  if (index > 0) {
    const parentType = typeArr[index - 1]
    params[parentType] = areaName
  }

  let data = await axios({
    url,
    method: 'get',
    params
  })
  if (data.config && data.headers && data.status) {
    data = data.data
  }

  return data.map(item => {
    const name = item[type] || item.name
    return {
      text: name,
      key: item.id
    }
  })
}
