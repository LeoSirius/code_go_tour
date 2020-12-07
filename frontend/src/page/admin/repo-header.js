import React from 'react';

import { Layout, notification, Button, Modal, Input, Row, Col, Alert } from 'antd';

import api from '../../api';
import util from '../../util';

const { Header } = Layout;


const MyHeader = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [repoName, setRepoName] = React.useState('');
  const [repoURL, setRepoURL] = React.useState('');
  const [errMsg, setErrMsg] = React.useState('');

  const showModal = () => {
    setVisible(true);
  };

  const handleNameChange = (e) => {
    setRepoName(e.target.value);
    setErrMsg('');
  }

  const handleRepoURLChange = (e) => {
    setRepoURL(e.target.value);
    setErrMsg('');
  }

  const addRepo = () => {
    if (repoURL === '' || repoName === '') {
      setErrMsg('name and url are required')
      return;
    }

    setConfirmLoading(true);
    api.adminAddRepo(repoName, repoURL).then(res => {
      props.addRepo(res.data);
      setVisible(false);
      setConfirmLoading(false);
      notification.success({message: 'repository added'})
    }).catch(e => {
      notification.error({message:util.getErrMsg(e)})
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };
    return (
    <Header className="site-layout-background" style={{ paddingLeft: '20px' }} >
      <Button type="primary" onClick={showModal}>
        Add
      </Button>
      <Modal
        title="Add a git repository"
        visible={visible}
        onOk={addRepo}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Row>
          <Col span={3}>
            name
          </Col>
          <Col span={20}>
            <Input onChange={handleNameChange} value={repoName} placeholder="display name" style={{ marginBottom: '10px' }}></Input>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            url
          </Col>
          <Col span={20}>
            <Input onChange={handleRepoURLChange} value={repoURL} placeholder="url of git repo"></Input>
          </Col>
        </Row>
        {errMsg && <Alert message={errMsg} type="error" style={{marginTop: '15px'}} />}
      </Modal>
    </Header>
    )
}

export default MyHeader;