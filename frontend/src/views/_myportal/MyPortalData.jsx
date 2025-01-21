import { Grid, Paper, Typography, Grow, Button, TextField, IconButton, Box } from "@mui/material";
import { hookContainer } from "../../hooks/globalQuery";
import { useAuth } from "../../modules/context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import FolderImag from '../../assets/images/folder.png'
import { Fragment, useCallback, useState } from "react";
import CreateNewFolder from "./_CreateNewFolder";
import { useDispatch } from "react-redux";
import { FOLDER_LISTOBJ, ISTOUPDATE_FOLDER, ISTOUPDATE_SUBFOLDER, OPEN_CREATENEWFOLDER, OPEN_CREATENEWSUBFOLDER, PASSID_LINK, SUBFOLDER_LISTOBJ } from "../../store/actions";
import { useQueryClient } from "@tanstack/react-query";
import DeleteIcon from '@mui/icons-material/Delete';
import http from "../../api/http";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateNewSubFolder from "./_CreateNewSubFolder";
import { toast } from "sonner";
import CreateNewFiles from "./_CreateNewFiles";
import { FileUploader } from "react-drag-drop-files";
import Iframe from "react-iframe";
import PdfFileIcon from '../../assets/images/file.png'
import JpegFileIcon from '../../assets/images/jpg.png'
import PerfectScrollbar from 'react-perfect-scrollbar'

