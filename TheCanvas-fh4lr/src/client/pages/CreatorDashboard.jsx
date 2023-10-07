import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getContent from '@wasp/queries/getContent';
import getUserProfile from '@wasp/queries/getUserProfile';
import getSubscription from '@wasp/queries/getSubscription';
import createContent from '@wasp/actions/createContent';
import updateContent from '@wasp/actions/updateContent';
import deleteContent from '@wasp/actions/deleteContent';
import subscribe from '@wasp/actions/subscribe';

export function CreatorDashboard() {
  const { creatorId } = useParams();

  const { data: content, isLoading: contentIsLoading, error: contentError } = useQuery(getContent, { creator: creatorId });
  const { data: userProfile, isLoading: userProfileIsLoading, error: userProfileError } = useQuery(getUserProfile, { userId: creatorId });
  const { data: subscription, isLoading: subscriptionIsLoading, error: subscriptionError } = useQuery(getSubscription, { creatorId: creatorId });

  const createContentFn = useAction(createContent);
  const updateContentFn = useAction(updateContent);
  const deleteContentFn = useAction(deleteContent);
  const subscribeFn = useAction(subscribe);

  if (contentIsLoading || userProfileIsLoading || subscriptionIsLoading) {
    return 'Loading...';
  }

  if (contentError || userProfileError || subscriptionError) {
    return 'Error: ' + (contentError || userProfileError || subscriptionError);
  }

  return (
    <div>
      <div>
        <h1>Creator Profile</h1>
        <p>Username: {userProfile.username}</p>
        <p>Bio: {userProfile.bio}</p>
        <p>Social Links: {userProfile.socialLinks}</p>
      </div>
      <div>
        <h2>Subscription</h2>
        <p>Name: {subscription.name}</p>
        <p>Price: {subscription.price}</p>
      </div>
      <div>
        <h2>Content</h2>
        {content.map((item) => (
          <div key={item.id}>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
            <p>Category: {item.category}</p>
            <p>Tags: {item.tags}</p>
            <button onClick={() => deleteContentFn({ contentId: item.id })}>Delete Content</button>
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const body = [...formData.entries()].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
            createContentFn(body);
            e.target.reset();
          }}
        >
          <h4>Create Content</h4>
          <input type='text' name='title' placeholder='Title' required />
          <textarea name='body' placeholder='Content' required></textarea>
          <input type='text' name='category' placeholder='Category' required />
          <input type='text' name='tags' placeholder='Tags' required />
          <button type='submit'>Create</button>
        </form>
      </div>
      <div>
        <h2>Actions</h2>
        <button onClick={() => subscribeFn({ userId: userProfile.id })}>Subscribe</button>
      </div>
    </div>
  );
}