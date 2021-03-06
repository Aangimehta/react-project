import React , {Fragment, Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Header from './HeaderComponent';
import axios from 'axios';
import Cookie from 'js-cookie';
import history from './history';
import {Link} from 'react-router-dom';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000/">
        localhost:3000
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default class ForgetPassword extends Component {
    constructor(props){
        super(props);
        const useStyles = makeStyles((theme) => ({
            paper: {
              marginTop: theme.spacing(8),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
            avatar: {
              margin: theme.spacing(1),
              backgroundColor: theme.palette.secondary.main,
            },
            form: {
              width: '100%', // Fix IE 11 issue.
              marginTop: theme.spacing(1),
            },
            submit: {
              margin: theme.spacing(3, 0, 2),
            },
          }));
        this.state = {
            classes : useStyles,
            email : "",
            password : "",
            emailErrorText : "",
            passwordErrorFlag: false,
            emailErrorFlag : false,
            passwordErrorText : "",
            submitError:"none",
            submitErrorText:"",
            submitSuccess:"none",
            submitSuccessText:""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
      let activeUser = Cookie.getJSON("activeUser");
      if(activeUser){
          history.push('/dashboard');
      }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        this.validate(name,value);
        
    }

    handleSubmit = (event) => {
        
        event.preventDefault();
        this.setState({
          submitError:"none",
          submitErrorText:"",
          submitSuccess:"none",
          submitSuccessText:""
        });
        
        if(!(this.state.emailErrorFlag || this.state.passwordErrorFlag)) {
            this.setState({
                submitError : "none"
            })
            console.log("username",this.state.email);
            const args = {
                login:this.state.email,
              }
            var url = 'https://wp.fmv.cc/wpdemo/wp-json/react/forget-password/';
            
            axios.post (url,args)
              .then((response) => {
                console.log(response);
                if(response.data.code===200) {

                  this.setState({
                    submitSuccess : "block",
                    submitSuccessText : response.data.message
                })
                    
                } else {
                    this.setState({
                        submitError : "block",
                        submitErrorText : response.data.message
                    })
                }
              })
              .catch( (error) => {
                this.setState({
                    submitError : "block",
                    submitErrorText : "Server Unreachable"
                })
              });

        } else {
            this.setState({
                submitError : "block"
            })
        }

    }

    validate(caller,value) {    
        if(caller==="email") {
            let email = value;
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(email)) {
                this.setState({
                    emailErrorFlag :  true,
                    emailErrorText : "Please enter valid email addressed"
                });
            } else {
                this.setState({
                    emailErrorFlag : false,
                    emailErrorText : ""
                });
                
            }
        }
    }

    render(){
        return (
                <Fragment>
                    <Header />
                <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={this.state.classes.paper}>
                    <Avatar className={this.state.classes.avatar}>
                    <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Reset Password
                    </Typography>
                    <form className={this.state.classes.form} noValidate autoComplete="false" onSubmit={this.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        error={this.state.emailErrorFlag}
                        helperText={this.state.emailErrorText}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={this.state.classes.submit}
                    >
                        Send Email
                    </Button>
                    <div class="alert alert-danger" style={{display:this.state.submitError}} role="alert">
                        {this.state.submitErrorText}
                    </div>
                    <div class="alert alert-success" style={{display:this.state.submitSuccess}} role="alert">
                        {this.state.submitSuccessText}
                    </div>
                    <Grid container>
                        <Grid item xs>
                        <Link to="/signin" variant="body2">
                            Already have an account? SignIn
                        </Link>
                        </Grid>
                        <Grid item>
                        <Link to="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                        </Grid>
                    </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
                </Container>
                </Fragment>       
            
        );
    }
}