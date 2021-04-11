import { Button, Input } from '@material-ui/core'
import React, { useState } from 'react'
import firebase from 'firebase'
import { storage, db } from './firebase';
import './ImageUpload.css'

function ImageUpload({username}) {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    console.log(image);
    const uploadHandler = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error);
                alert(error.message)
            },
            () => {
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url =>{
                    db.collection('posts').add({
                        timestemp: firebase.firestore.FieldValue.serverTimestamp(),
                        text: text,
                        Urlimg: url,
                        username : username
                    });
                    setProgress(0);
                    setText('');
                    setImage('');
                })
            }
        )
    }
    return (
        <div className='imageUpload'>
            <progress className='progressBar' value={progress} max="100"/>
            <Input type='text' placeholder='Enter caption' value={text} onChange={(Event) => setText(Event.target.value)}/>
            <Input type='file' onChange={handleChange}/>
            <Button onClick={uploadHandler}>upload</Button>
        </div>
    )
}

export default ImageUpload
