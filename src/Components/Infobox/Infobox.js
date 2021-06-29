import React from 'react';
import './Infobox.css';
import { Card, Typography, CardContent } from '@material-ui/core';

function Infobox( { title, cases, active, total, isRed, isBlack, ...props } ) {
    return (
        <Card onClick={props.onClick} className={`infobox ${active && 'infobox--selected'} ${isRed && 'infobox--red'} ${isBlack && 'infobox--black'}`}>
            <CardContent>
                <Typography className="infobox_title" color="textSecondary">{title}</Typography>
                <h2 className={`infobox_cases ${isRed && 'infobox--red'} ${isBlack && 'infobox--black'}`}>{cases}</h2>
                <Typography className="infobox_total" color="textSecondary">
                    Total {" "} {total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox;
