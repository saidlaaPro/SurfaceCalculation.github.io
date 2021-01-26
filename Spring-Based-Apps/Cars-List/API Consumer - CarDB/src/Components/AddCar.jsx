import React, {Component} from 'react';
import SkyLight from 'react-skylight';
import {Button, TextField} from '@material-ui/core';

class AddCar extends Component {
    constructor(props) {
        super(props);
        this.state = {brand:'', model:'', color:'', year:'', price:''}
    }

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});
    
    handleSave = (e) => {
        e.preventDefault();

        const newCar = {brand: this.state.brand,
                        model: this.state.model,
                        color: this.state.color,
                        year:  this.state.year,
                        price: this.state.price
                       };

        this.props.addCar(newCar);
        this.refs.addDialog.hide();
    };

    handleCancel = (e) =>{
        e.preventDefault();
        this.refs.addDialog.hide();
    };
    
    render() { 
        return ( <div>
            <SkyLight hideOnOverlayClicked ref='addDialog'>
                <h3>Add a new car</h3>
                <form>
                    <TextField label='Brand' placeholder='Brand' name='brand' onChange={this.handleChange}/><br/>
                    <TextField label='Model' placeholder='Model' name='model' onChange={this.handleChange}/><br/>
                    <TextField label='Color' placeholder='Color' name='color' onChange={this.handleChange}/><br/>
                    <TextField label='Year' placeholder='Year'  name='year'  onChange={this.handleChange}/><br/>
                    <TextField label='Price' placeholder='Price' name='price' onChange={this.handleChange}/><br/>
                    <div>
                        <Button variant='outlined' color='primary' onClick={this.handleSave} style={{minWidth:'92px'}}> Save </Button>
                        <Button variant='outlined' color='secondary' onClick={this.handleCancel}>Cancel</Button>
                    </div>
                </form>
            </SkyLight>
            <Button variant='contained' color='primary' onClick={() => this.refs.addDialog.show()}
                    style={{margin: '10px'}}            
            >
                Add New Car
            </Button>
        </div> );
    }
}
 
export default AddCar;