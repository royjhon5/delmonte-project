import { Box, FormHelperText, IconButton, InputAdornment, TextField } from "@mui/material"
import { Formik } from "formik";
import * as Yup from 'yup';
import useScriptRef from "../../../../hooks/useScriptRef";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CustomLoadingButton from "../../../../components/CustomLoadingButton";
import { useAuth } from "../../../../modules/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import http from "../../../../api/http";
import { toast } from "sonner";

const UpdateFormPass = ({ ...others }) => {
  const scriptedRef = useScriptRef();
  const { accessToken, passwordChanged } = useAuth();
  console.log()
  const [ loadingBtn, setLoadingBtn ]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleSubmit = async (values) => {
    setLoadingBtn(true)
    const UserRegistrationData = { 
      LoginID: accessToken.userID,
      Password: values.password
    };
    try {
      await UserData.mutateAsync(UserRegistrationData);
    } catch (error) {
      console.error('Error saving cash voucher:', error);
      toast.error('Failed to save cash voucher.');
    }
  };
  const UserData = useMutation({
    mutationFn: (UserRegistrationData) => http.post('/change-password', UserRegistrationData),
    onSuccess: () => {
        toast.success('Password has been updated.');
        setLoadingBtn(false);
        passwordChanged();
    },
    onError: (error) => {
      toast.error(error)
    }
  });

  

  return (
    <>
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255)
          .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?/~`[\]\\=-]).{6,}$/, 'Password must contain at least 1 letter, 1 number, and 1 special character, and be at least 6 characters long')
          .required('Password must contain at least 1 letter, 1 number, and 1 special character, and be at least 6 characters long'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          handleSubmit(values);
          try {
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <CustomLoadingButton 
                btnClick={handleSubmit}
                isDisabled={loadingBtn}
                btnVariant="contained"
                label={loadingBtn ? 'Changing Password ...' : 'Change Password'}
                type="submit"
                fullWidth={true}
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
    </>
  )
}

export default UpdateFormPass