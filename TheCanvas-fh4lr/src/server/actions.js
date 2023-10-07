import HttpError from '@wasp/core/HttpError.js'

export const createContent = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  return context.entities.Content.create({
    data: {
      title: args.title,
      body: args.body,
      category: args.category,
      tags: args.tags,
      isPublic: args.isPublic,
      userId: context.user.id
    }
  });
}

export const updateContent = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const content = await context.entities.Content.findUnique({
    where: { id: args.id }
  });
  if (content.userId !== context.user.id) { throw new HttpError(403) };

  return context.entities.Content.update({
    where: { id: args.id },
    data: { category: args.category, isPublic: args.isPublic, title: args.title, body: args.body, tags: args.tags }
  });
}

export const deleteContent = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const content = await context.entities.Content.findUnique({
    where: { id: args.id }
  });

  if (content.userId !== context.user.id) { throw new HttpError(403) }

  await context.entities.Content.delete({
    where: { id: args.id }
  });
}

export const subscribe = async ({ creatorId, subscriptionTier }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const creator = await context.entities.User.findUnique({
    where: { id: creatorId }
  });

  if (!creator) { throw new HttpError(404) };

  const subscriber = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  if (!subscriber) { throw new HttpError(404) };

  return context.entities.Subscription.create({
    data: {
      name: `Subscription to ${creator.username}`,
      price: subscriptionTier,
      userId: creatorId,
      subscriberId: context.user.id
    }
  });
}

export const postComment = async ({ contentId, commentText }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const content = await context.entities.Content.findUnique({
    where: { id: contentId }
  });
  if (!content) { throw new HttpError(404) };

  const newComment = await context.entities.Comment.create({
    data: {
      text: commentText,
      content: { connect: { id: content.id } },
      user: { connect: { id: context.user.id } }
    }
  });

  return newComment;
}

export const deleteComment = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const comment = await context.entities.Comment.findUnique({
    where: { id: args.id }
  });
  if (comment.userId !== context.user.id) { throw new HttpError(403) }

  await context.entities.Comment.delete({
    where: { id: args.id }
  });
}