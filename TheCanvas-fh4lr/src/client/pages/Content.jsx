import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getContent from '@wasp/queries/getContent';
import postComment from '@wasp/actions/postComment';

export function Content() {
  const { contentId } = useParams();

  const { data: content, isLoading, error } = useQuery(getContent, { variables: { contentId } });
  const postCommentFn = useAction(postComment);
  const [newComment, setNewComment] = useState('');

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleSubmitComment = () => {
    postCommentFn({ contentId, commentText: newComment });
    setNewComment('');
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>{content.title}</h2>
      <p className='mb-4'>{content.body}</p>

      <div className='mb-4'>
        <strong>Comments:</strong>
        <ul>
          {content.comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      </div>

      <div>
        <input
          type='text'
          placeholder='Add a comment'
          className='px-1 py-2 border rounded text-lg'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleSubmitComment}
          className='bg-blue-500 hover:bg-blue-700 px-2 py-2 text-white font-bold rounded'
        >
          Post Comment
        </button>
      </div>
      <div>
        <Link to={`/dashboard/${content.userId}`}>Go to creator's dashboard</Link>
      </div>
    </div>
  );
}