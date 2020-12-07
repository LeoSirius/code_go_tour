import React from 'react';
import { Table, Space, Layout, notification } from 'antd';
import RepoHeader from './repo-header';

import AdminRepo from '../../models/admin-repo';
import ModalUpdateRepo from './moddal-update-repo';
import api from '../../api';
import util from '../../util';

const { Column } = Table;
const { Content } = Layout;


class Repos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      isShowUpdateRepo: false,
      modalUpdateConfirmLoading: false,
      repoToUpdate: null,
    };
  }

  componentDidMount() {
    api.adminListRepos(0,0).then(res => {
      this.setState({
        repoList: res.data.repo_list.map(item => new AdminRepo(item)),
      })
    }).catch(e => {
      notification.error({message: util.getErrMsg(e)});
    })
  }


  addRepo = (repo) => {
    this.setState({repoList: [...this.state.repoList, new AdminRepo(repo)]});
  }

  deleteRepo = (repo) => {
    api.adminDeleteRepo(repo.key).then(res => {
      let newRepoList = this.state.repoList.filter(item => item.key !== repo.key);
      this.setState({
        repoList: newRepoList,
      })
      notification.success({message: 'repository deleted'});
    }).catch(e => {
      console.log(e)
      notification.error({message: util.getErrMsg(e)});
    })
  }

  updateRepo = (id, name, url) => {
    api.adminUpdateRepo(id, name, url).then(res => {
      let newRepo = new AdminRepo(res.data);
      let repos = [...this.state.repoList];
      repos.forEach(repo => {
        if (repo.key === id) {
          repo.name = newRepo.name;
          repo.url = newRepo.url;
        }
      })
      this.setState({
        repoList:repos,
        isShowUpdateRepo: false,
        modalUpdateConfirmLoading: false,
      })
      notification.success({message: 'repository updated'});


    }).catch(e => {
      notification.error({message: util.getErrMsg(e)});
    });
  }

  cancelUpdateModal = () => {
    console.log('in cancal')
    this.setState({isShowUpdateRepo: false});
  }
  showModalUpdateRepo = (repo) => {
    this.setState({
      repoToUpdate: repo,
    }, () => {
      this.setState({
        isShowUpdateRepo: true,
      })
    });
  }

  render () {
    let { repoList, isShowUpdateRepo, modalUpdateConfirmLoading, repoToUpdate } = this.state;
    return (
      <div>
        <RepoHeader
          addRepo={this.addRepo}
        />
        <Content style={{ margin: '0 16px', paddingTop: '20px' }}>
          <Table dataSource={repoList} pagination={false}>
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="URL" dataIndex="url" key="url" />
            <Column
              title="Action"
              key="action"
              render={(repo, record) => {
                return (
                <Space size="middle" key={repo.key}>
                  <a onClick={() => this.showModalUpdateRepo(repo)}>Update</a>
                  <a onClick={() => this.deleteRepo(repo)}>Delete</a>
                </Space>)
              }}
            />
          </Table>
        </Content>
        {isShowUpdateRepo &&
          <ModalUpdateRepo
            visible={isShowUpdateRepo}
            updateRepo={this.updateRepo}
            confirmLoading={modalUpdateConfirmLoading}
            onCancel={this.cancelUpdateModal}
            repoToUpdate={repoToUpdate}
          ></ModalUpdateRepo>
        }
      </div>
    )
  }
}

export default Repos;
