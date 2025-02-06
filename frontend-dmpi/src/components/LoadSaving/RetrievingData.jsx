import { Box, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import XSDotFlash from "../DotFlash/xsDotFlash";


export default function CustomLoading(props) {
    const { title } = props;
    return(
        <Box sx={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <CircularProgress size="28px" />
            <Typography>{title} <XSDotFlash /> </Typography>
        </Box>
    )
}

CustomLoading.propTypes = {
    title: PropTypes.string,
};