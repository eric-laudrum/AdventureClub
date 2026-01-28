export default function CommentsList({ comments }){
    // Display component and pass comments loaded from server as a prop
    return(
        <>
        <h3 className="sub-title">Comments:</h3>
        {comments.map(comment =>(
            <div key={comment.text}>
                <h4>{comment.postedBy}</h4>
                <p>{comment.text} </p>
            </div>
        )
        )}
        </>
    )
}