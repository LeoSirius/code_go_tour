
import React from 'react';
import { Layout, Menu } from 'antd';
import Home from './page/home';

import Admin from './page/admin/admin';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      route: window.location.pathname
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.pathname
      })
    })
  }

  render () {
    console.log("this.staete = ", this.state)
    let Child;
    switch (this.state.route) {
      case '/': Child = Home; break;
      case '/admin': Child = Admin; break;
      default:      Child = Home;
    }

    return (
      <div className="App">
        <Child/>
      </div>
    );
  }
}

export default App;
