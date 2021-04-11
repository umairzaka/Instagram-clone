import React, { useState , useEffect } from 'react';
import logo from './insta.png';
import './App.css';
import Post from './Posts';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { auth, db } from './firebase';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';



function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [post, SetPost] = useState([]); 
  const [open, SetOpen] = useState(false);
  const [openSignIn, SetOpenSignin] = useState(false)
  const [username, SetUsername] = useState('');
  const [email, SetEmail] = useState('');
  const [pasword, SetPasword] = useState('');
  const [user, SetUser] = useState(null);
  
  useEffect(() =>  {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        SetUser(authUser); 
      }
      else{
        SetUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])

  useEffect(() =>{
    db.collection('posts').orderBy('timestemp','desc').onSnapshot(snapshot =>{
      SetPost(snapshot.docs.map(doc => ({
        id : doc.id,
        posts:doc.data()
      })));
    })
  }, [])

 const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, pasword)
    .then((authUser) =>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) => alert(error.message))

    SetEmail('')
    SetPasword('')
    SetUsername('')
    SetOpen(false)
 }
   
 
 const signIn = (event) => {
  event.preventDefault();

  auth.signInWithEmailAndPassword(email, pasword)
  .catch((error) => alert(error.message))
  SetEmail('')
  SetPasword('')
  SetOpenSignin(false)
}
 


  return (

    <div className="App">

     
      


      <Modal
        open={open}
        onClose={() => SetOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          
            <form className="app-Signup">
              <center><img className="header-img" src={logo}/></center>
            
            <Input type='text' value={username} onChange={(Event) => SetUsername(Event.target.value)} placeholder='Username'  />
            <Input type='email' value={email} onChange={(Event) => SetEmail(Event.target.value)} placeholder='Email'  />
            <Input type='password' value={pasword} onChange={(Event) => SetPasword(Event.target.value)} placeholder='*********'  />
            <Button type="Submit" onClick={signUp} >Submit</Button>
            </form>  
           
          
        
            
        </div>   
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => SetOpenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          
            <form className="app-Signup">
              <center><img className="header-img" src={logo}/></center>
            
            
            <Input type='email' value={email} onChange={(Event) => SetEmail(Event.target.value)} placeholder='Email'  />
            <Input type='password' value={pasword} onChange={(Event) => SetPasword(Event.target.value)} placeholder='*********'  />
            <Button type="Submit" onClick={signIn} >Submit</Button>
            </form>  
           
          
        
            
        </div>   
      </Modal> 
      <header className="App-header">
        <img className="header-img" src={logo}/>
        {
        user ? (
        <Button  onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button  onClick={() => SetOpenSignin(true)}>Log In</Button>
            <Button  onClick={() => SetOpen(true)}>Sign Up</Button>
          </div>
        )
      }
      </header>

      
      
     
      <br></br>
      <div className='app_post'>
        
        {
          post.map(({id,posts}) => (
            <Post key={id} postId={id} user={user} username={posts.username} text={posts.text} Urlimg={posts.Urlimg}/>
          ) )
        }
         
        
       
       
     
      </div> 
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ):
      (
          <h3 className="error"><strong> Sorry to need to login for upload posts</strong></h3>
      )}


     
    
  

    </div>
  );
}

export default App;
