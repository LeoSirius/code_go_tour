import React from 'react';

import { Layout, Menu, Anchor } from 'antd';

const { Sider } = Layout;
const { Link } = Anchor;

class TOC extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    // }
  }

  componentDidMount() {

  }


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