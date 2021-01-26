import React, {Component} from 'react'; 
import {SERVER_URL} from '../constants';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import AddCar from './AddCar';
//import { toast } from 'react-toastify';
//import {ToastContainer} from 'react-toastify';
import {CSVLink} from 'react-csv';
import {Button, Grid} from '@material-ui/core';

import {Snackbar} from '@material-ui/core';

class CarList extends Component {
    constructor(props) {
        super(props);
        this.state = {cars: [], open:false, message:''};
    }

    fetchCars = () =>{
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL+'/api/cars',{
            headers:{
                "Authorization" : token
            }
        })
        .then((response) => response.json())
        .then((responseData) => this.setState({cars: responseData._embedded.cars}))
        .catch(err => console.error(err));
    };

    addCar = (car) => {
        const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/api/cars',
            { method: 'POST',
              headers: {
                  'Content-Type' : 'application/json',
                  'Authorization': token
                },
              body: JSON.stringify(car)
            }
        )
        .then( result  => this.fetchCars())
        .catch(err => console.log('Can\'t add the new car! ' + err));

    };

    renderEditable = (cellInfo) => {
        return(
            <div
                contentEditable
                suppressContentEditableWarning
                
                onBlur = { e =>{
                        const data = [...this.state.cars];
                        data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                        this.setState({cars: data});
                    } 
                }
                
                dangerouslySetInnerHTML = {
                    {__html:this.state.cars[cellInfo.index][cellInfo.column.id]}
                }

                style = {{backgroundColor: '#fafafa'}}
            />
        );
    };

    componentDidMount() {
        this.fetchCars();
    }
        
    deleteCar = (link) =>{

        const token = sessionStorage.getItem("jwt");

        fetch(link, {
            method: 'DELETE',
            headers:{
                'Authorization': token
            }
        })
        .then(result => {
            this.fetchCars(); // update the car list
            this.setState({open:true, message:'Car deleted.'});
        })
        .catch(err => this.setState({open:true, message:'Updating failed.'}));
    };

    updateCar = (link, car) =>{
        
        const token = sessionStorage.getItem("jwt");

        fetch(link,{
            method:'PUT',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization' : token 
            },
            body:JSON.stringify(car)
        })
        .then(result => this.setState({open:true, message:'Car updated.'}))
        .catch(err => this.setState({open:true, message:'Deletion failed!'}));
    };

    handleClose = () => this.setState({open:false});

    handleLogout = () => {
        this.props.logout();
    };

    render() { 
        const columns = [{
            Header: 'Brand',
            accessor:'brand',
            Cell: this.renderEditable
        },{
            Header: 'Model',
            accessor:'model',
            Cell: this.renderEditable
        },{
            Header: 'Color',
            accessor:'color',
            Cell: this.renderEditable
        },{
            Header: 'Year',
            accessor:'year',
            Cell: this.renderEditable
        },{
            Header: 'Price',
            accessor: 'price',
            Cell: this.renderEditable
        },{
            id: 'updateButton',
            sortable:false,
            filterable:false,
            width:100,
            accessor:'_links.self.href',
            Cell:({value, row}) => <Button size='small' variant='text' color='primary' className='btn btn-info btn-link'
            onClick={() => this.updateCar(value, row)}>Update</Button>
        },{
            id: 'delButton',
            sortable:false,
            filterable:false,
            width:100,
            accessor:'_links.self.href',
            Cell:({value}) => <Button size='small' variant='text' color='secondary' className='btn btn-info btn-link'
            onClick={() => this.deleteCar(value)}>Delete</Button>
        }];

        return (<div>
            <Grid container>
                <Grid item>
                    <AddCar addCar={this.addCar} />
                </Grid>
                <Grid item style={{padding:'20px', textDecoration:'none'}}>
                    <CSVLink data={this.state.cars} separator=';'>Export into CSV file</CSVLink>
                </Grid>
                <Grid item style={{padding:'20px'}}>
                    <Button variant='contained'
                            color='secondary'
                            onClick={this.handleLogout}>
                        Logout
                    </Button>
                </Grid>
            </Grid>

            <ReactTable 
                data={this.state.cars}
                columns={columns}
                filterable={true}
                defaultPageSize={5}
            />
            <Snackbar
                style = {{width:'300', color:'green'}}
                open = {this.state.open}
                onClose = {this.handleClose}
                autoHideDuration = {1500}
                message = {this.state.message}
            />
        </div>);
    }
}
 
export default CarList;