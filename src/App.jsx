import 'date-fns'
import React, {useState,} from 'react';
import './App.scss';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {Link, Route, Switch} from "react-router-dom";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import axios from 'axios'
import CircularProgress from "@material-ui/core/CircularProgress";
import Slider from "@material-ui/core/Slider";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import SubmittedTimePicker from "react-duration-picker";

const server = axios.create({baseURL: process.env.BASE_URL})
console.log(process.env.BASE_URL)
const marks = [
    {
        value: 1,
        label: '>12',
    },
    {
        value: 2,
        label: '12-60',
    },
    {
        value: 3,
        label: '60+',
    },
];

function App() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [submittedTime, setSubmittedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date('04/11/2020'));
    const [slot, setSlot] = useState("");
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [ageCategory, setAgeCategory] = useState(1);
    const [slotTaken, setSlotTaken] = useState(false);
    const [raceNumber, setRaceNumber] = useState(null);

    const handleSetSlot = (e) => {
        setSlot(e.target.value)
        server.post("/slot", {slot: e.target.value, date: selectedDate.toLocaleDateString()})
            .then(() => {
                setSlotTaken(false)
            }).catch(() => {
            setSlotTaken(true)
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            slot: slot,
            date: selectedDate.toLocaleDateString(),
            name,
            gender,
            ageCategory

        }
        server.post("/", data).then((res) => {
            setRaceNumber(res.data.raceNumber)
        }).then(() => {
            setLoading(false)
            setError(false)
        }).catch((e) => {
            setLoading(false)
            setError(true)
        })
    }

    const handleFormUpdate = (e) => {
        e.preventDefault()
        const data = {
            submittedTime,
            raceNumber
        }
        setLoading(true)
        server.post("/submit", data)
            .then((res) => {
                setLoading(false)
                setUpdated(true)
            }).catch(() => {
            setLoading(false)
            setError(true)
        })

    }
    return (
        <div className="App">
            <Grid
                container
                direction="column"
                justify="space-evenly"
                alignItems="stretch"
                className="main"
                color="primary"
                style={{background: "white", padding: "20px", borderRadius: "20px"}}
            >
                <h1>Tour de Shotesham</h1>
                <Switch>
                    <Route path="/" exact>
                        <ButtonGroup size="large">
                            <Grid container alignItems="center" justify="center">
                                <Link to="signup">
                                    <Box component="span" m={1}>
                                        <Button variant="contained" color="primary">
                                            Sign up to race!
                                        </Button>
                                    </Box>
                                </Link>
                                <Link to="submit">
                                    <Button variant="contained" color="secondary">
                                        Submit your time!
                                    </Button>

                                </Link>
                            </Grid>
                        </ButtonGroup>
                    </Route>
                    <Route exact path="/signup">
                        <form noValidate autoComplete="off" onSubmit={handleFormSubmit}>
                            <Grid container direction="column" justify="center" alignItems="stretch">
                                <br/>
                                <TextField id="outlined-basic" label="Name" name="name"
                                           value={name}
                                           variant="outlined" onChange={(e) => setName(e.target.value)}
                                           className="input"/>
                                <br/>
                                <Divider/>
                                <br/>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        maxDate="04/19/2020"
                                        minDate="04/11/2020"
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Pick a date"
                                        format="dd/MM/yyyy"
                                        value={selectedDate}

                                        onChange={(e) => {
                                            setSelectedDate(e)
                                            setSlot("")
                                            setSlotTaken(false)
                                        }}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                                <br/>
                                <Divider/>
                                <br/>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Time Slot</InputLabel>
                                    <Select
                                        value={slot}
                                        onClose={() => setSlotTaken(false)}
                                        onChange={(e) => handleSetSlot(e)}
                                        label="Time Slot"
                                    >
                                        <MenuItem value="">
                                            <em>Please Select</em>
                                        </MenuItem>
                                        <MenuItem value="a">0800-1000</MenuItem>
                                        <MenuItem value="b">1000-1200</MenuItem>
                                        <MenuItem value="c">1200-1400</MenuItem>
                                        <MenuItem value="d">1400-1600</MenuItem>
                                        <MenuItem value="e">1600-1800</MenuItem>
                                        <MenuItem value="e">1800-2000</MenuItem>
                                    </Select>
                                </FormControl>
                                {slotTaken && <small>Unfortunately this slot is taken</small>}
                                <br/>
                                <Divider/>
                                <br/>
                                <FormControl variant="outlined">
                                    <InputLabel id="demo-simple-select-outlined-label">Gender</InputLabel>
                                    <Select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        label="Gender"
                                    >
                                        <MenuItem value="">
                                            <em>Please Select</em>
                                        </MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                                <br/>
                                <Divider/>
                                <br/>
                                <Container maxWidth="xs">
                                    <InputLabel>Age Category</InputLabel>
                                    <Slider
                                        defaultValue={1}
                                        value={ageCategory}
                                        onChange={(e, age) => setAgeCategory(age)}
                                        aria-labelledby="discrete-slider-restrict"
                                        step={1}
                                        max={3}
                                        min={1}
                                        valueLabelDisplay="auto"
                                        marks={marks}
                                    />
                                </Container>
                                <Divider/>
                                <br/>
                                <Button disabled={slotTaken} color="primary" variant="contained"
                                        type="submit">{loading ?
                                    <CircularProgress/> : "Submit"}</Button>
                                <br/>
                                <Link to="/">
                                    <Button color="secondary">Back</Button>
                                </Link>
                                {raceNumber !== null && <div><h3>Your race number is {raceNumber}</h3></div>}
                                {error && <div><h3>Whoops, something went wrong. Please contact <a
                                    href="mailto:tedburton221@gmail.com">Ted</a> and we will add you to the list</h3>
                                </div>}
                            </Grid>
                        </form>
                    </Route>
                    <Route to="/submit">
                        <form onSubmit={handleFormUpdate}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                <br/>
                                <TextField id="outlined-basic" label="Race Number" name="raceNumber"
                                           value={raceNumber}
                                           variant="outlined" onChange={(e) => setRaceNumber(e.target.value)}
                                           className="input"/>
                                <br/>
                                <Divider/>
                                <br/>
                                <SubmittedTimePicker
                                    onChange={(d) => setSubmittedTime(d)}
                                    maxHours={3}
                                />
                                <br/>
                                <Divider/>
                                <br/>
                                <Button color="primary" variant="contained" type="submit">{loading ?
                                    <CircularProgress/> : "Submit"}</Button>
                                <br/>
                                <Link to="/">
                                    <Button color="secondary">Back</Button>
                                </Link>
                                {updated && <div><h3>Congratulations on finishing the race</h3></div>}
                                {error && <div><h3>Whoops, something went wrong. Please contact <a
                                    href="mailto:tedburton221@gmail.com">Ted</a> and we will add you to the list</h3>
                                </div>}
                            </Grid>
                        </form>
                    </Route>
                </Switch>
            </Grid>
        </div>
    );
}

export default App;
