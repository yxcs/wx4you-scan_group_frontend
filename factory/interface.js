import axios from 'axios';
import config from '../config';

// formData 上传
export function upload (state, callback) {
  let request = new XMLHttpRequest();
  let formData = new FormData(state.formEle);
  let localChannel = localStorage.getItem('channel');
  if (localChannel !== 'default') {
    formData.append('channel', localChannel);
  } else if (state.channel !== 'null') {
    formData.append('channel', state.channel);
  }
  request.open('POST', `${config.host}:${config.port}/scanqrcode/uploadQrcodeExcel`);
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      callback(request);
    }
  }
  request.send(formData);
}

export function addAccount (data) {
  let localChannel = localStorage.getItem('channel');
  if (localChannel !== 'default' && !data.channel) {
    data.channel = localChannel;
  }
  return axios({
    method: 'POST',
    url: `${config.host}:${config.port}/account/saveWeiXinAccount`,
    data
  });
}

export function getData (data) {
  let localChannel = localStorage.getItem('channel');
  if (localChannel !== 'default' && !data.channel) {
    data.channel = localChannel;
  }
  data.page--;
  return axios({
    method: 'POST',
    url: `${config.host}:${config.port}/scanqrcode/searchScanQrcode`,
    data
  });
}

export function getWxAccount (data) {
  let localChannel = localStorage.getItem('channel');
  if (localChannel !== 'default' && !data.channel) {
    data.channel = localChannel;
  }
  data.page--;
  return axios({
    method: 'POST',
    url: `${config.host}:${config.port}/account/getList`,
    data
  });
}

export function deleteQrcode (idList) {
  return axios({
    method: 'POST',
    url: `${config.host}:${config.port}/qrcode/delete`,
    data: {
      idList
    }
  })
}
