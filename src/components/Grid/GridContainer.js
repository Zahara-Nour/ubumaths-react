import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = {
  grid: {
    // margin: "0 -15px",
    // width: "calc(100% + 30px)"
    // grid: {
    //   padding: "0 15px !important"
    // }
    // '&:before,&:after':{
    //   display: 'table',
    //   content: '" "',
    // },
    // '&:after':{
    //   clear: 'both',
    // }
  }
};

const useStyles = makeStyles(styles);

export default function GridContainer(props) {
  const classes = useStyles();
  const { children, className, spacing=2,...rest  } = props;
  return (
    <Grid container spacing = {spacing} {...rest} className={classes.grid + " " + className}>
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};
