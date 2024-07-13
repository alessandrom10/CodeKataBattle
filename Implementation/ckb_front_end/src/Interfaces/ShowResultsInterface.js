import React, { useEffect } from 'react';
import { useState } from 'react';
import { CustomAppBar } from '../CustomComponents/CustomAppBar';
import { useLocation } from 'react-router-dom';
import { getGroupsOfBattle } from '../CallsHandling/DatabaseInteractionManager';
import { Toolbar } from '@mui/material';
import { Paper } from '@mui/material';
import { Table } from '@mui/material';
import { TableContainer } from '@mui/material';
import { TableHead } from '@mui/material';
import { TableRow } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableBody } from '@mui/material';
import { getToken } from '../Utility/LocalStorageSaver';
import { getTournamentScores } from '../CallsHandling/DatabaseInteractionManager';


export const ShowResultsInterface = () => {
    
    const location = useLocation();
    const { id, scope } = location.state;

    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (scope === "battle") {
                const result = await getGroupsOfBattle(getToken(),id);
                setGroups(result);
            } else {
                const result = await getTournamentScores(getToken(),id);
                result.sort((a, b) => b.score - a.score);
                setUsers(result);
            }
        };

        fetchData();
    }, []);

    return(
        <>
        {scope === "battle" && (
            <CustomAppBar title={`Battle Results`} position="fixed"/>
        )}
        {scope === "tournament" && (
            <CustomAppBar title={`Tournament Resouls`} position="fixed"/>
        )}
        <Toolbar />
        {scope === "battle" && (
            <>
            <TableContainer component={Paper} style={{ width: '65%', margin: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ width: '50%' }}>Group Name</TableCell>
                            <TableCell align="center" style={{ width: '50%' }}>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups.map((group) => (
                            <TableRow key={group.name}>
                                <TableCell component="th" scope="row" align="center" style={{ width: '50%' }}>
                                    {group.name}
                                </TableCell>
                                <TableCell align="center" style={{ width: '50%' }}>{group.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </>
        )}
        {scope === "tournament" && (
            <>
            <TableContainer component={Paper} style={{ width: '65%', margin: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ width: '50%' }}>User e-mail</TableCell>
                            <TableCell align="center" style={{ width: '50%' }}>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.email}>
                                <TableCell component="th" scope="row" align="center" style={{ width: '50%' }}>
                                    {user.email}
                                </TableCell>
                                <TableCell align="center" style={{ width: '50%' }}>{user.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </>
        )}
        </>
    );
};