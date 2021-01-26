import React, {Component} from "react";
import {SERVER_URL} from "../constants";
import {TextField, Button} from "@material-ui/core";
import CodeBasedLogin from "./CodeBasedLogin";
import {Snackbar} from '@material-ui/core';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username:'', password:'', credentials_valid: false, open: false}
    }

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    handleLogin = () => {
        const url = SERVER_URL + "/login";
        fetch(url, {
            method: "POST",
            headers:{
                "username" : this.state.username,
                "password" : this.state.password
            }
        })
        .then(res =>{
            if(res.status !== 200){
                this.setState({open:true});
            }else{
                this.setState({credentials_valid: true});
            }
        })
        .catch(err => console.log(err));
    };

    handleClose = () => this.setState({open:false});

    logout = () => {
        sessionStorage.removeItem('jwt');
        this.setState({credentials_valid:false});  
    };

    render() {
        if(this.state.credentials_valid){
            return (<CodeBasedLogin logout={this.logout} />);
        }else{
            const style = { width:"500",
                            paddingTop: "50px",
                            display:"flex",
                            flexDirection:"column",
                            alignItems: "center"};
            return (
                <div style = {style}>
                    <TextField name="username" placeholder="enter your username"
                            onChange={this.handleChange}/><br/>
                    <TextField name="password" placeholder="enter your password" 
                            type="password"
                            onChange={this.handleChange}/><br/>
                    <Button variant="contained" color="primary"
                            onClick={this.handleLogin}
                    >Login</Button>
                    <Snackbar
                        open={this.state.open}
                        onClose={this.handleClose}
                        autoHideDuration={2000}
                        message="Check your username and password!"
                    />
                </div>);
        }
            
    }
}
 
export default Login;