const { format, parse } = require('date-fns');
const { groupBy, map } = require('lodash');
const { raw } = require('objection');

const { NewsfeedItem } = require('../models/NewsfeedItem');

const { getNewsfeed: getNewsfeedSchema } = require('./schemas');


module.exports = async (fastify, options) => {

  fastify.get('/newsfeed', getNewsfeedSchema, async (request, reply) => {
    const { aggregate, limit, offset } = request.query;

    // Available aggregated periods
    const dateFormats = {
      minute: 'YYYY-MM-DD-HH-mm',
      hour:   'YYYY-MM-DD-HH',
      day:    'YYYY-MM-DD',
      week:   'YYYY-[W]WW',
      month:  'YYYY-MM',
    };

    const datePart  = aggregate && Object.keys(dateFormats).includes(aggregate) ? aggregate : 'day';

    const relations = Object.keys(NewsfeedItem.relationMappings);

    // Item ids, aggregate similar events per user daily
    let groupedQuery = NewsfeedItem.query()
      .select(raw('ARRAY_AGG(id) AS ids, DATE_TRUNC(?, created_at)', [datePart]))
      .groupByRaw('user_id, class, type, 2', )
      .orderByRaw('2 DESC');

    if (limit) {
      groupedQuery = groupedQuery.limit(Math.max(1, Math.min(limit, 100)));
    }

    if (offset) {
      groupedQuery = groupedQuery.offset(offset);
    }

    // Fetch all items, can be more than requested limit if aggregating
    const query = NewsfeedItem.query()
      .eager(`[${relations.join(', ')}]`)
      .whereIn('id', function() {
        this.select(raw('UNNEST(grouped.ids)')).from(groupedQuery.as('grouped'));
      });

    const data = await query.select().orderBy('id', 'DESC');

    // Group by aggregated period per user
    const dateFormat = dateFormats[datePart];

    const grouped = groupBy(data, item => {
      return `${item.user_id}:${format(parse(item.created_at), dateFormat)}-${item.class}.${item.type}`;
    });

    return { data: Object.values(grouped) };
  });

};
