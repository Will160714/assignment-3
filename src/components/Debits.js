/*==================================================
src/components/Debits.js

The Debits component contains information for Debits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import { useState } from 'react';
import {Link} from 'react-router-dom';
import AccountBalance from './AccountBalance';
import "./Card.css"

const Debits = (props) => {
  // Create the list of Debit items
  let debitsView = () => {
    const { debits } = props;
    return debits.map((debit) => {  // Extract "id", "amount", "description" and "date" properties of each debits JSON array element
      let date = debit.date.slice(0,10);
      let amount = (Math.round(debit.amount * 100) / 100).toFixed(2);
      return <li key={debit.id}>{amount} {debit.description} {date}</li>
    });
  }

  //Creating states - description and amount - for the form
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  //Adding the submission to debitList, updating the accountBalance, and resetting the form fields to blank
  const handleSubmit = (event) => {
    event.preventDefault();
    props.addDebit(description, amount);
    setDescription('');
    setAmount('');
  }

  //Updating the description field when changes are made
  const updateDescription = (event) => {
    setDescription(event.target.value);
  }

  //Updating the amount field when changes are made
  const updateAmount = (event) => {
    setAmount(event.target.value);
  }

  // Render the list of Debit items and a form to input new Debit item
  return (
    <div>
      <div class = "banner">
        <h1>Debits</h1>
      </div>

      <h1><AccountBalance accountBalance={props.balance}/></h1>
      
      <div class = "list">
        <div class = "list-items">
          {debitsView()}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" name="description" value = {description} placeholder="Description" onChange = {updateDescription}/>
        <input type="text" name="amount" value = {amount} placeholder="Amount" onChange = {updateAmount}/>
        <button type="submit">Add Debit</button>
      </form>
      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

export default Debits;