# YourShare
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PeerJS](https://img.shields.io/badge/PeerJS-BEE3F8?style=flat&logo=javascript&logoColor=black)](https://peerjs.com/) </br>

YourShare is a file-sharing application developed by Luka Bajto and Duje Žižić as a project for the Napredni Tečaj EDIT codeschool. This application leverages Cloud Storage for Firebase, PeerJS, and vanilla JavaScript to provide a peer-to-peer file-sharing experience.

## Features

-   **File Upload:** Users can upload files to Cloud Storage for Firebase.
-   **Peer-to-Peer Sharing:** Utilizes PeerJS to establish direct connections between users for file sharing.
-   **Real-time Updates:** Provides real-time updates on file transfer status.
-   **Simple Interface:** A user-friendly interface for easy file sharing.

## Technologies Used

-   **Cloud Storage for Firebase:** Used for storing and serving files.
-   **PeerJS:** Enables peer-to-peer communication between users.
-   **Vanilla JavaScript:** The primary language for front-end and application logic.
-   **HTML5/CSS3:** For structuring and styling the user interface.

## Setup Instructions

1.  **Clone the Repository:**

    -   Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    -   Enable Cloud Storage.
    -   Obtain your Firebase configuration.

3.  **Configuration:**
    -   Add your Firebase configuration to `/main/index.js`: </br> </br>
    
    ```js
    const firebaseConfig = {
      apiKey: "<YOUR_API_KEY>", // Replace the placeholder values
      authDomain: "<YOUR_AUTH_DOMAIN>",
      projectId: "<YOUR_PROJECT_ID>",
      storageBucket: "<YOUR_STORAGE_BUCKET>",
      messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
      appId: "<YOUR_APP_ID>"
    };
    
    firebase.initializeApp(firebaseConfig);
    const storage = firebase.storage();
    ```

4.  **PeerJS Setup:**
    - By default the current setup connects to the public PeerJS server available, you can fork this and just change the peer object initalization and connect to your own PeerJS server.

## Usage Guide

1.  **Host `first.html` in your browser.**
2.  **Upload a file using the provided interface.**
3.  **Share the generated peer ID with the recipient.**
4.  **The recipient enters the peer ID to establish a connection and receive the file, you can also send messages.**

## Project Structure

We welcome contributions to EDITSharing! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request.

> Please follow our coding standards and guidelines when contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Contact me via my github profile.
