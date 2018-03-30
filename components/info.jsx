import React from 'react';
import ReactDom from 'react-dom';
import createFragment from 'react-addons-create-fragment';
import {Table} from 'antd';
import {getData} from '../factory/interface';
import QRcode from 'arale-qrcode';

export default class Info extends React.Component {
  constructor (props) {
    super(props);
  }
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.props.selectedChange(selectedRowKeys);
    }
  }
  render() {
    return (
      <div>
        <Table
          rowSelection={
            this.props.source === 'scan' ?
              this.rowSelection :
              null
          }
          columns={this.props.columns}
          dataSource={this.props.data}
          pagination={this.props.pagination}
          loading={this.props.loading}
          onChange={this.props.handleTableChange}></Table>
      </div>
    );
  }
}