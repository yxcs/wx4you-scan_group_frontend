import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Row, Col, Button, Icon, Radio, Form, message} from 'antd';
import Upload from '../components/upload.jsx';
import AddItem from '../components/addItem.jsx';
import Search from '../components/search.jsx';
import Info from '../components/info.jsx';
import GeneralForm from '../components/login.jsx';
import config from '../config';
import {getData, getWxAccount, deleteQrcode} from '../factory/interface';
import QRcode from 'arale-qrcode';
import md5 from 'blueimp-md5';
import '../less/index.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
let WrapperForm = Form.create()(GeneralForm);

export default class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: [],
      codeVisible: false,
      login: false,
      addModalVisible: false,
      pagination: {},
      addType: 'add',
      selected: [],
      editData: null,
      loading: true,
      isSearchOpen: false,
      source: 'scan',  // 默认读取扫码记录
      url: ''
    };
  }
  componentWillMount () {
    let params = {
      page: 1,
      size: 10
    };
    let localToken = localStorage.getItem('accessToken');
    let isLogin = false;
    config.userInfo.some(info => {
      if (localToken ===
        md5(`${Date.now() / (60 * 1000 * 20) | 0}${config.token}${info.userName}${info.password}`)) {
        localStorage.setItem('channel', info.channel);
        isLogin = true;
        return true;
      } else {
        return false;
      }
    });
    this.setState({
      login: isLogin
    });
    if (isLogin) {
      getData(params).then(data => {
        let pagination = this.state.pagination;
        pagination.total = data.data.data ? data.data.data.totalItem : 0;
        this.setState({
          loading: false,
          data: data.data.data ? data.data.data.data : null,
          pagination
        });
      });
    } else {

    }
  }
  handleTableChange = (pagination, filters, soter) => {
    const pager = this.state.pagination;
    let params = {};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
      loading: true
    });
    if (this.state.source === 'scan') {
      params = {
        page: pagination.current,
        size: 10,
        scanTimeStart: this.state.scanTimeStart,
        scanTimeEnd: this.state.scanTimeEnd,
        createdAtStart: this.state.createdAtStart,
        createdAtEnd: this.state.createdAtEnd,
        groupQrcodeStatus: this.state.groupQrcodeStatus,
        scanQrcodeStatusList: this.state.scanQrcodeStatusList,
        wxAccount: this.state.wxAccount,
        channel: this.state.channel,
        scanQrcodeStatus: this.state.scanQrcodeStatus
      };
      getData(params).then(data => {
        let pagination = this.state.pagination;
        pagination.total = data.data.data.totalItem;
        this.setState({
          loading: false,
          data: data.data.data.data,
          pagination
        });
      });
    } else if (this.state.source === 'wxAccount') {
      params = {
        page: pagination.current,
        size: 10
      };
      getWxAccount(params).then(data => {
        let pagination = this.state.pagination;
        pagination.total = data.data.data.totalItem;
        this.setState({
          data: data.data.data.data,
          loading: false,
          pagination
        });
      });
    }
  };
  handleselectedChange = (selected) => {
    this.setState({
      selected
    })
  }
  handleDelete = () => {
    let selectedData = [];
    this.state.selected.forEach(dataIndex => {
      selectedData.push(this.state.data[dataIndex].id)
    })
    deleteQrcode(selectedData)
    .then(res => {
      if (res.data.status === 1) {
        message.success('删除成功！')

        this.setState({
          loading: true
        })
        // 刷新当前页
        let pagination = this.state.pagination;
        let params = {
          page: pagination.current,
          size: 10
        }
        getData(params).then(data => {
          pagination.total = data.data.data ? data.data.data.totalItem : 0;
          this.setState({
            loading: false,
            data: data.data.data ? data.data.data.data : null,
            pagination
          });
        });
      } else {
        message.error(res.data.details)
      }
    })
  }
  handleSearch = (params) => {
    getData(params).then(data => {
      let pagination = this.state.pagination;
      pagination.current = 1;
      pagination.total = data.data.data.totalItem;
      this.setState({
        loading: false,
        data: data.data.data.data,
        pagination,
        scanTimeStart: params.scanTimeStart,
        scanTimeEnd: params.scanTimeEnd,
        createdAtStart: params.createdAtStart,
        createdAtEnd: params.createdAtEnd,
        wxAccount: params.wxAccount,
        channel: params.channel,
        scanQrcodeStatusList: params.scanQrcodeStatusList,
        groupQrcodeStatus: params.groupQrcodeStatus,
        scanQrcodeStatus: params.scanQrcodeStatus
      });
    });
  };
  largeQRcode = (qrcodeUrl) => {
    this.setState({
      codeVisible: true,
      url: qrcodeUrl
    });
  };
  handleCancel = () => {
    this.setState({
      codeVisible: false
    });
  };
  handleOk = () => {
    this.setState({
      codeVisible: false
    });
  };
  toggleSearch = (isSearchOpen) => {
    this.setState({
      isSearchOpen
    });
  };
  handleSourceChange = (e) => {
    let value = e.target.value;
    if (value === 'scan') {
      let params = {
        page: 1,
        size: 10
      };
      this.setState({
        loading: true,
        source: 'scan'
      });
      getData(params).then(data => {
        let pagination = this.state.pagination;
        pagination.total = data.data.data.totalItem;
        this.setState({
          loading: false,
          data: data.data.data.data,
          pagination
        });
      });
    } else if (value === 'wxAccount') {
      let params = {
        page: 1,
        size: 10
      };
      this.setState({
        loading: true,
        source: 'wxAccount'
      });
      getWxAccount(params).then(data => {
        let pagination = this.state.pagination;
        pagination.total = data.data.data.totalItem;
        pagination.current = 1;
        this.setState({
          data: data.data.data.data,
          loading: false,
          pagination
        });
      });
    }
  };
  handleLogin = (action) => {
    let isLogin = false;
    let localToken = localStorage.getItem('accessToken');
    config.userInfo.some(info => {
      if (localToken ===
        md5(`${Date.now() / (60 * 1000 * 20) | 0}${config.token}${info.userName}${info.password}`)) {
        localStorage.setItem('channel', info.channel);
        isLogin = true;
        return true;
      } else {
        return false;
      }
    });
    if (!isLogin) {
      if (action === 'check') {
        message.error('登录已过期，请重新登陆！');
      } else {
        message.error('账号或密码错误！');
      }
      this.setState({
        login: false
      });
    } else {
      let params = {
        page: 1,
        size: 10
      };
      message.success('登录成功！');
      this.setState({
        login: true
      });
      getData(params).then(data => {
        let pagination = this.state.pagination;
        pagination.total = data.data.data ? data.data.data.totalItem : 0;
        this.setState({
          loading: false,
          data: data.data.data.data,
          pagination
        });
      });
    }
  };
  handleHideAdd = () => {
    this.setState({
      addModalVisible: false
    });
  };
  handleLogout = () => {
    this.setState({
      login: false
    });
    localStorage.clear();
  };
  handleDisplayAdd = (type, data) => {
    if (type === 'edit') {
      this.setState({
        addType: 'edit',
        addModalVisible: true,
        editData: data
      });
    } else if (type === 'add') {
      this.setState({
        addType: 'add',
        addModalVisible: true,
        editData: null
      });
    }
  };
  getColumns = (source) => {
    let columns = null;
    if (source === 'scan') {
      columns = [{
        title: '二维码URL',
        key: 'qrcodeUrl',
        dataIndex: 'qrcodeUrl',
        onCellClick: (record, event) => {
          this.largeQRcode(record.qrcodeUrl);
        },
        render: (url, row, index) => {
          return (
            <img src={url}/>
          )
        }
      },{
        title: '群名称',
        key: 'name',
        dataIndex: 'name',
        render: (text, record, index) => {
          if (!text) {
            return '--';
          } else {
            return text;
          }
        }
      },{
        title: '渠道',
        key: 'channel',
        dataIndex: 'channel',
        render: (text, record, index) => {
          if (text === 'JIAOLONG') {
            return '蛟龙（JIAOLONG）';
          } else {
            return '默认';
          }
        }
      },{
        title: '群备注',
        key: 'remark',
        dataIndex: 'remark'
      },{
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: (text, record, index) => {
          if (text === 'SCANED') {
            return '已扫描';
          } else if (text === 'NO_SCAN') {
            return '未扫码';
          } else {
            return '--';
          }
        }
      },{
        title: '扫码者微信号',
        key: 'wxAccount',
        dataIndex: 'weixinScanRecord',
        render: (weixinScanRecord) => {
          if (weixinScanRecord) {
            return weixinScanRecord.wxAccount;
          } else {
            return '--';
          }
        }
      },{
        title: '扫码者微信名称',
        key: 'wxName',
        dataIndex: 'weixinScanRecord',
        render: (weixinScanRecord) => {
          if (weixinScanRecord) {
            return weixinScanRecord.wxName;
          } else {
            return '--';
          }
        }
      },{
        title: '扫描时间',
        key: 'scanTime',
        dataIndex: 'scanTime',
        render (text) {
          if (text) {
            let date = new Date(text);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
          } else {
            return '--';
          }
        }
      },{
        title: '扫码结果',
        key: 'weixinScanRecord',
        dataIndex: 'weixinScanRecord',
        render: (scanRecord, record, index) => {
          if (scanRecord && scanRecord.scanResult) {
            return scanRecord.scanResult;
          } else {
            return '--';
          }
        }
      }];
    } else if (source === 'wxAccount') {
      columns = [{
        title: '微信账号',
        key: 'wxAccount',
        dataIndex: 'wxAccount',
        onCellClick: (record, event) => {
          this.handleDisplayAdd('edit', record);
        },
        render: (value, record) => {
          return (
            <a>{value}</a>
          );
        }
      },{
        title: '微信ID',
        key: 'wxId',
        dataIndex: 'wxId'
      },{
        title: '微信名称',
        key: 'wxName',
        dataIndex: 'wxName'
      },{
        title: '最大成功入群数',
        key: 'groupMaxCount',
        dataIndex: 'groupMaxCount'
      },{
        title: '成功入群数',
        key: 'groupSuccessCount',
        dataIndex: 'groupSuccessCount'
      },{
        title: '总计扫描次数',
        key: 'groupScanCount',
        dataIndex: 'groupScanCount'
      },{
        title: '创建时间',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (value) => {
          let date = new Date(value);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        }
      },{
        title: '任务最近更新时间',
        key: 'updatedAt',
        dataIndex: 'updatedAt',
        render: (value) => {
          if (value) {
            let date = new Date(value);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          } else {
            return '--';
          }
        }
      }]
    }
    return columns;
  };
  render () {
    if (this.state.login) {
      return (
        <div>
          <Row>
            <Col span='18' push='3'>
              <Row>
                <header style={{
                  lineHeight: '80px',
                  background: '#333',
                  paddingLeft: '20px',
                  fontSize: '22px',
                  color: '#ccc',
                  marginBottom: '20px'}}>
                  <p>扫码结果</p>
                </header>
              </Row>
              <Row>
                <Col span='2'>
                  <Upload></Upload>
                </Col>
                <Col span='2'>
                  <AddItem
                    addType={this.state.addType}
                    editData={this.state.editData}
                    handleDisplayAdd={this.handleDisplayAdd}
                    handleHideAdd={this.handleHideAdd}
                    addModalVisible={this.state.addModalVisible}></AddItem>
                </Col>
                <Col span='2'>
                  <Search source={this.state.source}
                    handleSearch={this.handleSearch} toggleSearch={this.toggleSearch}></Search>
                </Col>
                <Col span='17'>
                  <Button icon='delete' type='danger' className={'btn-delete ' + this.props.source}
                    onClick={this.handleDelete} size='large'shape='circle' />
                </Col>
                <Col span='1'>
                  <Button title='退出登录'
                    type='default' icon='logout' shape='circle' onClick={this.handleLogout}></Button>
                </Col>
              </Row>
              <Row style={{marginTop: '24px', marginBottom: '10px'}}>
                <RadioGroup defaultValue='scan' onChange={this.handleSourceChange}>
                  <RadioButton value='scan'>扫码记录</RadioButton>
                  <RadioButton value='wxAccount'>微信账户</RadioButton>
                </RadioGroup>
              </Row>
              <Row>
                <Info
                  columns={this.getColumns(this.state.source)}
                  source={this.state.source}
                  handleTableChange={this.handleTableChange}
                  pagination={this.state.pagination}
                  loading={this.state.loading}
                  selectedChange={this.handleselectedChange}
                  data={this.state.data}></Info>
              </Row>
            </Col>
          </Row>
          <Modal
            title='扫码二维码'
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            visible={this.state.codeVisible}>
            <div id='codeWrapper' style={{textAlign: 'center'}}>
              <img src={this.state.url} style={{width: '300px'}}/>
            </div>
          </Modal>
        </div>
      );
    } else {
      return (
        <WrapperForm handleLogin={this.handleLogin}/>
      );
    }
  }
};
