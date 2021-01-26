import React, {Component} from "react";
import {SERVER_URL} from "../constants";
import {TextField, Button} from "@material-ui/core";
import CarList from "./CarList";
import {Snackbar} from '@material-ui/core';

class CodeBasedLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {username:'', code:'', isAuthenticated: false, open:false}
    }

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    handleLogin = () => {
        const url = SERVER_URL + "/login";
        fetch(url, {
            method: "POST",
            headers:{
                "username" : this.state.username,
                "code" : this.state.code
            }
        })
        .then(res =>{
            const jwtToken = res.headers.get("Authorization");
            
            if(jwtToken != null){
                sessionStorage.setItem("jwt", jwtToken);
                this.setState({isAuthenticated: true});
            }else{
                this.setState({open:true});
            }
            
        })
        .catch(err => console.log(err));
    };

    handleClose = () => this.setState({open:false});

    render() {
        if(this.state.isAuthenticated){
            return (<CarList logout={this.props.logout} />);
        }else{
            const style = { display:'flex',flexDirection:'column',
                            alignItems:'center' };
            const h3_style = {color: 'green'};
            const p_style = { color: 'white',
                              backgroundColor:'gray',
                              borderRadius:'3px',
                              padding:'6px'
                            };

            return (
                <div style={style}>
                    <h3 style={h3_style}>Your Credentials are Valid</h3>
                    <p style={p_style}>Please Enter the 4-digit code sent to you</p><br/>
                    <TextField name="username" placeholder="enter your username"
                            onChange={this.handleChange}/><br/>
                    <TextField name="code" placeholder="enter your code" 
                            type="password"
                            onChange={this.handleChange}/><br/>
                    <Button variant="contained" color="secondary"
                            onClick={this.handleLogin}
                    >Login</Button>
                    <Snackbar
                        open={this.state.open}
                        onClose={this.handleClose}
                        autoHideDuration={2000}
                        message="Check you username or code!"
                    />
                </div>);
        }
            
    }
}
 
export default CodeBasedLogin;