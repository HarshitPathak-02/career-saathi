import { GeneratedResource } from '../roadmaps/roadmap.types.js';
import { ResourceResponse } from './resource.types.js';

export const toResourceResponse = (
    resource: GeneratedResource
): ResourceResponse => ({

    type: resource.type,

    title: resource.title,

    url: resource.url,

    platform: resource.platform,

    author: resource.author,

    estimatedMinutes: resource.estimatedMinutes,
});