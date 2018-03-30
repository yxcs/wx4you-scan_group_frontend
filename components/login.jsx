import React from 'react';
import {Card, Form, Icon, Button, Input} from 'antd';
import md5 from 'blueimp-md5';
import config from '../config';
import '../less/login.less';
const FormItem = Form.Item;

export default class GeneralForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          userName: values.userName,
          password: values.password
        });
        localStorage.setItem('accessToken', md5(`${Date.now() / (60 * 1000 * 20) | 0}${config.token}${values.userName}${values.password}`));
        console.log(localStorage.getItem('accessToken'));
        this.props.handleLogin();
      } else {
        console.log(err);
      }
    });
  };
  render () {
    const {getFieldDecorator} = this.props.form;
    let userName = getFieldDecorator('userName', {
      rules: [{required: true, message: '用户名不能为空'}]
    })(
      <Input
        prefix={<Icon type='user'></Icon>}
        style={{fontSize: 13}}
        type='text'
        placeholder='请输入用户名'></Input>
    );
    let password = getFieldDecorator('password', {
      rules: [{required: true, message: '密码不能为空'}]
    })(
      <Input
        prefix={<Icon type='lock'></Icon>}
        style={{fontSize: 13}}
        type='password'
        placeholder='请输入密码'></Input>
    );
    return (
      <div>
        <Card className='login-card'>
          <div className='login-form'>
            <Form onSubmit={this.handleSubmit}>
              <FormItem className='login-icon'>
                <Icon type='desktop' className='login-logo'></Icon>
              </FormItem>
              <FormItem>
                {userName}
              </FormItem>
              <FormItem>
                {password}
              </FormItem>
              <FormItem>
                <Button htmlType='submit' type='primary' className='login-button'>登录</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}