import StyledCollapsedButton from "../../../../../components/StyledListItemButton/StyledCollpasedButton/StyledCollpasedButton"
import SettingsIcon from '@mui/icons-material/Settings';

const SettingSection = () => {
  return (
    <>
    <StyledCollapsedButton 
     IconChildren={<SettingsIcon fontSize="small"/>}
     CollpaseBtnLabels="Settings"
    >

    </StyledCollapsedButton>
    </>
  )
}

export default SettingSection