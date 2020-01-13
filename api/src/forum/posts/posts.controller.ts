import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudAuth, CrudController, Feature } from '@nestjsx/crud';

import { authDecorators } from '../../common/decorators';
import { User } from '../../users/user.entity';
import { ForumGuard } from '../forum.guard';
import { Topic } from '../topics/topic.entity';
import { dto } from './dto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

@Crud({
  dto,
  model: { type: Post },
  params: {
    id: { field: 'id', type: 'number', primary: true },
    topicId: { field: 'forum_topic_id', type: 'number' },
  },
  query: {
    join: {
      area: { allow: ['id', 'name'] },
      author: { allow: ['avatar_url', 'id', 'signature', 'title', 'username'] },
      topic: {},
    },
  },
  routes: {
    createOneBase: { decorators: [...authDecorators()] },
    only: ['createOneBase', 'getManyBase', 'getOneBase'],
  },
})
@CrudAuth({
  persist: (req: { topic: Topic; user: User }) => ({
    area: req.topic.area,
    author: req.user,
    author_name: req.user.username,
  }),
})
@ApiTags('Forum')
@Feature('Posts')
@UseGuards(ForumGuard)
@Controller('/topics/:topicId/posts')
export class PostsController implements CrudController<Post> {
  constructor(readonly service: PostsService) {}

  get base(): CrudController<Post> {
    return this;
  }
}
