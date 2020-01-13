import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { CrudActions, getAction, getFeature } from '@nestjsx/crud';

import { Topic, TopicActions } from './topics/topic.entity';
import { TopicsService } from './topics/topics.service';

const LOG_CONTEXT = 'ForumGuard';

@Injectable()
export class ForumGuard implements CanActivate {
  constructor(readonly topicsService: TopicsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controller = context.getClass();
    const feature = getFeature(controller);
    const action = getAction(handler);

    const request = context.switchToHttp().getRequest();
    const { params, user } = request;
    const roles = user?.roles || [];

    switch (feature) {
      case 'Posts':
        const { topicId } = params;
        const topic: Topic = await this.topicsService.findOne(topicId, { relations: ['area'] });

        request.topic = topic;

        switch (action) {
          case CrudActions.CreateOne:
            return topic.allows(TopicActions.CreatePost, roles);
          case CrudActions.ReadOne:
          case CrudActions.ReadAll:
            return topic.allows(TopicActions.ReadOne, roles);
        }
        break;
    }

    Logger.log(`Unhandled action: ${feature} ${action}`, LOG_CONTEXT);

    return false;
  }
}
