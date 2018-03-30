import React from 'react';
import ReactDom from 'react-dom';
import moment from 'moment';
import {Radio, Select, Card, Row, Col, Button, Icon, Input, Form, DatePicker} from 'antd';
import '../less/search.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;

export default class Search extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isSearchOpen: 'searchCard',
      scanQrcodeStatusList: [],
      wxAccount: '',
      channel: 'null',
      channelType: localStorage.getItem('channel'),
      groupQrcodeStatus: ''
    };
  }
  toggleSearch = () => {
    if (this.state.isSearchOpen === 'searchCard') {
      this.setState({
        isSearchOpen: 'searchCard isSearchOpen',
      });
      this.props.toggleSearch(true);
    } else {
      this.setState({
        isSearchOpen: 'searchCard',
      });
      this.props.toggleSearch(false);
    }
  };
  handleSearch = () => {
    let params = {
      page: 1,
      size: 10,
      scanTimeStart: this.state.scanTimeStart,
      scanTimeEnd: this.state.scanTimeEnd,
      channel: this.state.channel,
      createdAtStart: this.state.createdAtStart,
      groupQrcodeStatus: this.state.groupQrcodeStatus,
      createdAtEnd: this.state.createdAtEnd,
      wxAccount: this.state.wxAccount,
      scanQrcodeStatusList: this.state.scanQrcodeStatusList
    };
    Object.keys(params).forEach((key, index, thisArr) => {
      if (!params[key] || (Array.isArray(params[key]) && params[key].length === 0 ||params[key] === 'null')) {
        delete params[key];
      }
    });
    this.props.handleSearch(params);
    this.toggleSearch();
  };
  handleCancel = () => {
    this.toggleSearch();
  };
  handleScanStartChange = (field, value) => {
    this.setState({
      scanTimeStart: value
    });
  };
  handleScanEndChange = (field, value) => {
    this.setState({
      scanTimeEnd: value
    });
  };
  handleQRinStart = (field, value) => {
    this.setState({
      createdAtStart: value
    });
  };
  handleQRinEnd = (field, value) => {
    this.setState({
      createdAtEnd: value
    });
  };
  handleStatusChange = (e) => {
    let value = e.target.value;
    if (value === 'ALL') {
      value = '';
    }
    if (value === 'SCANED') {
      this.setState({
        scanQrcodeStatusList: ["NONE", "OTHER", "EXCEED100", "NOT_FOUND", "OWNER_VERIFY", "SHARED_LEAVE", "EXPIRED", "SUCCESS"]
      });
    } else {
      this.setState({
        scanQrcodeStatusList: [],
        scanTimeEnd: null,
        scanTimeStart: null
      });
    }
    this.setState({
      groupQrcodeStatus: value
    });
  };
  /**
   * @desc 扫码失败原因的多选
   */
  handleScanResultChange = (value) => {
    this.setState({
      scanQrcodeStatusList: value
    });
  };
  handleAccountChange = (e) => {
    this.setState({
      wxAccount: e.target.value
    });
  };
  handleChannelChange = (value) => {
    this.setState({
      channel: value
    });
  };
  render() {
    return (
      <div>
        <Row>
          <Col span='2'>
            <Button className={'searchBtn ' + this.props.source} type="primary" shape="circle" size="large" onClick={this.toggleSearch}>
              <Icon type="search"></Icon>
            </Button>
            <Card title='输入搜索条件' style={{width: '500px'}} className={this.state.isSearchOpen}>
              <Form>
                <Row>
                  <FormItem label='扫码微信号'>
                    <Input name='wxAccount' id='wxAccount' type='text' onChange={this.handleAccountChange}></Input>
                  </FormItem>
                </Row>
                {
                  this.state.channelType === 'default' ?
                  (
                    <Row>
                    <FormItem label='渠道'>
                      <Select defaultValue='null' onChange={this.handleChannelChange}>
                        <Option value='null'>=========请选择渠道=========</Option>
                        <Option value='DEFAULT'>默认</Option>
                        <Option value='JIAOLONG'>蛟龙（JIAOLONG）</Option>
                      </Select>
                    </FormItem>
                  </Row>
                  ) : null
                }
                <Row style={{marginBottom: '24px'}}>
                  <Col span='12'>
                    <RadioGroup defaultValue='ALL' onChange={this.handleStatusChange}>
                      <RadioButton value='SCANED'>已扫码</RadioButton>
                      <RadioButton value='NO_SCAN'>未扫码</RadioButton>
                      <RadioButton value='ALL'>全部</RadioButton>
                    </RadioGroup>
                  </Col>
                  <Col span='12'>
                    <Select
                      multiple
                      disabled={this.state.groupQrcodeStatus !== 'SCANED'}
                      onChange={this.handleScanResultChange}
                      style={{width: '100%'}}
                      value={this.state.scanQrcodeStatusList}
                      placeholder='请选择扫码结果状态'>
                      <Option key='NONE'>未知</Option>
                      <Option key='OTHER'>其他失败原因</Option>
                      <Option key='EXCEED100'>超过100人</Option>
                      <Option key='NOT_FOUND'>群不存在</Option>
                      <Option key='OWNER_VERIFY'>群主开启验证</Option>
                      <Option key='SHARED_LEAVE'>分享二维码者已离群</Option>
                      <Option key='EXPIRED'>过期</Option>
                      <Option key='SUCCESS'>成功</Option>
                    </Select>
                  </Col>
                </Row>
                <Row>
                  <Col span='12'>
                    <FormItem
                      label='扫码开始时间'>
                      <DatePicker
                        disabled={this.state.groupQrcodeStatus !== 'SCANED'}
                        onChange={this.handleScanStartChange}
                        size='large'
                        ></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span='12'>
                    <FormItem
                      label='扫码结束时间'>
                      <DatePicker
                        disabled={this.state.groupQrcodeStatus !== 'SCANED'}
                        onChange={this.handleScanEndChange}
                        size='large'
                      ></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span='12'>
                    <FormItem
                      label='二维码入库开始时间'>
                      <DatePicker
                        onChange={this.handleQRinStart}
                        size='large'
                      ></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span='12'>
                    <FormItem
                      label='二维码入库结束时间'>
                      <DatePicker
                        onChange={this.handleQRinEnd}
                        size='large'
                      ></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
                <Row className='card-footer'>
                  <Col span='4'>
                    <Button type='primary' onClick={this.handleSearch}>搜索</Button>
                  </Col>
                  <Col span='4'>
                    <Button type='default' onClick={this.handleCancel}>取消</Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}