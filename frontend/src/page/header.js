import React from 'react';

import { Layout, Menu } from 'antd';

const { Header } = Layout;


class MyHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { repoList } = this.props;
    return (
      <Header className="header">
        <div className="logo" />
        {repoList.length > 0 && 
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[String(repoList[0].id)]}>
            {repoList.map(repo => 
              <Menu.Item 
                key={repo.id}
                onClick={() => this.props.updateCurRepoID(repo.id)}
              >{repo.name}
              </Menu.Item>
             )}
          </Menu>
        }
      </Header>
    )
  }
}

export default MyHeader;