const MyPortalData = () => {
  const { accessToken } = useAuth();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const { data: mainfolder } = hookContainer('/my-portal-folder-list', { user_id_link: accessToken.userID });
  const [subfolder, setFolder] = useState([]);
  const [search, setSearch] = useState('');
  const OpenCreateNewFolder = () => dispatch({ type: OPEN_CREATENEWFOLDER, openCreateNewFolder: true });
  const OpenCreateNewSubFolder = () => dispatch({ type: OPEN_CREATENEWSUBFOLDER, openCreateSubNewFolder: true });
  const [hoveredFolder, setHoveredFolder] = useState(null);
  const refreshData = () => queryClient.invalidateQueries(['/my-portal-folder-list']);
  const refreshSubData = () => getSubFolder(selectedFolderId);
  const [file, setFile] = useState(null);
  const fileTypes = ["JPEG", "JPG", "PDF"];
  const [selectedSubFolderId, setSelectedSubFolderId] = useState('');
  const [selectedSubName, setSelectedSubName] = useState('');
  const [subFolderFiles, setSubFolderFiles] = useState([]);
  const [extensionFileName, setExtensionFilename] = useState('');
  const [iframePath, setIframePath] = useState("");
  console.log(extensionFileName);


  const doubleClickToEdit = (folderData) => {
    dispatch({ type: FOLDER_LISTOBJ, folderData: folderData });
    dispatch({ type: OPEN_CREATENEWFOLDER, openCreateNewFolder: true });
    dispatch({ type: ISTOUPDATE_FOLDER, isToUpdateFolder: true });
  }

  const doubleClickToEditSubFolder = (subfolderData) => {
    dispatch({ type: SUBFOLDER_LISTOBJ, SubfolderData: subfolderData });
    dispatch({ type: OPEN_CREATENEWSUBFOLDER, openCreateSubNewFolder: true });
    dispatch({ type: ISTOUPDATE_SUBFOLDER, isToUpdateSubFolder: true });
  }

  const filteredFolders = mainfolder?.filter((folder) =>
    folder.folder_name.toLowerCase().includes(search.toLowerCase())
  );

  const getSubFolder = useCallback(async (id_link) => {
    try {
      const response = await http.get(`/my-portal-subfolder-list?id_link=${id_link}`);
      setFolder(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onClickToSubFolder = (data) => {
    setSelectedFolderId(data);
    getSubFolder(data);
    dispatch({ type: PASSID_LINK, passIdlink: data });
  }

  const getsubFolderFiles = useCallback(async (id_link) => {
    try {
      const response = await http.get(`/my-portal-files?sub_id_link=${id_link}`);
      setSubFolderFiles(response.data);
      const extensions = Array.from(
        new Set(
          response.data.map(file =>
            file.file_name.split('.').pop().toLowerCase()
          )
        )
      );
      setExtensionFilename(extensions);
    } catch (error) {
      console.error(error);
    }
  }, []);


  const onClickToCreateFiles = (data) => {
    setSelectedSubFolderId(data.id);
    getsubFolderFiles(data.id);
    setSelectedSubName(data.sub_folder_name);
    setIframePath(null)
  }

  const GoBackToMainFolder = () => {
    setSelectedFolderId(null) 
    setSelectedSubFolderId(null)
    setFile('');
  }

  const filteredSubfolders = subfolder?.filter((folder) =>
    folder.sub_folder_name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteMainFolder = async (folder) => {
    const response = await http.get(`/my-portal-subfolder-list?id_link=${folder.id}`);
    if (response.data.length > 0) {
      toast.error("Folder has subfolders and cannot be deleted.");
    } else {
      try {
        await http.delete(`/delete-mainfolder?id=${folder.id}`);
        refreshData();
      } catch (error) {
        console.error("Failed to delete folder:", error);
        toast.error("Failed to delete folder. Please try again.");
      }
    }
  };

  const handleChange = (file) => {
    setFile(file);
  };

  function getDateNow(type = "date") {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    if (type == "date") return `${year}-${month}-${day}`;
    if (type == "year") return `${year}`;
    if (type == "day") return `${day}`;
    if (type == "month") return `${month}`;
    if (type == "hour") return `${hour}`;
    if (type == "minute") return `${minute}`;
    if (type == "second") return `${second}`;
    return false;
}


  const handleUpload = async () => {
    if(!file) return toast.error('Error: No image has been attached.');
    const extension = file[0].name.split('.')[file[0].name.split('.').length - 1];
    const dateTimeNow = getDateNow('year') + "" + getDateNow('month') + "" + getDateNow('day') + "" + getDateNow('hour') + "" + getDateNow('minute') + "" + getDateNow('second');
    try { 
      const uploadData = new FormData();
      uploadData.append('filename', encodeURI(btoa(file[0].name.split('.')[0]) + "_" + dateTimeNow) + "." + extension);
      uploadData.append('file', file[0]);
      const uploadResponse  = await http.post('/upload-my-portal-files', uploadData, { headers: { 'Content-Type': 'multipart/form-data'}});
      if (!uploadResponse.data.success) return alert(uploadResponse.data.message);
      const saveResponse = await http.post('/save-my-portal-files', {
        sub_id_link: selectedSubFolderId,
        file_path: encodeURI(btoa(file[0].name.split('.')[0]) + "_" + dateTimeNow) + "." + extension,
        filesize: file[0].size,
        file_name: file[0].name,
      });
      if (saveResponse.status === 200) {
        toast.success('File and data saved successfully!');
        getsubFolderFiles(selectedSubFolderId);
        setFile(null);
      } else {
        toast.error('Error saving data. Please try again.');
      }
    } catch(error) {
      console.error(error);
    } 
  }

  const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

  const getPreviewFile = async (file_path) => {
    
    setIframePath("");
    try {
        const response = await http.get('/preview-file', {
            params: {
                filePath: file_path.file_path,
            }
        });
        if (response.data.success) {
            const blobUrl = await URL.createObjectURL(b64toBlob(response.data.base64Data, response.data.mimeType));
            setIframePath(blobUrl);
        }
        else toast.error(response.data.message);
    } catch (error) {
        console.error(error);
        toast.error('Connection failed!');
    }
};

  return (
    <Fragment>
      <CreateNewFolder RefreshData={refreshData} />
      <CreateNewSubFolder RefreshData={refreshSubData} />
      <CreateNewFiles />
      <Grid container spacing={1}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ padding: 2 }}>
            <Grid container spacing={0.5}>
              {selectedFolderId ? (
                <>
                <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <TextField size="small" fullWidth label="Search sub folder" value={search} onChange={(e) => setSearch(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button variant="contained" size="small" onClick={GoBackToMainFolder} fullWidth startIcon={<ArrowBackIcon />}>Back</Button>
                </Grid>
                <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button variant="contained" size="small" fullWidth startIcon={<AddIcon />} onClick={OpenCreateNewSubFolder}>Create new sub folder</Button>
                </Grid>
                </>
              ) : (
                <>
                <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TextField size="small" fullWidth label="Search folder" value={search} onChange={(e) => setSearch(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="contained" size="small" fullWidth startIcon={<AddIcon />} onClick={OpenCreateNewFolder}>Create new folder</Button>
              </Grid>
                </>
              )}
              {selectedFolderId ? (
                <>
                  <Box sx={{width:'100%', height: 400, maxHeight:'100%', mt:3}}>
                  <PerfectScrollbar>
                  <Grid container spacing={0.5}>
                  {filteredSubfolders?.map((sub, index) => (
                    <Grow in={true} style={{ transitionDelay: `${index * 1}ms` }} key={sub.id}>
                      <Grid item xs={6} md={3} sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2 }}
                        onDoubleClick={() => doubleClickToEditSubFolder(sub)}
                      >
                        <img src={FolderImag} alt="" onClick={() => onClickToCreateFiles(sub)} />
                        <Typography fontSize={10} textAlign="center">{sub.sub_folder_name}</Typography>
                      </Grid>
                    </Grow>
                  ))}
                  </Grid>
                  </PerfectScrollbar>
                  </Box>
                </>
              ) : (
                <Box sx={{width:'100%', height: 400, maxHeight:'100%', mt:3}}>
                  <PerfectScrollbar>
                  <Grid container spacing={0.5}>
                  {filteredFolders?.map((folder, index) => (
                  <Grow in={true} style={{ transitionDelay: `${index * 1}ms` }} key={folder.id}>
                    <Grid item xs={6} md={3}
                      sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2, position: 'relative' }}
                      onMouseEnter={() => setHoveredFolder(folder.id)}
                      onMouseLeave={() => setHoveredFolder(null)}
                      onDoubleClick={() => doubleClickToEdit(folder)}
                    >
                      <img src={FolderImag} alt="" onClick={() => onClickToSubFolder(folder.id)} />
                      <Typography fontSize={10} textAlign="center">{folder.folder_name}</Typography>
                      {hoveredFolder === folder.id && (
                        <Grow in={true}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteMainFolder(folder)}
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              minWidth: 'auto',
                              padding: 0,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Grow>
                      )}
                    </Grid>
                  </Grow>
                ))}
                  </Grid>
                  </PerfectScrollbar>
                </Box>
              )}
            </Grid>
          </Paper>
        </Grid>

        { selectedSubFolderId ?
         (
          <Grow in={true}>
            <Grid item xs={12} md={3}>
            <Paper sx={{padding:1, mb:1}}>
              Selected folder : {selectedSubFolderId ? selectedSubName : ''}
            </Paper>

            <Paper sx={{padding:1 , mb:1, height: 480, maxHeight: '100%'}}>
            <PerfectScrollbar>
              <Grid container spacing={1} sx={{justifyContent:'flex-start', alignItems:'flex-start'}}>
              {subFolderFiles.map((file, index) => {
                const fileExtension = file.file_name.split('.').pop().toLowerCase();
                return (
                  <Grow in={true} style={{ transitionDelay: `${index * 1}ms` }} key={index}>
                  <Grid  item xs={6} md={3} sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2 }}
                        onDoubleClick={() => doubleClickToEditSubFolder(file)}
                      >
                    {fileExtension === 'pdf' ? (
                      <Fragment>
                        <img
                        src={PdfFileIcon}
                        alt="PDF Icon"
                        onClick={() => getPreviewFile(file)}
                      />
                      <Typography fontSize={10} textAlign="center" sx={{wordWrap:'break-word', width: 50}}>{file.file_name}</Typography>
                      </Fragment>
                    ) : fileExtension === 'jpg' || fileExtension === 'jpeg' ? (
                      <Fragment>
                        <img
                        src={JpegFileIcon}
                        alt="JPEG Icon"
                        onClick={() => getPreviewFile(file)}
                      />
                      <Typography fontSize={10} textAlign="center" sx={{wordWrap:'break-word', width:50}}>{file.file_name}</Typography>
                      </Fragment>
                    ) : (
                      ''
                    )}
                  </Grid>
                  </Grow>
                );
              })}
              </Grid>
              </PerfectScrollbar>
            </Paper>

            <Paper sx={{padding:1, display: 'flex', flexDirection:'column', gap:1}}>
            {file ? (
              <>
                  <TextField variant="standard" size="small" value={file[0].name} fullWidth label="File name" />
                  <TextField variant="standard" size="small" value={(file[0].size / 1024).toFixed(2)} fullWidth label="File Size (KB)" />
              </>
            ) : (
              ''
            )}
            <FileUploader
              multiple={true}
              handleChange={handleChange}
              name="file"
              types={fileTypes}
            />
            <Button variant="contained" fullWidth onClick={handleUpload}>
              Upload file
            </Button>
            </Paper>
        </Grid>
          </Grow>
         ) : (
          ''
         )
        }


      { selectedSubFolderId ?
         (
          <Grow in={true}>
            <Grid item xs={12} md={6}>
            <Paper sx={{padding:1, mb:1}}>
            <Iframe width="100%" height="700px" src={iframePath} alt='not found' ></Iframe>
            </Paper>
        </Grid>
          </Grow>
         ) : (
          ''
         )
        }
        


      </Grid>
    </Fragment>
  );
};

export default MyPortalData;
