import React from 'react';

import { Layout, Menu, Anchor } from 'antd';
import { FolderFilled } from '@ant-design/icons';
import api from '../api';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Link } = Anchor;

class TOC extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    // }
  }

  componentDidMount() {

  }

  // selectFile = (dirent) => {
  //   this.props.updateCurFilePath(dirent.path_in_repo)
  // }

  // renderTree = (direntTree) => {
  //   return direntTree.filter(item => {
  //     if (item.name[0] === '.') return false;
  //     return true;
  //   }).map(item => {
  //     if (item.is_dir) {
  //       return (
  //         <SubMenu key={item.path_in_repo} title={item.name}>
  //           {item.children && item.children.length > 0 && this.renderTree(item.children)}
  //         </SubMenu>
  //       );
  //     }
  //     return <Menu.Item
  //             key={item.path_in_repo}
  //             onClick={() => this.selectFile(item)}
  //             >{item.name}</Menu.Item>;
  //   })
  // }
  renderTOC = (toc)=> {
    return toc.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <Link href={"#"+encodeURIComponent(item.name)} title={item.name}>
            {this.renderTOC(item.children)}
          </Link>
        )
      }
      return <Link href={"#"+encodeURIComponent(item.name)} title={item.name}/>
    })
  }

  render() {
    let { toc } = this.props;
    return (
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Anchor>
            {this.renderTOC(toc)}
          </Anchor>
        </Menu>
      </Sider>
    )
  }
}

export default TOC;