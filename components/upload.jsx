import React from 'react';
import ReactDom from 'react-dom';
import {Select, Button, Icon, Modal, Form, Input, Row, Col} from 'antd';
import {upload} from '../factory/interface';
import config from '../config';
const FormItem = Form.Item;
const Option = Select.Option;
export default class Upload extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalVisible: false,
      uploadBtn: 'cloud-upload',
      formEle: null,
      channel: 'null',
      channelType: localStorage.getItem('channel'),
      uploadFilePath: `${config.host}:${config.port}/scanqrcode/uploadQrcodeExcel`
    };
  }
  handleaddFile () {
    document.querySelector('#input').click();
  }
  openModal = () => {
    this.setState({
      modalVisible: true
    });
  };
  handleOk = () => {
    let formData = new FormData();
    this.setState({
      uploadBtn: 'loading'
    });
    upload(this.state, (response) => {
      let data = JSON.parse(response.response);
      this.setState({
          uploadBtn: 'cloud-upload'
      });
      if (data.status === 1) {
        this.setState({
          filename: `${this.state.originFileName}
          成功：${data.data.successCount}条
          失败：${data.data.failureCount}条
          重复：${data.data.repeatCount}条`
        });
        setTimeout(() => {
          location.reload(true);
        }, 3000);
      } else {
        this.setState({
          filename: `${this.state.originFileName}
          上传失败：${data.msg} ${data.details}`
        });
      }
    });
    // 开始上传文件
  };
  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  };
  handleChange = (e) => {
    let formEle = document.querySelector('#form');
    this.setState({
      formEle,
      originFileName: new FormData(formEle).get('file').name,
      filename: new FormData(formEle).get('file').name
    });
  };
  handleChannelChange = (value) => {
    if (value === 'null') {
      this.setState({
        channel: null
      });
    } else {
      this.setState({
        channel: value
      });
    }

  };
  render () {
    return (
      <div>
        <Button type='primary' shape='circle' size='large' onClick={this.openModal}>
          <Icon type='upload'></Icon>
        </Button>
        <Modal
          title='上传扫码记录的EXCEL表格'
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <p style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px'}}
          >{this.state.filename}</p>
          <Row style={{textAlign: 'center'}}>
              <Button type='primary' size='large' onClick={this.handleaddFile}>
                <Icon type={this.state.uploadBtn} />
              </Button>
          </Row>
          <Form
            onSubmit={this.handleSubmit}
            id='form'
            action={this.state.uploadFilePath}
            method='post'
            encType='multipart/form-data'
            >
            {
              this.state.channelType === 'default' ?
              (
                <FormItem
                  label='渠道'
                  labelCol={{span: 6}}
                  style={{marginTop: '24px', marginBottom: 0}}
                  wrapperCol={{span: 12}}>
                  <Select defaultValue='null' name='channel' onChange={this.handleChannelChange}>
                    <Option value='null'>=========请选择渠道=========</Option>
                    <Option value='DEFAULT'>默认</Option>
                    <Option value='JIAOLONG'>蛟龙（JIAOLONG）</Option>
                  </Select>
                </FormItem>
              ) : null
            }
            <FormItem
              style={{display: 'none'}}
            ><Input type='file' name='file' id='input'
                onChange={this.handleChange}></Input>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
};
