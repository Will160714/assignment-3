/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';
import {Link} from 'react-router-dom';
import logo from '../src/assets/ReactLogo.png'; 
import "../src/App.css";

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }
  
  //Update debitList with the inputs from the Debit Form
  addDebit = (description, amount) => {
    //Converting amount to Number and rounding it to 2 decimal places
    const formAmount = Number(amount);
    const amountProperDigits = (Math.round(formAmount * 100) / 100).toFixed(2);

    //Getting the submission date in the format of yyyy-mm-dd
    const submissionDate = new Date();
    const year = submissionDate.getFullYear();
    const day = String(submissionDate.getDate()).padStart(2,'0');
    const month = String(submissionDate.getMonth() + 1).padStart(2,'0');
    const time = year + "-" + month + "-" + day;

    //Creating a new element for debitList
    const newSubmission = {
      id: this.state.debitList.length + 1,
      description: description,
      amount: amountProperDigits,
      date: time
    };

    //Pushing the new element with debitList
    this.setState(prevState => ({
      debitList: [...prevState.debitList, newSubmission]
    })); 

    //Updating the Balance
    const debit = -1 * amountProperDigits;
    this.updateBalance(debit);
  }

  //Updates the accountBalance based on account (negative for debit and positive for credit)
  updateBalance = (amount) => {
    this.setState(prevState => ({
      //Ensuring that the account balance is only 2 decimal places
      accountBalance: Math.round((prevState.accountBalance + amount) * 100) / 100 
    })); 
  }

  async componentDidMount(){
    // Await for promise (completion) returned from API call for Credit Card information
    try{  // Accept success response as array of JSON objects (credit card info)
      let response = await axios.get("https://johnnylaicode.github.io/api/credits.json");
      this.setState({creditList: response.data}); //Storing received data into state's creditList
      console.log(this.state.creditList);
    }

    catch(error){ // Print out errors at console when there is an error response
      if (error.response) {
        // The request was made, and the server responded with error message and status code.
        console.log(error.response.data);  // Print out error message (e.g., Not Found)
        console.log(error.response.status);  // Print out error status code (e.g., 404)
      }    
    }

    // Await for promise (completion) returned from API call for Debit Card information
    try{ // Accept success response as array of JSON objects (debit card info)
      let response = await axios.get("https://johnnylaicode.github.io/api/debits.json");
      this.setState({debitList: response.data}); //Storing received data into state's debitList
    }

    catch(error){ // Print out errors at console when there is an error response
      if (error.response) {
        // The request was made, and the server responded with error message and status code.
        console.log(error.response.data);  // Print out error message (e.g., Not Found)
        console.log(error.response.status);  // Print out error status code (e.g., 404)
      }    
    }

    //Calculating the total credit from items from the API call
    let credit = 0;
    this.state.creditList.forEach((obj) => {
      credit += obj.amount;
    });

    //Calculating the total debit from items from the API call
    let debit = 0;
    this.state.debitList.forEach((obj) => {
      debit += obj.amount;
    });

    //Setting accountBalance to the actual accountBalance based on API items
    this.setState({
      accountBalance: credit - debit
    });
  }

  // add a Credit from form to the creditList
  addCredit = (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const description = formData.get('description'); 
    const credit = Number(formData.get('amount')); 
    const amount = (credit).toFixed(2);
    const id = this.state.creditList.length+1
    
    const submissionDate = new Date();
    const year = submissionDate.getFullYear();
    const day = String(submissionDate.getDate()).padStart(2,'0');
    const month = String(submissionDate.getMonth() + 1).padStart(2,'0');

    const date = year + "-" + month + "-" + day;

    const newCredit = {id, description, amount, date}
    this.setState((prevState) => ({
      creditList: [...prevState.creditList, newCredit]
    }));
    event.target.reset();
    
    this.updateBalance(credit)
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} balance={this.state.accountBalance}/>) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} balance = {this.state.accountBalance}/>) 


    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/assignment-3/">
        <div class = "header">
          <div class = "logo-section">
            <img src = {logo} alt = "logo" class = "logo"></img>
            <h1>Bank of React</h1>
          </div>
          <div class = "navigation">
            <Link to="/" class = "nav-link">Home</Link>
            <Link to="/userProfile" class = "nav-link">User Profile</Link>
            <Link to="/login" class = "nav-link">Login</Link>
          </div>
        </div>
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;