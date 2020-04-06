import React from 'react';
import './App.scss';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {Link, Route, Switch} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

function App() {
    return (
        <div className="App">
            <Grid
                direction="column"
                justify="space-evenly"
                alignItems="flex-start"
                className="main"
            >
                <h1>Hello and welcome to the official Tour de Shotesham website</h1>
                <Switch>
                    <Route path="/" exact>
                        <ButtonGroup size="large">
                            <Link to="signup">
                                <Button variant="contained" color="primary">
                                    Sign up!
                                </Button>
                            </Link>
                            <Link to="submit">
                                <Button variant="contained" color="secondary">
                                    Submit your time!
                                </Button>

                            </Link>
                        </ButtonGroup>
                    </Route>
                    <Route exact path="/signup" render={() => (
                        <>
                            <form noValidate autoComplete="off" className="form" method="POST" data-netlify="true">
                                <TextField id="outlined-basic" label="First Name" name="firstName" variant="outlined"
                                           className="input"/>
                                <TextField
                                    id="datetime-local"
                                    label="Next appointment"
                                    type="datetime-local"
                                    name="timePicked"
                                    defaultValue="2017-05-24T10:30"
                                    className="input"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </form>
                        </>
                    )}/>

                </Switch>


            </Grid>
        </div>
    );
}

export default App;
