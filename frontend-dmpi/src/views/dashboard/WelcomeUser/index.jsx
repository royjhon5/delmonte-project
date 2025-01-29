import { Button, Stack, Typography, useTheme } from "@mui/material";
import WelcomeImage from "../../../components/svg-icons/dashboard/WelcomeImage";
import { SvgIconColors } from "../../../themes/palette";
import { useContext } from "react";
import { AuthContext } from "../../../modules/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { SET_MENU } from "../../../store/actions";


const WelcomeUser = () => {
  const theme = useTheme();
  const bgColor = SvgIconColors(theme.palette.appSettings);
  const OpenDrawer = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const { accessToken } = useContext(AuthContext);
  const openSettings = () => {
    dispatch({ type: SET_MENU, opened: !OpenDrawer });
  };

  return (
    <Stack sx={{
        display: 'flex',
        flexDirection: {
            xs: 'column', sm: 'column', md: 'row', lg: 'row', xl: 'row'
        },
        background: `${bgColor.svgcolor[300]}`,
        height: '100%',
        position: 'relative',
        color: 'rgb(0, 75, 80)',
        borderRadius: '16px'
    }}>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            WebkitBoxFlex: 1,
            flexGrow: 1,
            WebkitBoxPack: 'center',
            justifyContent: 'center',
            alignItems: {
                xs: 'center',
                sm: 'center',
                md: 'flex-start',
                lg: 'flex-start',
                xl: 'flex-start'
            },
            padding: '40px',
            textAlign: {
                xs: 'center', sm: 'center', md: 'left', lg: 'left', xl: 'left'
            },
        }}> 
            <Typography variant="h4" sx={{ 
                fontSize: '1.5rem',
                margin: '0px 0px 16px',
                fontWeight: 700,
                lineHeight: 1.5,
                whiteSpace: 'pre-line',
                color: `${bgColor.svgcolor[200]}`
            }}>Welcome back 👋 <br/> {accessToken.userName}</Typography>
            <Typography variant="body2" textAlign="justify" sx={{ color: `${bgColor.svgcolor[200]}`, mb: '35px' }}>Customize your design effortlessly with our unique web app. Click the settings button below or beside your profile icon. <br /> Enjoy! 😃</Typography>
            <Button onClick={openSettings} variant="contained" color="primary">Settings</Button>
        </Stack>
        <Stack component="span" sx={{
            display: 'flex',
            flexDirection: 'column',
            WebkitBoxPack: 'center',
            justifyContent: 'center',
            maxWidth: '360px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '24px',
        }}>
            <WelcomeImage />
        </Stack>
    </Stack>
  )
}

export default WelcomeUser