
import React from 'react';
import { Layout } from 'antd';
import MyHeader from './header';
import MySider from './sider';
import MyContent from './content';
import TOC from './toc';
import api from '../api';

const { Footer } = Layout;


class Home extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      curRepoID: 0,
      curFilePath: 'README.md',
      direntTree: [],
      toc: [],
    };
  }

  componentDidMount() {
    api.listRepos().then(res => {
      this.setState({
        repoList: res.data.repo_list,
        curRepoID: res.data.repo_list.length > 0 ? res.data.repo_list[0].id : 0,
      }, () => {
        this.updateContent();
        this.updateDirentTree();
      })
    }).catch(e => {

    });
  }

  updateContent = () => {
    let { curRepoID, curFilePath } = this.state;
    api.getRepoFile(curRepoID, curFilePath).then(res => {
      let newContent = res.data.content;
      if (!curFilePath.endsWith('.md')) {
        let tmpArr = curFilePath.split('.');
        let extention = tmpArr[tmpArr.length-1];
        newContent = "```" + extention + "\n" + newContent + "\n```";
      }
      let toc = [];
      // only render level 2 and 3
      res.data.toc.filter(item => {
        return item.level === 2 || item.level === 3;
      }).map(item => {
        if (item.level === 2) {
          let itemWithChildren = item;
          itemWithChildren.children = [];
          toc.push(itemWithChildren)
          return;
        } else if (item.level === 3) {
          toc[toc.length-1].children.push(item);
          return;
        }
      })

      this.setState({
        fileContent: newContent,
        toc: toc,
      })
    });
  }

  updateDirentTree = () => {
    let { curRepoID } = this.state;
    api.getRepoDirentTree(curRepoID).then(res => {
      this.setState({
        direntTree: res.data.dirent_tree,
      })
    });
  }

  updateCurFilePath = (newPath) => {
    console.log('in updateCurFilePath newPath = ', newPath)
    this.setState({
      curFilePath: newPath,
    }, () => {
      this.updateContent();
    })
  }

  updateCurRepoID = (newID) => {
    this.setState({
      curRepoID: newID,
    }, () => {
      this.updateContent();
      this.updateDirentTree();
    })
  }


  render () {
    let { repoList, curRepoID, fileContent, direntTree, toc } = this.state;
    return (
      <Layout>
        <MyHeader
          curRepoID={curRepoID}
          repoList={repoList}
          updateCurRepoID={this.updateCurRepoID}
        />
          <Layout>
            {curRepoID > 0 &&
              <MySider
                updateCurFilePath={this.updateCurFilePath}
                curRepoID={curRepoID}
                direntTree={direntTree}
              />
            }
            <Layout style={{ padding: '0 24px 24px' }}>
              {curRepoID > 0 &&
                <MyContent
                  fileContent={fileContent}
                />
              }
            </Layout>
            {curRepoID > 0 &&
              <TOC toc={toc}/>
            } 
          </Layout>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
      )
    }
}


export default Home;