import React, {Component} from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

class TableTestApp extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[{id:14114, name:'Said', 'class':2017 },
                            {id:14112, name:'Mohammed',class: 2017},
                            {id:16060, name:'Abdessamad', class:2019}]
                     };
    }

    handleClick = (value) => console.log(value)

    render() { 
        const columns = [{
            Header: 'Matricule',
            accessor:'id'
        },{
            Header: 'Name',
            accessor:'name'

        },{
            Header: 'Promotion',
            accessor:'class'
        },{
            id: 'button',
            sortable:false,
            filterable:false,
            width:100,
            accessor:'name',
            Cell:({value}) => <button className='btn btn-info btn-link'
            onClick={() => this.handleClick(value)}>Get Name</button>
        }];
        
        return (
            <ReactTable
                data={this.state.data}
                columns={columns}
                filterable={true}
                defaultPageSize={10}
            />
        );
    }
}
 
export default TableTestApp;