
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreAddOutlined,
} from '@ant-design/icons';

import Repos from './repos';


import '../../css/admin-admin.css';

const { Footer, Sider } = Layout;

class Admin extends React.Component {
  state = {
    collapsed: false,

  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="admin-logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<AppstoreAddOutlined />}>
              Repositories
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Repos/>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Admin;