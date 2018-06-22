import React, { Component } from 'react'
import AreaPicker from '../src'

const apiUrl = 'https://restapi-test1.fishsaying.com/sso/area/query'
class BaseDemo extends Component {
  state = {
    area: []
  }

  onChange = (names, areaId) => {
    this.setState({
      area: names
    })
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
