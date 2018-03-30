import React from 'react';
import {Button, Modal, Form, Input, Icon, message} from 'antd';
import {addAccount} from '../factory/interface';
const FormItem = Form.Item;

export default class AddItem extends React.Component {
  constructor (props) {
    super(props);
    if (props.addType === 'add') {
      this.state = {
        wxId: '',
        wxName: '',
        wxAccount: '',
        groupMaxCount: ''
      };
    } else if (props.addType === 'edit') {
      this.state = {
        wxId: this.props.editData.wxId,
        wxName: this.props.editData.wxName,
        wxAccount: this.props.editData.wxAccount,
        groupMaxCount: this.props.editData.groupMaxCount
      };
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.addType === 'add') {
      this.state = {
        wxId: '',
        wxName: '',
        wxAccount: '',
        groupMaxCount: ''
      };
    } else if (nextProps.addType === 'edit') {
      this.state = {
        wxId: nextProps.editData.wxId,
        wxName: nextProps.editData.wxName,
        wxAccount: nextProps.editData.wxAccount,
        groupMaxCount: nextProps.editData.groupMaxCount
      };
    }
  }
  handleSubmit = () => {
    let formEle = document.querySelector('#wxForm');
    let data = {
      wxId: formEle.wxId.value,
      wxAccount: formEle.wxAccount.value,
      wxName: formEle.wxName.value,
      groupMaxCount: formEle.groupMaxCount.value
    };
    addAccount(data).then(data => {
      if (data.data.status === 1) {
        message.success('添加成功！');
      }
      setTimeout(_ => {
        location.reload(true);
      }, 800);
    });
  };
  handleClick = () => {
    this.props.handleDisplayAdd('add');
  };
  handleWxIdChange = (e) => {
    let value = e.target.value;
    this.setState({
      wxId: value
    });
  };
  handleWxNameChange = (e) => {
    let value = e.target.value;
    this.setState({
      wxName: value
    });
  };
  handleWxAccountChange = (e) => {
    let value = e.target.value;
    this.setState({
      wxAccount: value
    });
  };
  handleGroupMaxCountChange = (e) => {
    let value = e.target.value;
    this.setState({
      groupMaxCount: value
    });
  };
  render () {
    return (
      <div>
        <Button type="primary" shape="circle" size="large" onClick={this.handleClick}>
          <Icon type="plus"></Icon>
        </Button>
        <Modal
          title='添加记录'
          onCancel={this.props.handleHideAdd}
          onOk={this.handleSubmit}
          visible={this.props.addModalVisible}>
          <Form
            id='wxForm'>
            <FormItem
              label='微信ID'
              labelCol={{span: 8}}
              wrapperCol={{span: 12}}>
              <Input type='text'
                disabled={this.props.addType === 'edit'}
                name='wxId'
                id='wxId'
                onChange={this.handleWxIdChange}
                value={this.state.wxId}></Input>
            </FormItem>
            <FormItem
              label='微信账号'
              labelCol={{span: 8}}
              wrapperCol={{span: 12}}>
              <Input type='text'
                disabled={this.props.addType === 'edit'}
                required
                onChange={this.handleWxAccountChange}
                name='wxAccount'
                id='wxAccount'
                value={this.state.wxAccount}></Input>
            </FormItem>
            <FormItem
              label='最大入群次数'
              labelCol={{span: 8}}
              wrapperCol={{span: 12}}>
              <Input type='text'
                required
                onChange={this.handleGroupMaxCountChange}
                name='groupMaxCount'
                id='groupMaxCount'
                value={this.state.groupMaxCount}></Input>
            </FormItem>
            <FormItem
              label='微信名称'
              labelCol={{span: 8}}
              wrapperCol={{span: 12}}>
              <Input type='text'
                disabled={this.props.addType === 'edit'}
                required name='wxName'
                onChange={this.handleWxNameChange}
                id='wxName'
                value={this.state.wxName}></Input>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }

};