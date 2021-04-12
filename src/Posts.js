import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";
function Posts({username,postId, user, text, Urlimg}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
      let unsubscribe;
      if (postId) {
        unsubscribe = db
          .collection("posts")
          .doc(postId)
          .collection("comments")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((doc) => doc.data()));
          });
      }
      return () => {
        unsubscribe();
      };
    }, [postId]);
    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
          text: comment,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
      };
    return (
        <div className="post">
            <div className="post-header">
            <Avatar className="post-avatar" alt={username} src="/static/images/avatar/1.jpg" />

               
                <h3>{username}</h3>
            </div>
           
           <img className="post-img" src={Urlimg} />
            <h4 className="post-text"><strong>{username} :</strong>  {text} </h4>  
        
            <div className="post__comments">
                
                {comments.map((comment) => (
                <p>
                    <strong>{comment.username}: </strong>
                    {comment.text}
                </p>
                ))}
            </div>
            {user && (
                <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add your comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </button>
                </form>
            )}
        </div>
    )
}

export default Posts