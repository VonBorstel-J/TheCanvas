import HttpError from '@wasp/core/HttpError.js'

export const getContent = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { id, category, tags, creator } = args;

  let contents = [];

  if (id) {
    const content = await context.entities.Content.findUnique({ where: { id } });
    if (content) {
      contents.push(content);
    }
  } else if (category) {
    contents = await context.entities.Content.findMany({ where: { category } });
  } else if (tags) {
    const tagList = tags.split(',').map(tag => tag.trim());
    contents = await context.entities.Content.findMany({ where: { tags: { hasSome: tagList } } });
  } else if (creator) {
    const user = await context.entities.User.findUnique({ where: { username: creator } });
    if (user) {
      contents = await context.entities.Content.findMany({ where: { userId: user.id } });
    }
  }

  return contents;
}

export const getUserProfile = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: args.userId },
    select: {
      id: true,
      username: true,
      bio: true,
      profileImage: true,
      socialLinks: true
    }
  });

  if (!user) throw new HttpError(404, 'User not found');

  return user;
}

export const getSubscription = async (args, context) => {
  if (!context.user) { throw new HttpError(401); }

  const { subscriptionId } = args;

  const subscription = await context.entities.Subscription.findUnique({
    where: {
      id: subscriptionId,
      userId: context.user.id
    }
  });

  if (!subscription) { throw new HttpError(404, `Subscription with id ${subscriptionId} not found.`); }

  return subscription;
}