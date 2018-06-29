import React, { Component } from 'react'
import AreaPicker from '../src'

const apiUrl = 'https://restapi-test1.fishsaying.com/sso/area/query'
class BaseDemo extends Component {
  state = {
    area: ['四川省', '成都市', '武侯区']
  }

  onChange = (names, areaId) => {
    this.setState({
      area: names
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        area: ['贵州省', '六盘水市', '六枝特区']
      })
    }, 1000)
  }

  render() {
    return (
      <div>
        <h3>基础示例</h3>
        <AreaPicker
          apiUrl={apiUrl}
          onChange={this.onChange}
          value={this.state.area}
          style={{
            width: '500px'
          }}
        />
      </div>
    )
  }
}

export default BaseDemo
