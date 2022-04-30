import React, { useContext } from 'react';
import { Upload, Space, Avatar, Button } from 'antd';
import { FaFileImage } from 'react-icons/fa';
import { Context } from './Provider';
import ImgCrop from 'antd-img-crop';
import Utils from './Utils';

const ImgUpload = props => {
  const [, dispatch] = useContext(Context);
  if (!('imgStore' in props)) {
    throw new Error('Missing imgStore property in ImgUpload');
  }
  if (!('imgSet' in props)) {
    throw new Error('Missing imgSet property in ImgUpload');
  }

  const size = props.size || 120;

  return (
    <ImgCrop
      rotate
      shape={props.round ? 'round' : 'rect'}
      beforeCrop={Utils.checkFile(dispatch, {
        types: ['image/png', 'image/jpeg'],
        size: props.imgsize || 5
      })}
    >
      <Upload
        accept='image/png,image/jpeg'
        showUploadList={false}
        beforeUpload={Utils.readFile(props.imgSet)}
      >
        <Space direction='vertical'>
          <Avatar
            src={props.imgStore}
            icon={props.icon || <FaFileImage />}
            shape={props.round ? 'circle' : 'square'}
            style={{ lineHeight: `${parseInt(size * 1.07)}px` }}
            size={size}
          />
          {props.message ? <Button>{props.message}</Button> : ''}
        </Space>
      </Upload>
    </ImgCrop>
  );
};

export default ImgUpload;
