import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
// import remark from 'react-markdown';
// import toc from 'remark-toc';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import api from '../api';

// var remark = require('remark');
// var toc = require('remark-toc');

import '../../src/css/markdown/github-markdown.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;



class MyContent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  flatten = (text, child) => {
    return typeof child === 'string'
      ? text + child
      : React.Children.toArray(child.props.children).reduce(this.flatten, text)
  }
  
  HeadingRenderer = (props) => {
    var children = React.Children.toArray(props.children)
    var text = children.reduce(this.flatten, '')
    let slug = encodeURIComponent(text);
    return React.createElement('h' + props.level, {id: slug}, props.children)
  }

  render() {
    let { fileContent } = this.props;
    // let { fileContent } = this.state;
    
    return (
      <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: window.innerHeight,
        backgroundColor: "white",
      }}
    >
      <ReactMarkdown className="markdown-body"
        source={fileContent}
        plugins={[gfm]}
        renderers={{
          heading: this.HeadingRenderer,
          code: ({language, value}) => {
            return <SyntaxHighlighter
                    style={a11yDark}
                    language={language}
                    children={value}
                    showLineNumbers={true}
                    showInlineLineNumbers={true}
                   />
          }
        }}
      />
    </Content>
    )
  }
}

export default MyContent;