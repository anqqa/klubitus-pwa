import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';

import { Post, PostsQuery } from './posts.dto';
import { PostsService } from './posts.service';

@ApiUseTags('Forum')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ title: 'List posts for topic' })
  @ApiOkResponse({ type: Post, isArray: true })
  @ApiNotFoundResponse({ description: 'Topic not found.' })
  @ApiForbiddenResponse({ description: 'Topic not accessible.' })
  @Get()
  async getAll(@Query() query: PostsQuery): Promise<Post[]> {
    return await this.postsService.findAll(query);
  }

  @ApiOperation({ title: 'Get a post' })
  @ApiOkResponse({ type: Post })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number): Promise<Post> {
    return await this.postsService.get(id);
  }
}
