import React, { Component } from "react";
import "./pic-upload.css";

class PicUpload extends Component {
  componentDidMount() {
    var input = document.getElementById("file_upload");
    input.addEventListener("change", readFile, false);
    var base64s = {};
    function readFile() {
      var files = this.files;
      //input.val("");
      //console.log(this.files);
      for (var i = 0; i < files.length; i++) {
        if (!/image\/\w+/.test(files[i].type)) {
          alert("Please make sure the file is an image");
          return false;
        }
        (function(foo) {
          var reader = new FileReader();
          reader.readAsDataURL(files[foo]);
          reader.onload = function(e) {
            var curImg = new Image();
            curImg.src = this.result;
            curImg.onload = function() {
              var expectWidth = this.naturalWidth;
              var expectHeight = this.naturalHeight;
              expectWidth = 500;
              expectHeight =
                (expectWidth * this.naturalHeight) / this.naturalWidth;

              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              canvas.width = expectWidth;
              canvas.height = expectHeight;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
              ctx.save();
              var base64 = canvas.toDataURL("image/jpeg", 0.5);

              var img = new Image(expectWidth / 4, expectHeight / 4);
              img.src = base64;
              base64s[files[foo].name] = base64;
              document.getElementById("container").appendChild(img);
            };
          };
        })(i);
      }
    }
    var form = document.getElementById("uploadForm");
    var fileSelect = document.getElementById("file_upload");
    var uploadButton = document.getElementById("upload-button");
    form.onsubmit = function(event) {
      event.preventDefault();

      // Update button text.
      uploadButton.value = "Uploading...";

      // The rest of the code will go here...
      // Get the selected files from the input.
      var files = fileSelect.files;
      // Create a new FormData object.
      var formData = new FormData();

      // Loop through each of the selected files.
      for (let i = 0; i < files.length; i++) {
        var file = files[i];

        // Check the file type.
        if (!file.type.match("image.*")) {
          continue;
        }

        // Add the file to the request.
        formData.append("photos", file, file.name);
      }
      // var bay = JSON.stringify(base64s);
      // console.log(bay);
      for (let i in base64s) {
        formData.append("base64Arr", i + "__baseSplit__" + base64s[i]);
      }
      // formData.append('base64Arr', bay);
      // Set up the request.
      var xhr = new XMLHttpRequest();

      // Open the connection.
      xhr.open("POST", "/upload", true);

      // Set up a handler for when the request finishes.
      xhr.onload = function() {
        if (xhr.status === 200) {
          // File(s) uploaded.
          uploadButton.value = "Upload";
        } else {
          uploadButton.value = "Upload failed, click to retry";
          console.log("An error occurred!");
        }
      };

      // Send the Data.
      xhr.send(formData);
    };
  }

  render() {
    return (
      <div>
        <form
          ref="uploadForm"
          id="uploadForm"
          action="/upload"
          method="post"
          encType="multipart/form-data"
        >
          <input
            type="file"
            id="file_upload"
            name="sampleFile"
            accept="image/*"
            multiple
          />
          <input type="submit" id="upload-button" value="Upload" />
        </form>
        <div id="container" />
      </div>
    );
  }
}

export default PicUpload;
