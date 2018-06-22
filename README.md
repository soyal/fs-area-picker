## fs-area-picker
地理位置选择组件

## Props
* apiUrl: required, 接口url地址, 如 https://example.com/api/area
* value: Array<string>, e.g ['四川省', '成都市', '武侯区']
* onChange: (areaNames: Array<string>, areaId: string): void 回传选择的行政区域名字数组和最后一个行政区域的areaId
* level: number, 组件为几级，1(省) 2(市) 3(区), default: 3