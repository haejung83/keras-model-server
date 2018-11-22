import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import axios from 'axios'
import ResultIndicator from './ResultIndicator'
import LocalVideo from './ReactLocalVideo'
import MatchingTable from './MatchingTable'
import { PREFERENCE_KEYS } from './AppPreference'

//import { Table } from 'react-bootstrap';
import './VideoIntervalCapture.css';


const styles = theme => ({
    root: {
        width: 500,
        margin: theme.spacing.unit,
        overflowX: 'auto',
    },
    table: {
        minWidth: 200,
    },
    cell: {
        textAlign: 'center',
        fontSize: 13,
    },
    passedCell: {
        textAlign: 'center',
        fontSize: 13,
        backgroundColor: '#5F5'
    },
    failedCell: {
        textAlign: 'center',
        fontSize: 13,
        backgroundColor: '#F55'
    },
    divider: {
        width: 500,
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
});


class VideoIntervalCapture extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props)
        this.state = {
            matchingTable: null,
            predictResult: [],
            interval: localStorage.getItem(PREFERENCE_KEYS[1]),
            isStarted: false
        }
    }

    setVideoRef = (video) => {
        this.video = video;
    }

    setResultIndicatorRef = (resultIndicator) => {
        this.resultIndicator = resultIndicator;
    }

    handlePlayerEvent = (evtType) => {
        // For debugging
        // console.log(evtType);
    }

    clearResult = () => {
        this.setState({ predictResult: [] });
    }

    appendResult = (result) => {
        let predictResult = this.state.predictResult;
        predictResult.push(result);
        this.setState({ predictResult: predictResult})
    }

    handleMatchingTableSelected = () => {
        console.log("handleMatchingTableSelected()");
        let selectedFile = this.matchingInput.files[0];

        var loadedTable = new MatchingTable();
        loadedTable.loadFromFile(selectedFile, () => {
            this.setState({ matchingTable: loadedTable })
        });
    }

    run = () => {
        // Clear result array
        this.clearResult();
        // Run with loaded matching table
        this.predictWithTableIndex(0);
    }

    // This is arrow function. So it working like closures.
    predictWithTableIndex = (index) => {
        let table = this.state.matchingTable.getJson()[index];
        if(table) {
            this.video.seekToMills(table.mills, () => {
                const capturedScreen = this.video.getScreenshot();
                axios.post('http://localhost:5000/predict/', capturedScreen)
                .then((response) => { 
                    // Process received response
                    this.processResponse(response, index);
                    // Call it again recursively with next index
                    this.predictWithTableIndex(index+1);
                })
                .catch((error) => { console.log('error: ' + error); })
            });
        }
    }

    predictFrame = () => {
        const capturedScreen = this.video.getScreenshot();
        axios.post('http://localhost:5000/predict/', capturedScreen)
        .then((response) => { 
            // Process received response
            this.processResponse(response, null);
        })
        .catch((error) => { console.log('error: ' + error); })
    }

    processResponse = (response, index) => {
        this.resultIndicator.setResult(response.data);
        if(index != null)
            this.appendResult(response.data);

        // console.log(response);
    }

    buildTableByMatchingTable = () => {
        // console.log("buildTableByMatchingTable");
        if(this.state.matchingTable == null) return (null);

        const matchingTables = this.state.matchingTable.getJson();
        const predictResult = this.state.predictResult;
        const predictResultSize = predictResult.length;

        const listItems = matchingTables.map((table, index) =>
            <TableRow key={index}>
                <TableCell className={this.props.classes.cell}>{index}</TableCell>
                <TableCell className={this.props.classes.cell}>{table.mills}</TableCell>
                <TableCell className={this.props.classes.cell}>{table.expected}</TableCell>
                <TableCell className={(predictResult[index] == null) ? this.props.classes.cell :
                    (table.expected === predictResult[index]) ? this.props.classes.passedCell : this.props.classes.failedCell}>
                    {(index < predictResultSize) ? predictResult[index] : ""}
                </TableCell>
            </TableRow>
        );
        return (
            <div>
                <Divider className={this.props.classes.divider}/>
                <Paper className={this.props.classes.root}>
                    <Table className={this.props.classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className={this.props.classes.cell}>#</TableCell>
                                <TableCell className={this.props.classes.cell}>Mills</TableCell>
                                <TableCell className={this.props.classes.cell}>Expected</TableCell>
                                <TableCell className={this.props.classes.cell}>Result</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listItems}            
                        </TableBody>
                    </Table>
                </Paper>
            </div>
       );
    }

    render() {

        return (
            <div>
                <div className="LocalVideo-body">
                    <LocalVideo 
                        screenshotFormat="image/jpeg"
                        height={350*0.75}
                        width={350}
                        onUserMedia={this.handlePlayerEvent}
                        ref={this.setVideoRef}
                        />
                </div>
                <div className="MatchingTable-body">
                    Matching Table:
                    <input 
                        type="file"
                        accept=".json"
                        onChange={() => this.handleMatchingTableSelected()}
                        ref={(ref) => {this.matchingInput = ref}}
                    />
                </div>

                <ResultIndicator
                    innerRef={this.setResultIndicatorRef}
                    />
                    
                <Button 
                    className={this.props.classes.button}
                    variant='raised'
                    color="primary"
                    disabled={this.state.isStarted}
                    onClick={this.run} >Run</Button>

                <Button
                    className={this.props.classes.button}
                    variant='raised'
                    color="secondary"
                    disabled={this.state.isStarted}
                    onClick={this.predictFrame} >Predict frame</Button>

                {this.buildTableByMatchingTable()}

            </div>
        );
    }
}

export default withStyles(styles)(VideoIntervalCapture)
