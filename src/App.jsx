import 'date-fns'
import React, {useEffect, useState,} from 'react';
import './App.scss';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {Link, Route, Switch, useHistory} from "react-router-dom";
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
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

const server = axios.create({baseURL: process.env.REACT_APP_BASE_URL})
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

const slotsMap = {
    a: "0800-1000",
    b: "1000-1200",
    c: "1200-1400",
    d: "1400-1600",
    e: "1600-1800",
    f: "1800-2000"
}

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
    const [raceNumber, setRaceNumber] = useState(null);
    const [allSlots, setAllSlots] = useState([]);
    const [showSlots, setShowSlots] = useState(false);

    const history = useHistory()
    useEffect(() => {
        server.get("/slot").then((result) => {
            console.log(result)
            setAllSlots(result.data.result)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    const handleSetSlot = (e) => {
        setSlot(e.target.value)
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
            server.get("/slot").then((result) => {
                console.log(result)
                setAllSlots(result.data.result)
                setLoading(false)
                setError(false)
                history.push('/slots')
            }).catch((error) => {
                console.log(error)
            })
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
                <h1><i>Pre-Tour</i> de Shotesham</h1>
                <Switch>

                    <Route exact path="/">
                        <ButtonGroup size="large">
                            <Grid container alignItems="center" justify="center">
                                <Link to="/signup">
                                    <Box component="span" m={1}>
                                        <Button variant="contained" color="primary" className="mainButton">
                                            Sign up to race!
                                        </Button>
                                    </Box>
                                </Link>
                                <Link to="/enter">
                                    <Button variant="contained" color="secondary">
                                        Submit your time!
                                    </Button>

                                </Link>
                                <Link to="/slots">
                                    <Button variant="contained" color="tertiary">
                                        Taken Slots
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
                                <Button color="primary" variant="contained" onClick={() => setShowSlots(!showSlots)}>Show
                                    taken
                                    Slots</Button>
                                <br/>
                                <TableContainer component={Paper} hidden={!showSlots}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Race Number</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Slot Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allSlots.map((slot, i) => (
                                                <TableRow key={slot.raceNumber}>
                                                    <TableCell component="th" scope="row">
                                                        {slot.raceNumber}
                                                    </TableCell>
                                                    <TableCell>{slot.date}</TableCell>
                                                    <TableCell>{slotsMap[slot.slot]}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
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
                                <Button color="primary" variant="contained"
                                        type="submit">{loading ?
                                    <CircularProgress/> : "Submit"}</Button>
                                <br/>
                                <Link to="/">
                                    <Button color="secondary">Back</Button>
                                </Link>
                                {error && <div><h3>Whoops, something went wrong. Please contact <a
                                    href="mailto:tedburton221@gmail.com">Ted</a> and we will add you to the list</h3>
                                </div>}
                            </Grid>
                        </form>
                    </Route>
                    <Route exact path="/enter">
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
                    <Route exact path="/slots">
                        {raceNumber !== null && <div><h1>Your race number is {raceNumber}</h1></div>}
                        <TableContainer component={Paper} style={{maxHeight: "600px"}}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Race Number</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Slot Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allSlots.map((slot, i) => (
                                        <TableRow key={slot.raceNumber}>
                                            <TableCell>{slot.name}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {slot.raceNumber}
                                            </TableCell>
                                            <TableCell>{slot.date}</TableCell>
                                            <TableCell>{slotsMap[slot.slot]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Link to="/">
                            <Button color="secondary">Back</Button>
                        </Link>
                    </Route>

                </Switch>
            </Grid>
        </div>
    );
}

export default App;
