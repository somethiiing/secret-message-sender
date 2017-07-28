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


const datetime = new Date(2015, 10, 16);
const min_datetime = new Date(new Date(datetime).setDate(8));
datetime.setHours(17);
datetime.setMinutes(28);

class App extends Component {
  state = {
    name: '',
    message: '',
    expDate: ''
  };

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  encrypt = () => {
    console.log(this.state);
  }

  decrypt = () => {
    console.log(this.state);
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
              <Input type='text' multiline label='Message' maxLength={120} value={this.state.message} onChange={this.handleChange.bind(this, 'message')} />
              <DatePicker label='Expiration date' sundayFirstDayOfWeek minDate={min_datetime} onChange={this.handleChange.bind(this, 'expDate')} value={this.state.expDate} />
              <CardActions>
                <Button label='Encrypt' onClick={this.encrypt.bind(this)} />
                <Button label='Decrypt' onClick={this.decrypt.bind(this)} />
              </CardActions>
            </Card>
        </ThemeProvider>
        <div style={{'text-align': 'center'}}>
          <p> Your Passphrase - STUFF </p>
          <p> Generate new Passphrase </p>
        </div>
      </div>
    );
  }
}

export default App;
