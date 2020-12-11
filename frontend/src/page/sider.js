import React from 'react';

import { Layout, Menu, Breadcrumb } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class MySider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      direntTree: [],
    }
  }

  componentDidMount() {

  }

  selectFile = (dirent) => {
    this.props.updateCurFilePath(dirent.path_in_repo)
  }

  renderTree = (direntTree) => {
    return direntTree.filter(item => {
      if (item.name[0] === '.') return false;
      return true;
    }).map(item => {
      if (item.is_dir) {
        return (
          <SubMenu key={item.path_in_repo} title={item.name}>
            {item.children && item.children.length > 0 && this.renderTree(item.children)}
          </SubMenu>
        );
      }
      return <Menu.Item
              key={item.path_in_repo}
              onClick={() => this.selectFile(item)}
              >{item.name}</Menu.Item>;
    })
  }

  render() {
    let { direntTree } = this.props;
    console.log('direntTree = ', direntTree)
    return (
      <Sider width={300} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          {direntTree.length > 0 && this.renderTree(direntTree)}
        </Menu>
      </Sider>
    )
  }
}

export default MySider;