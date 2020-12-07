import React from 'react';
import { Modal, Row, Col, Input, Alert } from 'antd';

class ModalUpdateRepo extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      repoName: '',
      repoURL: '',
      errMsg: ''
    }
  }
  

  componentDidMount() {
    console.log('in mounttututut this.props = ', this.props)
    this.setState({
      repoName: this.props.repoToUpdate.name,
      repoURL: this.props.repoToUpdate.url,
    })
  }

  updateRepo = () => {
    let { repoName, repoURL } = this.state;
    this.props.updateRepo(this.props.repoToUpdate.key, repoName, repoURL);
  }

  handleNameChange = (e) => {
    this.setState({
      repoName: e.target.value,
      errMsg: '',
    })
  }

  handleRepoURLChange = (e) => {
    this.setState({
      repoURL: e.target.value,
      errMsg: '',
    })
  }

    // let {  } = this.state;
  render() {
    console.log('renrenrnernenrender')
    console.log('this.state = ', this.state)
    let { repoName, repoURL, errMsg } = this.state;
    return (
      <div>
        <Modal
          title="Update a git repository"
          visible={this.props.visible}
          onOk={this.updateRepo}
          confirmLoading={this.props.confirmLoading}
          onCancel={this.props.onCancel}
        >
        <Row>
          <Col span={3}>
            name
          </Col>
          <Col span={20}>
            <Input onChange={this.handleNameChange} value={repoName} style={{ marginBottom: '10px' }}></Input>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            url
          </Col>
          <Col span={20}>
            <Input onChange={this.handleRepoURLChange} value={repoURL} ></Input>
          </Col>
        </Row>
        {errMsg && <Alert message={errMsg} type="error" style={{marginTop: '15px'}} />}

        </Modal>
      </div>
    )
  }
}

export default ModalUpdateRepo;
