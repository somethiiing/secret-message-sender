import React, { Component } from 'react';
import './toolbox/theme.css';
import theme from './toolbox/theme.js'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import Button from 'react-toolbox/lib/button/Button';
import Card from 'react-toolbox/lib/card/Card';
import CardActions from 'react-toolbox/lib/card/CardActions';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import Input from 'react-toolbox/lib/input/Input';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';

const datetime = new Date(2015, 10, 16);
const min_datetime = new Date(new Date(datetime).setDate(8));
datetime.setHours(17);
datetime.setMinutes(28);

class App extends Component {
  state = {
    name: '',
    message: '',
    expDate: '',
    hash: '',
    copied: false,
    tooltipTrigger: null
  };

  createHash = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  getHash = () => {
    return window.location.hash.slice(1);
  }

  newHash = () => {
    let hash = this.createHash();
    window.location.hash = `#${hash}`;
    this.setState({
      hash: hash,
      copied: false
    });
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  encrypt = () => {
    let message = {
      name: this.state.name,
      message: this.state.message,
      expDate: this.state.expDate
    };

    axios.post('http://localhost:3000/api/encrypt', {
      message: message,
      hash: this.state.hash
    })
    .then( res => {
      console.log(res.data);
    })
    .catch( err => {
      console.log(err)
    });
  }

  decrypt = () => {
    console.log('decrypt clicked');
    axios.post('http://localhost:3000/api/decrypt', {
      message: '54bfca4c914a9058318cb8445ed7028788127b195ab16117fa561108f431a4337458560abb059cdfe971d648d2dc9912f907408bf95148c83902c989eda118396d5de86fa0',
      hash: this.state.hash
    })
    .then( res => {
      console.log(res.data);
    })
    .catch( err => {
      console.log(err)
    });
  }

  showCopiedMessage = () => {
    this.setState({copied: true});
    setTimeout( () => {
      this.setState({copied: false})
    }, 2000 );
  }

  componentDidMount = () => {
    let hash = this.getHash();
    if (hash === '') {
      return this.newHash();
    }
    this.setState({hash: hash})
  }

  render() {
    return (
        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <ThemeProvider theme={theme}>
              <Card style={{width: '375px', height: '400px'}}>
                <CardTitle title="Tovia's Engima" />
                <CardTitle avatar='https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_grey_512dp.png'>
                  <Input type='text' label='Name' name='name' value={this.state.name} onChange={this.handleChange.bind(this, 'name')}  />
                </CardTitle>
                <Input type='text' multiline label='Message' hint='Type your secret message here' maxLength={120} value={this.state.message} onChange={this.handleChange.bind(this, 'message')} />
                <DatePicker label='Expiration date' sundayFirstDayOfWeek minDate={min_datetime} onChange={this.handleChange.bind(this, 'expDate')} value={this.state.expDate} />
                <CardActions>
                  <Button label='Encrypt' onClick={this.encrypt.bind(this)} />
                  <Button label='Decrypt' onClick={this.decrypt.bind(this)} />
                </CardActions>
              </Card>
          </ThemeProvider>
          <div style={{'text-align': 'center'}}>
            <br />
            <p style={{'display': 'inline'}}> Your Passphrase - </p>
            <CopyToClipboard
              text={this.state.hash}
              style={{'color': 'blue', 'cursor': 'pointer'}}
              onCopy={this.showCopiedMessage}
            >
              <span>{this.state.hash}</span>
            </CopyToClipboard>
            {this.state.copied ? <span style={{position: 'absolute', color: 'red'}}>Copied to Clipboard!</span> : null}
            <p style={{'color': 'blue', 'cursor': 'pointer'}} onClick={this.newHash}> Generate new Passphrase </p>
          </div>
        </div>
    );
  }
}

export default App;
