import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';

import { TransformerInterceptor } from '../../common/interceptors/transformer.interceptor';
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
  @UseInterceptors(new TransformerInterceptor(Post))
  @Get()
  async getAll(@Query() query: PostsQuery) {
    return await this.postsService.findAll(query);
  }

  @ApiOperation({ title: 'Get a post' })
  @ApiOkResponse({ type: Post })
  @ApiNotFoundResponse({ description: 'Post not found.' })
  @UseInterceptors(new TransformerInterceptor(Post))
  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.postsService.get(id);
  }
}
