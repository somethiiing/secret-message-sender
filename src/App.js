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
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';


const apiUrl = 'https://safe-basin-56758.herokuapp.com'
const min_datetime = new Date();

class App extends Component {
  state = {
    name: '',
    message: '',
    expDate: '',
    hash: '',
    copied: false,
    dialogStatus: false,
    dialogText: '',
    dialogErrMsg: false
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
    this.setState({dialogErrMsg: false})
    let message = {
      name: this.state.name,
      message: this.state.message,
      expDate: this.state.expDate
    };

    axios.post(`${apiUrl}/api/encrypt`, {
      message: message,
      hash: this.state.hash
    })
    .then( res => {
      this.setState({dialogText: res.data});
      this.toggleDialog();
    })
    .catch( err => {
      console.log(err)
    });
  }

  decrypt = () => {
    this.setState({dialogErrMsg: false})
    axios.post(`${apiUrl}/api/decrypt`, {
      message: this.state.dialogText,
      hash: this.state.hash
    })
    .then( res => {
      if (res.data.status === 'FAILED') {
        this.setState({dialogErrMsg: true});
      } else if (res.data.status === 'SUCCESS') {
        let message = res.data.message;
        let date = message.expDate !== '' ? new Date(message.expDate) : '';
        this.setState({
          name: message.name,
          message: message.message,
          expDate: date
        });
        this.toggleDialog();
      }
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

  toggleDialog = () => {
    this.setState({dialogStatus: !this.state.dialogStatus})
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
                <Input required type='text' label='Name' name='name' value={this.state.name} onChange={this.handleChange.bind(this, 'name')}  />
              </CardTitle>
              <Input required type='text' multiline label='Message' hint='Type your secret message here' maxLength={120} value={this.state.message} onChange={this.handleChange.bind(this, 'message')} />
              <DatePicker label='Expiration date' sundayFirstDayOfWeek minDate={min_datetime} onChange={this.handleChange.bind(this, 'expDate')} value={this.state.expDate} />
              <CardActions>
                <Button label='Encrypt' onClick={this.encrypt} />
                <Button label='Decrypt' onClick={this.toggleDialog} />
              </CardActions>
            </Card>
          </ThemeProvider>
          <div style={{'textAlign': 'center'}}>
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
          <ThemeProvider theme={theme}>
            <Dialog
              actions={ [ { label: "Close", onClick: this.toggleDialog }, { label: "Decrypt", onClick: this.decrypt } ] }
              active={ this.state.dialogStatus }
              onEscKeyDown={ this.toggleDialog }
              onOverlayClick={ this.toggleDialog }
              title='De/Encrypt'
            >
              { this.state.dialogErrMsg ? <p style={{'color': 'red'}}>Message expired, invalid encrypted message, or incorrect hash. Please try again.</p> : null }
              <Input
                type='text'
                label="Encrypted Message"
                multiline
                hint="Enter your encrypted message here!"
                value={this.state.dialogText}
                onChange={this.handleChange.bind(this, 'dialogText')}
              />
            </Dialog>
          </ThemeProvider>
        </div>
    );
  }
}

export default App;
