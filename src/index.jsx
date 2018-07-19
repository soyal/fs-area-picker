/**
 * 地理位置选择组件
 */
import React, { Component } from 'react'
import Cascader from 'antd/lib/cascader'
import 'antd/lib/cascader/style'
import PropTypes from 'prop-types'

import fetchArea from './api'

class AreaPicker extends Component {
  static propTypes = {
    level: PropTypes.number, // 几级选择 1(省) 2(市) 3(区)
    apiUrl: PropTypes.string.isRequired, // 请求地址
    /**
     * (area: Array<string>, areaId: string): void 回传相应的地理位置数组
     */
    onChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.arrayOf(PropTypes.string) // 地理位置的值 e.g ['四川省', '成都市', '武侯区']
  }

  static defaultProps = {
    value: [],
    level: 3
  }

  state = {
    options: []
  }

  provinceFetcher = null

  constructor(props) {
    super(props)

    if (!props.apiUrl) {
      throw new Error("AreaPicker need apiUrl, but you don't pass it")
    }
  }

  async getProvinces() {
    if (this.state.options.length > 0) {
      return this.state.options
    }

    if (this.provinceFetcher) return this.provinceFetcher

    return (this.provinceFetcher = this.fetchAreaInfo('', 'province', false))
  }

  /**
   * 设置完value后，拉取接口数据，填充相应的option
   * @param {Array<string>} areaValue
   */
  async initOptions(areaValue) {
    const level = this.props.level

    const province = areaValue[0]

    if (province === '中国') return

    // 找到对应的那一行
    const provinces = await this.getProvinces()
    let parentOption = provinces.find(item => {
      return item.value === province
    })

    // 已经有数据
    if (parentOption && parentOption.children) return
    for (let i = 1; i < level; i++) {
      const parentValue = areaValue[i - 1]
      if (!parentValue) break
      const value = areaValue[i]
      const type = i === 1 ? 'city' : 'district'
      const isLeaf = i === level - 1
      const list = await this.fetchAreaInfo(
        parentValue,
        type,
        isLeaf,
        parentOption
      )
      parentOption.children = list
      if (i === level - 1) break

      parentOption = list.find(item => {
        return item.value === value
      })
    }

    this.setState({
      options: provinces
    })
  }

  loadData = async selectedOptions => {
    const level = this.props.level
    const curLen = selectedOptions.length
    const targetOption = selectedOptions[curLen - 1]
    targetOption.loading = true

    let fetchType // 请求的地理位置类型
    // 点击省
    if (curLen === 1) {
      fetchType = 'city'
      // 点击市
    } else if (curLen === 2) {
      fetchType = 'district'
    }

    // 拉取相应的地理位置信息
    const children = await this.fetchAreaInfo(
      targetOption.label,
      fetchType,
      curLen === level - 1,
      targetOption
    )

    targetOption.loading = false
    targetOption.children = children
    this.setState({
      options: this.state.options
    })
  }

  async fetchAreaInfo(keyword, type, isLeaf, parentOption) {
    const { apiUrl } = this.props
    let data = await fetchArea(apiUrl, keyword, type)
    if (!data || !(data instanceof Array)) return []

    data = data.map(item => ({
      id: item.key,
      label: item.text,
      value: item.text,
      isLeaf: isLeaf
    }))

    if (type === 'province') {
      data.unshift({
        id: '54b76cd30f51d43d008b4571', // 这个是中国的id，先写死
        label: '中国',
        value: '中国',
        isLeaf: true
      })
    } else if (type === 'city') {
      data.unshift({
        id: parentOption.id,
        label: '全省',
        value: null,
        isLeaf: true
      })
    } else if (type === 'district') {
      data.unshift({
        id: parentOption.id,
        label: '全市',
        value: null,
        isLeaf: true
      })
    }

    return data
  }

  onChange = async value => {
    // 所有id,name都存在state,这里是在state上找对应中文名的地理位置id
    const { options } = this.state
    let targetOption, children
    // 这里是为了找id
    for (let name of value) {
      if (!targetOption) {
        children = options // 根节点
      }
      targetOption = children.find(option => option.value === name)
      children = targetOption.children || []
    }

    const id = (targetOption && targetOption.id) || ''
    // 去除选择了全省全市后留下的null
    const nValues = []
    value.forEach(e => {
      if (e) {
        nValues.push(e)
      }
    })

    this.props.onChange && this.props.onChange(nValues, id)
  }

  blockBubble = e => {
    e.stopPropagation()
  }

  componentDidUpdate(prevProps) {
    const oValue = prevProps.value
    const nValue = this.props.value

    if (nValue && nValue.join(',') !== oValue.join(',') && !this.isLoad) {
      this.isLoad = true
      this.initOptions(nValue)
    }
  }

  async componentDidMount() {
    const provinces = await this.getProvinces()
    this.setState({
      options: provinces
    })
  }

  render() {
    const { options } = this.state
    const { value, className, style } = this.props
    const _style = Object.assign(
      {
        display: 'flex'
      },
      style
    )

    return (
      <div className={className} style={_style} onChange={this.blockBubble}>
        <Cascader
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={this.onChange}
          loadData={this.loadData}
          placeholder="地理位置"
        />
      </div>
    )
  }
}

export default AreaPicker
