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
    progress: 0,
    zadokaUrl: ""
  };

  constructor(props) {
    super(props);
  }

  onFileNameChanged = event =>
    this.setState({ zadokaDay: event.target.value });
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ zadokaFileName: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("daily")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ zadokaUrl: url }));

    db.doAddDailyZadoka(this.state.zadokaDay, filename);
  };

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
          />
        </form>
      </div>
    </div>  
    )}
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);