import React, {Component} from 'react';
import firebase from 'firebase';
import withAuthorization from '../Session/withAuthorization';
import FileUploader from "react-firebase-file-uploader";
import { db } from '../../firebase'

class HomePage extends Component {

  state = {
    zadokaDay: "",
    zadokaFileName: "",
    isUploading: false,
    error: undefined,
    progress: 0,
    zadokaUrl: "",
    files: [],
  };

  constructor(props) {
    super(props);
  }

  onFileNameChanged = event =>
    this.setState({ zadokaDay: event.target.value });
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false, error: error });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ zadokaFileName: filename, progress: 100, isUploading: false, error: undefined });
    firebase
      .storage()
      .ref("daily")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ zadokaUrl: url }));

    db.doAddDailyZadoka(this.state.zadokaDay, filename);
  };

  customOnChangeHandler = (event) => {
    const  files = event.target.files;
    const filesToStore = [];

    for(let i = 0; i < files.length; i++) {
      filesToStore.push(files.item(i));
    }

    this.setState({ files: filesToStore });
  }

  startUploadManually = () => {
    const { files } = this.state;
    files.forEach(file => {
      this.fileUploader.startUpload(file)
    });
  }

  renderStatus() {
    if(this.state.isUploading){
      return(<label>Uploading</label>)
    } else if(this.state.error){
      return(<label>ERROR: {this.state.error}</label>)
    }
    return null;
  }

  render() {
    return(
      <div>
      <h1>Home Page</h1>
      <p>Upload files.</p>
      <div>
        <form>
          <input type="text" name="zadokaDay" onChange={this.onFileNameChanged} />
          <FileUploader
            accept="image/*"
            name="avatar"
            randomizeFilename
            storageRef={firebase.storage().ref("daily")}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            onChange={this.customOnChangeHandler} // ⇐ Call your handler
            ref={instance => { this.fileUploader = instance; } }  // ⇐ reference the component
          />
        </form>
        <button onClick={this.startUploadManually}>Upload</button>
        {this.renderStatus()}
      </div>
    </div>  
    )}
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);